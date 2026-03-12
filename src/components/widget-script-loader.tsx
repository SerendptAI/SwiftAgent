"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const WIDGET_SCRIPT_URL = "https://swiftagents.org/widget.js";
const DEFAULT_COMPANY_ID = "01490b45-52bd-4317-b2f7-e93264210201";

export function WidgetScriptLoader() {
  const pathname = usePathname();
  const isEmbedRoute = pathname?.includes("/embed") ?? false;

  if (isEmbedRoute) {
    return null;
  }

  return (
    <Script
      src={WIDGET_SCRIPT_URL}
      data-company-id={DEFAULT_COMPANY_ID}
      strategy="afterInteractive"
    />
  );
}
