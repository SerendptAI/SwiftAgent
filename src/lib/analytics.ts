import type { PostHog } from "posthog-js";

import { stripLocalePrefix } from "@/lib/locale-path";

/**
 * Same-origin path that next.config.ts rewrites to PostHog — calling their
 * domain directly loses every ad-blocked visitor.
 */
const INGEST_PROXY_PATH = "/ingest";

/** Where the PostHog app itself lives — used by the toolbar, not for ingestion. */
const POSTHOG_APP_HOST = "https://us.posthog.com";

const PROJECT_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * Session replay runs on the public marketing site only — every other surface
 * renders our customers' end-user PII or collects credentials. Anything absent
 * here is treated as private.
 */
const REPLAY_ROUTES = [
  "/",
  "/landing",
  "/products",
  "/agents",
  "/case-studies",
  "/demo",
  "/affiliate",
  "/refer",
  "/privacy-policy",
  "/signup",
];

export type DemoCtaLocation =
  | "landing-hero"
  | "landing-platforms"
  | "landing-cta"
  | "roi-simulator"
  | "scale-support-hero"
  | "pricing-enterprise";

/** Every product event and its properties — the single source of truth for both. */
type AnalyticsEventMap = {
  demo_booking_clicked: { location: DemoCtaLocation };
  signup_interest_submitted: { customer_size: string };
  login_otp_requested: { otp_required: boolean };
  login_completed: { method: "email" | "google" };
  onboarding_step_completed: { step_index: number; step_name: string };
};

/** The subset of the current user that PostHog is allowed to know about. */
interface AnalyticsUser {
  id: string;
  email: string;
  name?: string;
  company_id?: string;
  auth_provider?: string;
  onboarding_completed?: boolean;
}

/**
 * posthog-js is ~74 kB gzipped, so it loads on demand instead of in every
 * route's first-load bundle; all calls below queue behind this one promise.
 */
let clientPromise: Promise<PostHog> | null = null;

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Null on the server, on localhost, and when no key is configured — local dev
 * runs with the production key in .env and must stay out of the real data.
 */
function getProjectKey() {
  if (typeof window === "undefined") return null;
  if (LOCAL_HOSTNAMES.has(window.location.hostname)) return null;
  return PROJECT_KEY || null;
}

function loadClient() {
  const projectKey = getProjectKey();
  if (!projectKey) return null;

  clientPromise ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(projectKey, {
      api_host: INGEST_PROXY_PATH,
      ui_host: POSTHOG_APP_HOST,
      capture_pageview: "history_change",
      capture_pageleave: true,
      // Anonymous traffic is billed as events only; identifyUser creates the profile.
      person_profiles: "identified_only",
      // Started per-route by setSessionRecording once the pathname is known.
      disable_session_recording: true,
      session_recording: { maskAllInputs: true },
      // Nothing is captured or persisted until the consent banner's grantConsent.
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
    });
    return posthog;
  });

  return clientPromise;
}

function withPostHog(use: (posthog: PostHog) => void) {
  loadClient()
    ?.then(use)
    .catch(() => {
      // Analytics failures are never user-facing; rethrowing would only
      // surface as a noisy unhandled rejection.
    });
}

export function initAnalytics() {
  loadClient();
}

export function trackEvent<TEvent extends keyof AnalyticsEventMap>(
  event: TEvent,
  properties: AnalyticsEventMap[TEvent],
) {
  withPostHog((posthog) => posthog.capture(event, properties));
}

/**
 * identify() before consent is dropped by the SDK, so the latest user is
 * replayed on grantConsent — otherwise a pre-consent login stays anonymous
 * until the next full page load.
 */
let lastIdentifiedUser: AnalyticsUser | null = null;

function sendIdentity(posthog: PostHog, user: AnalyticsUser) {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    company_id: user.company_id,
    auth_provider: user.auth_provider,
    onboarding_completed: user.onboarding_completed,
  });
}

export function identifyUser(user: AnalyticsUser) {
  lastIdentifiedUser = user;
  withPostHog((posthog) => sendIdentity(posthog, user));
}

/** Ends the identified session so the next visitor on this device starts clean. */
export function resetAnalytics() {
  lastIdentifiedUser = null;
  withPostHog((posthog) => posthog.reset());
}

export type ConsentStatus = "granted" | "denied" | "pending";

/** Resolves null when analytics is off entirely (no key, or on the server). */
export async function getConsentStatus(): Promise<ConsentStatus | null> {
  const client = loadClient();
  if (!client) return null;

  return (await client).get_explicit_consent_status();
}

export function grantConsent(pathname: string) {
  withPostHog((posthog) => {
    // The pageview that loaded this page was dropped pre-consent; capturing
    // it as the opt-in event keeps the funnel whole.
    posthog.opt_in_capturing({ captureEventName: "$pageview" });

    if (lastIdentifiedUser) sendIdentity(posthog, lastIdentifiedUser);
    if (shouldRecordSession(pathname)) posthog.startSessionRecording();
  });
}

export function denyConsent() {
  withPostHog((posthog) => posthog.opt_out_capturing());
}

export function shouldRecordSession(pathname: string) {
  const route = stripLocalePrefix(pathname);

  return REPLAY_ROUTES.some(
    (replayRoute) =>
      route === replayRoute ||
      (replayRoute !== "/" && route.startsWith(`${replayRoute}/`)),
  );
}

export function setSessionRecording(enabled: boolean) {
  withPostHog((posthog) => {
    // Replay never starts without consent; grantConsent handles the accepting route.
    if (enabled && posthog.has_opted_in_capturing()) {
      posthog.startSessionRecording();
    } else if (!enabled) {
      posthog.stopSessionRecording();
    }
  });
}
