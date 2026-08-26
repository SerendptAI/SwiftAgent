"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useUpgradeModalStore } from "@/store/upgrade-modal-store";

import { UpgradePlanModal } from "./upgrade-plan-modal";

export function UpgradeModalTrigger() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const storeOpen = useUpgradeModalStore((s) => s.open);
  const hideStore = useUpgradeModalStore((s) => s.hide);
  const feature = useUpgradeModalStore((s) => s.feature);

  const urlOpen = params.get("upgrade") === "1";
  const open = urlOpen || storeOpen;

  const close = () => {
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
      feature={feature ?? undefined}
    />
  );
}
