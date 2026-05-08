import { useMutation, useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api-client";
import type {
  BillingDetails,
  BillingPlansResponse,
  CheckoutPayload,
  CheckoutResponse,
} from "@/services/billing";
import {
  createCheckoutSession,
  getBillingDetails,
  getBillingPlans,
} from "@/services/billing";

// ── Billing Plans ─────────────────────────────────────────────────────────────

export function useBillingPlans() {
  return useQuery<BillingPlansResponse>({
    queryKey: ["billingPlans"],
    queryFn: getBillingPlans,
    staleTime: 10 * 60 * 1000,
  });
}

// ── Billing Details (per company) ─────────────────────────────────────────────

export function useBillingDetails(companyId: string | null | undefined) {
  return useQuery<BillingDetails>({
    queryKey: ["billingDetails", companyId],
    queryFn: () => getBillingDetails(companyId as string),
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
