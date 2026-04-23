import { useMutation, useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api-client";
import type {
  BillingPlansResponse,
  BillingStatus,
  CheckoutPayload,
  CheckoutResponse,
} from "@/services/billing";
import {
  createCheckoutSession,
  getBillingPlans,
  getBillingStatus,
} from "@/services/billing";

// ── Billing Plans ─────────────────────────────────────────────────────────────

export function useBillingPlans() {
  return useQuery<BillingPlansResponse>({
    queryKey: ["billingPlans"],
    queryFn: getBillingPlans,
    staleTime: 10 * 60 * 1000,
  });
}

// ── Billing Status (per company) ──────────────────────────────────────────────

export function useBillingStatus(companyId: string | null | undefined) {
  return useQuery<BillingStatus>({
    queryKey: ["billingStatus", companyId],
    queryFn: () => getBillingStatus(companyId as string),
    enabled: !!companyId && !!getAccessToken(),
    staleTime: 60 * 1000,
  });
}

// ── Create Checkout Session ───────────────────────────────────────────────────

export function useCreateCheckout() {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: createCheckoutSession,
  });
}
