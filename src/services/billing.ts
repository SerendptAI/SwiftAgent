import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

export type SubscriptionTier = "basic" | "pro" | "enterprise" | null;
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
  agents_used?: number;
  agents_limit?: number;
  documents_used?: number;
  documents_limit?: number;
  members_used?: number;
  members_limit?: number;
  voice_minutes_used?: number;
  voice_minutes_limit?: number;
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
