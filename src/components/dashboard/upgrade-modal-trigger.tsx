"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCurrentUser } from "@/hooks/use-auth";
import { useHasActivePlan } from "@/hooks/use-billing";
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
  const hasActivePlan = useHasActivePlan(companyId);
  const [dismissed, setDismissed] = useState(false);

  const paymentRequired =
    !!user?.onboarding_completed &&
    pathname.includes("/dashboard") &&
    !pathname.includes("/billing") &&
    hasActivePlan === false;

  const urlOpen = params.get("upgrade") === "1";
  const open = urlOpen || storeOpen || (paymentRequired && !dismissed);

  const close = () => {
    if (paymentRequired) setDismissed(true);
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
      dismissible
      getStarted={paymentRequired}
    />
  );
}
