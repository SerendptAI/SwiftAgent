import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { getAccessToken } from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/api-error";
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

/** Region-aware plan list. Pass an explicit timezone to override the browser's. */
export function useBillingPlans(timezone?: string) {
  const tz = timezone ?? getUserTimezone();
  return useQuery<BillingPlansResponse>({
    queryKey: ["billingPlans", tz ?? "default"],
    queryFn: () => getBillingPlans(tz),
    staleTime: 10 * 60 * 1000,
  });
}

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

export function useCreateCheckout() {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: createCheckoutSession,
  });
}

function useCreatePortalSession() {
  return useMutation<PortalSessionResponse, Error, string>({
    mutationFn: createPortalSession,
  });
}

const PORTAL_ERROR_FALLBACK = "Failed to load subscription portal.";

/**
 * Redirects to the company's customer portal, whichever provider the backend
 * resolves from the active subscription. Reports failures as a message instead
 * of throwing, so callers can render them inline.
 */
export function useOpenBillingPortal(companyId: string | null | undefined) {
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreatePortalSession();

  const open = useCallback(async () => {
    if (!companyId) return;
    setError(null);
    try {
      const { portal_url } = await mutateAsync(companyId);
      if (!portal_url) {
        setError(PORTAL_ERROR_FALLBACK);
        return;
      }
      window.location.href = portal_url;
    } catch (err) {
      setError(getApiErrorMessage(err, PORTAL_ERROR_FALLBACK));
    }
  }, [companyId, mutateAsync]);

  return { open, error, isPending };
}
