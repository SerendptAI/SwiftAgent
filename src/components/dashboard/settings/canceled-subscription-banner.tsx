"use client";

import { format } from "date-fns";

import type { BillingDetails } from "@/services/billing";

interface CanceledSubscriptionBannerProps {
  details: BillingDetails | undefined;
}

export function CanceledSubscriptionBanner({
  details,
}: CanceledSubscriptionBannerProps) {
  const status = details?.subscription_status ?? details?.status;
  if (status !== "canceled") return null;

  const expiresAt = details?.subscription_expires_at;
  let formattedExpiry: string | null = null;
  if (expiresAt) {
    try {
      formattedExpiry = format(new Date(expiresAt), "MMMM d, yyyy");
    } catch {
      formattedExpiry = null;
    }
  }

  const tierName =
    details?.display_name ||
    (details?.tier
      ? String(details.tier).replace(/^./, (c) => c.toUpperCase())
      : null);

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      Your subscription has been canceled.{" "}
      {formattedExpiry ? (
        <>
          You will retain access to your {tierName ? `${tierName} ` : ""}
          features until <strong>{formattedExpiry}</strong>.
        </>
      ) : (
        <>
          You will retain access to your {tierName ? `${tierName} ` : ""}
          features until the current billing period ends.
        </>
      )}
    </div>
  );
}
