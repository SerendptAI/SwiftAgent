"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { stripLocalePrefix } from "@/lib/locale-path";

import { cleanupChatbotDom } from "./homepage-chatbot";

function isHomepagePath(pathname: string) {
  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  return stripLocalePrefix(normalizedPathname) === "/";
}

// The dashboard intentionally hosts its own button-mode support widget
// (SupportChatbot), which shares the same DOM ids the cleanup targets.
function isDashboardPath(pathname: string) {
  return pathname.includes("/dashboard");
}

export function ChatbotRouteGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (isHomepagePath(pathname) || isDashboardPath(pathname)) return;

    cleanupChatbotDom();

    const observer = new MutationObserver(cleanupChatbotDom);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
