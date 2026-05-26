import { apiClient } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BillingPlan {
  tier: string;
  name?: string;
  price?: number | string;
  currency?: string;
  interval?: string;
  limits?: Record<string, number | string | null>;
  features?: string[];
  [key: string]: unknown;
}

export type BillingPlansResponse = BillingPlan[] | Record<string, BillingPlan>;

export type SubscriptionTier = "basic" | "pro" | "enterprise" | null;
export type SubscriptionStatus = "active" | "inactive";
export type BillingProvider = "polar" | "palmpay" | null;

export interface SavedCard {
  brand: string;
  last4: string;
}

export interface BillingUsageQuota {
  used: number;
  limit: number;
}

export interface BillingDetails {
  tier: SubscriptionTier;
  display_name?: string;
  subscription_status: SubscriptionStatus;
  subscription_started_at: string | null;
  subscription_expires_at?: string | null;
  usage?: {
    agents?: BillingUsageQuota;
    documents?: BillingUsageQuota;
    members?: BillingUsageQuota;
    voice_minutes?: BillingUsageQuota;
  };
  features?: Record<string, string>;
  /** Optional — not returned by /status today; kept for the saved-cards UI when the endpoint adds it. */
  billing_provider?: BillingProvider;
  saved_cards?: SavedCard[];
}

export interface CheckoutPayload {
  company_id: string;
  tier: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

export async function getBillingPlans(): Promise<BillingPlansResponse> {
  const { data } = await apiClient.get<BillingPlansResponse>(
    "/api/v1/billing/plans",
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
  const { data } = await apiClient.post<CheckoutResponse>(
    "/api/v1/billing/checkout",
    payload,
  );
  return data;
}
