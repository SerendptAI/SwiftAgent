import axios from "axios";

import { apiClient } from "@/lib/api-client";

// "free" and "none" both mean "no paid subscription". "none" is what the
// backend has always reported for a company that never subscribed or whose
// subscription expired; "free" is the named tier that replaces it. Neither is
// returned from /plans, so they only appear on a company's own billing details.
export type SubscriptionTier =
  | "free"
  | "none"
  | "basic"
  | "pro"
  | "enterprise"
  | "business"
  | "startup"
  | "enterprise_payg"
  | null;
export type SubscriptionStatus = "active" | "inactive" | "canceled";
export type BillingProvider = "polar" | "bachs";
export type PlanRegion = "african" | "international";

export interface BillingPlan {
  price_usd: number;
  /** Original USD price shown struck-through when a discount is active. */
  price_usd_original?: number;
  display_name: string;
  agents_limit?: number;
  documents_limit?: number;
  members_limit?: number;
  /** Max companies allowed per user account on this tier. `null` = unlimited. */
  companies_limit?: number | null;
  region?: PlanRegion;
  trial_months?: number;
  [key: string]: unknown;
}

/** Backend keys plans by tier slug. */
export type BillingPlansResponse = Record<string, BillingPlan>;

export interface SavedCard {
  brand: string;
  last4: string;
}

/** A single usage counter from the billing status `usage` payload. */
export interface UsageMetric {
  used: number;
  limit: number;
}

/**
 * Per-feature usage returned by `/billing/{company_id}/status`. Voice minutes
 * were retired alongside voice agents; `agent_chats` and `strolls` replace them.
 */
export interface UsageBreakdown {
  agents?: UsageMetric;
  documents?: UsageMetric;
  members?: UsageMetric;
  agent_chats?: UsageMetric;
  strolls?: UsageMetric;
}

export interface BillingDetails {
  company_id?: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  /** Backend may also expose the subscription lifecycle directly; matches `status` today. */
  subscription_status?: SubscriptionStatus;
  /** ISO timestamp the current subscription period started. */
  subscription_started_at?: string;
  /** ISO timestamp the user retains access until (start + 30 days). */
  subscription_expires_at?: string;
  /** Nested per-feature usage counters (agents, documents, members, agent_chats, strolls). */
  usage?: UsageBreakdown;
  billing_provider?: BillingProvider | null;
  display_name?: string;
  /** Not in the /status response today; kept optional for the saved-cards UI when it lands. */
  saved_cards?: SavedCard[];
}

/** The tier every unsubscribed company sits on; it is granted, never bought. */
export const FREE_TIER = "free";

const UNPAID_TIERS: ReadonlySet<string> = new Set([FREE_TIER, "none"]);

/** True when the tier carries no paid subscription, whatever the backend calls it. */
export function isFreeTier(tier: SubscriptionTier): boolean {
  return tier == null || UNPAID_TIERS.has(tier);
}

/**
 * True while a paid subscription is in force — including one that has been
 * canceled but still has paid time left on it.
 */
export function hasPaidSubscription(details: BillingDetails): boolean {
  if (isFreeTier(details.tier)) return false;

  const status = details.subscription_status ?? details.status;
  if (status === "active") return true;

  return (
    status === "canceled" &&
    !!details.subscription_expires_at &&
    new Date(details.subscription_expires_at).getTime() > Date.now()
  );
}

export interface CheckoutPayload {
  company_id: string;
  tier: string;
  user_timezone?: string;
  /** Omit to let the backend apply its own default (Polar). */
  provider?: BillingProvider;
  /** Bachs-only custom code; the backend rejects invalid or expired ones with a 400. */
  discount_code?: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalSessionResponse {
  portal_url: string;
}

/** Browser timezone via Intl; safe for SSR (returns undefined server-side). */
export function getUserTimezone(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

// Checkout is rejected when the company already subscribes through another
// provider, to stop it being billed twice. The response carries no error code,
// so match the stable middle of the message — the provider names on either side
// are interpolated by the backend.
const CROSS_PROVIDER_CONFLICT_PATTERN =
  /active subscription with [\s\S]*before switching to/i;

/**
 * True when a failed checkout can be resolved by cancelling the existing
 * subscription in the customer portal.
 */
export function isCrossProviderConflict(error: unknown): boolean {
  if (!axios.isAxiosError(error) || error.response?.status !== 400)
    return false;
  const detail = error.response.data?.detail;
  return (
    typeof detail === "string" && CROSS_PROVIDER_CONFLICT_PATTERN.test(detail)
  );
}

export async function getBillingPlans(
  timezone?: string,
): Promise<BillingPlansResponse> {
  const tz = timezone ?? getUserTimezone();
  const { data } = await apiClient.get<BillingPlansResponse>(
    "/api/v1/billing/plans",
    { params: tz ? { timezone: tz } : undefined },
  );
  return data;
}

export async function getBillingDetails(
  companyId: string,
): Promise<BillingDetails> {
  const { data } = await apiClient.get<BillingDetails>(
    `/api/v1/billing/${encodeURIComponent(companyId)}/status`,
  );
  return data;
}

export async function createCheckoutSession(
  payload: CheckoutPayload,
): Promise<CheckoutResponse> {
  const discountCode = payload.discount_code?.trim();
  const body: CheckoutPayload = {
    ...payload,
    user_timezone: payload.user_timezone ?? getUserTimezone(),
    discount_code: discountCode || undefined,
  };
  const { data } = await apiClient.post<CheckoutResponse>(
    "/api/v1/billing/checkout",
    body,
  );
  return data;
}

export async function createPortalSession(
  companyId: string,
): Promise<PortalSessionResponse> {
  const { data } = await apiClient.post<PortalSessionResponse>(
    `/api/v1/billing/${encodeURIComponent(companyId)}/portal`,
  );
  return data;
}
