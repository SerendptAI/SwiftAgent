"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCurrentUser } from "@/hooks/use-auth";
import { useBillingDetails } from "@/hooks/use-billing";
import { useUpgradeModalStore } from "@/store/upgrade-modal-store";

import { UpgradePlanModal } from "./upgrade-plan-modal";

export function UpgradeModalTrigger() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const storeOpen = useUpgradeModalStore((s) => s.open);
  const hideStore = useUpgradeModalStore((s) => s.hide);

  const { data: user } = useCurrentUser();
  const companyId = useActiveCompanyId();
  const { data: details } = useBillingDetails(companyId);

  // After onboarding (or once a subscription expires) the backend drops the
  // company to the "none" tier, which has no allowance for paid features. Until
  // they pick a paid plan we keep the modal up and non-dismissible across the
  // dashboard — except on billing routes, where the payment is completed.
  //
  // Resolve the subscription lifecycle the same way the modal does: prefer
  // `subscription_status`, falling back to `status`. Keying off `status` alone
  // wrongly paywalls users whose `subscription_status` is "active" but whose
  // legacy `status` field reports something else.
  const subscriptionStatus = details?.subscription_status ?? details?.status;
  const noPaidPlan =
    !!details &&
    (details.tier == null ||
      details.tier === "none" ||
      subscriptionStatus !== "active");
  const paymentRequired =
    !!user?.onboarding_completed &&
    pathname.includes("/dashboard") &&
    !pathname.includes("/billing") &&
    noPaidPlan;

  const urlOpen = params.get("upgrade") === "1";
  const open = urlOpen || storeOpen || paymentRequired;

  const close = () => {
    if (paymentRequired) return;
    if (storeOpen) hideStore();
    if (urlOpen) {
      const next = new URLSearchParams(params.toString());
      next.delete("upgrade");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  };

  return (
    <UpgradePlanModal
      open={open}
      onClose={close}
      dismissible={!paymentRequired}
    />
  );
}
