"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { UpgradePlanModal } from "./upgrade-plan-modal";

export function UpgradeModalTrigger() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const open = params.get("upgrade") === "1";
  const feature = params.get("feature") || "this feature";

  const close = () => {
    const next = new URLSearchParams(params.toString());
    next.delete("upgrade");
    next.delete("feature");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return <UpgradePlanModal open={open} onClose={close} feature={feature} />;
}
