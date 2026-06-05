import { useMutation, useQuery } from "@tanstack/react-query";

import { getAccessToken } from "@/lib/api-client";
import type {
  BillingDetails,
  BillingPlansResponse,
  CheckoutPayload,
  CheckoutResponse,
  PortalSessionResponse,
} from "@/services/billing";
import {
  createCheckoutSession,
  createPortalSession,
  getBillingDetails,
  getBillingPlans,
  getUserTimezone,
} from "@/services/billing";

// ── Billing Plans ─────────────────────────────────────────────────────────────

/** Region-aware plan list. Pass an explicit timezone to override the browser's. */
export function useBillingPlans(timezone?: string) {
  const tz = timezone ?? getUserTimezone();
  return useQuery<BillingPlansResponse>({
    queryKey: ["billingPlans", tz ?? "default"],
    queryFn: () => getBillingPlans(tz),
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

// ── Create Polar Customer Portal Session ──────────────────────────────────────

export function useCreatePortalSession() {
  return useMutation<PortalSessionResponse, Error, string>({
    mutationFn: createPortalSession,
  });
}
