"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { UpgradePlanModal } from "./upgrade-plan-modal";

export function UpgradeModalTrigger() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const open = params.get("upgrade") === "1";

  const close = () => {
    const next = new URLSearchParams(params.toString());
    next.delete("upgrade");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return <UpgradePlanModal open={open} onClose={close} />;
}
