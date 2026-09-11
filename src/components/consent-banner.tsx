"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  type ConsentStatus,
  denyConsent,
  getConsentStatus,
  grantConsent,
} from "@/lib/analytics";

/**
 * Analytics starts opted out; nothing is captured or persisted until the
 * visitor accepts here. PostHog stores the choice, so this renders only while
 * consent is still pending.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const pathname = usePathname();
  const [status, setStatus] = useState<ConsentStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    getConsentStatus().then((current) => {
      if (!cancelled && current) setStatus(current);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status !== "pending") return null;

  const handleAccept = () => {
    grantConsent(pathname);
    setStatus("granted");
  };

  const handleDecline = () => {
    denyConsent();
    setStatus("denied");
  };

  return (
    <aside
      aria-label={t("ariaLabel")}
      className="fixed bottom-4 left-4 z-100 max-w-sm rounded-lg border border-black/20 bg-white p-4 shadow-[-4px_4px_0px_0px_#000000]"
    >
      <p className="font-jetbrains text-xs leading-normal tracking-[10%] text-black md:text-sm lg:text-base">
        {t("message")}{" "}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-2"
          target="_blank"
        >
          {t("privacyPolicy")}
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button size="sm" variant="outline" onClick={handleDecline}>
          {t("decline")}
        </Button>
        <Button size="sm" onClick={handleAccept}>
          {t("accept")}
        </Button>
      </div>
    </aside>
  );
}
