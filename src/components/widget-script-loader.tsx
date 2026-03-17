"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const WIDGET_SCRIPT_URL = "/widget.js"; // relative so it works in both local dev and production
const DEFAULT_COMPANY_ID = "01490b45-52bd-4317-b2f7-e93264210201";

export function WidgetScriptLoader() {
  const pathname = usePathname();
  // Only show on the landing page: '/' or locale roots like '/en', '/fr', etc.
  const isLandingPage = /^\/?([a-z]{2})?$/.test(pathname ?? "");

  // Remove the widget iframe when navigating away from the landing page
  useEffect(() => {
    if (!isLandingPage) {
      const iframe = document.querySelector("iframe.swift-agent-widget-iframe");
      if (iframe) {
        iframe.remove();
        document.body.style.marginTop = "";
        document.body.style.overflow = "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__SWIFT_AGENT_WIDGET_LOADED__ = false;
      }
    }
  }, [isLandingPage]);

  if (!isLandingPage) {
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
