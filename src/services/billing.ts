import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

// "none" is the post-onboarding / expired-subscription tier: a paywalled state
// with zero allowance for paid features. The backend never returns it from
// /plans, so it only ever appears on a company's own billing details.
export type SubscriptionTier =
  | "none"
  | "basic"
  | "pro"
  | "enterprise"
  | "business"
  | "startup"
  | "enterprise_payg"
  | null;
export type SubscriptionStatus = "active" | "inactive" | "canceled";
export type BillingProvider = "polar" | "palmpay" | null;
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
  billing_provider?: BillingProvider;
  display_name?: string;
  /** Not in the /status response today; kept optional for the saved-cards UI when it lands. */
  saved_cards?: SavedCard[];
}

export interface CheckoutPayload {
  company_id: string;
  tier: string;
  user_timezone?: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

export interface PortalSessionResponse {
  portal_url: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Browser timezone via Intl; safe for SSR (returns undefined server-side). */
export function getUserTimezone(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

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
  const body: CheckoutPayload = {
    ...payload,
    user_timezone: payload.user_timezone ?? getUserTimezone(),
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
