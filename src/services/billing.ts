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

export interface BillingStatus {
  company_id: string;
  tier?: string;
  status?: string;
  current_period_end?: string | null;
  usage?: Record<string, number | string | null>;
  limits?: Record<string, number | string | null>;
  [key: string]: unknown;
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
    "/api/v1/billing/billing/plans",
  );
  return data;
}

export async function getBillingStatus(
  companyId: string,
): Promise<BillingStatus> {
  const { data } = await apiClient.get<BillingStatus>(
    `/api/v1/billing/billing/${encodeURIComponent(companyId)}/status`,
  );
  return data;
}

export async function createCheckoutSession(
  payload: CheckoutPayload,
): Promise<CheckoutResponse> {
  const { data } = await apiClient.post<CheckoutResponse>(
    "/api/v1/billing/billing/checkout",
    payload,
  );
  return data;
}
