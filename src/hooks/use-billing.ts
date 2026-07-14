import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

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

export function useBillingDetails(
  companyId: string | null | undefined,
  options?: {
    refetchInterval?: UseQueryOptions<BillingDetails>["refetchInterval"];
  },
) {
  return useQuery<BillingDetails>({
    queryKey: ["billingDetails", companyId],
    queryFn: () => getBillingDetails(companyId as string),
    enabled: !!companyId && !!getAccessToken(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: options?.refetchInterval ?? false,
  });
}

export function useHasActivePlan(
  companyId: string | null | undefined,
): boolean | undefined {
  const { data } = useBillingDetails(companyId);
  if (!data) return undefined;
  if (data.tier == null || data.tier === "none") return false;
  const status = data.subscription_status ?? data.status;
  if (status === "active") return true;
  // Canceled subscriptions retain their plan until the paid period ends.
  return (
    status === "canceled" &&
    !!data.subscription_expires_at &&
    new Date(data.subscription_expires_at).getTime() > Date.now()
  );
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
