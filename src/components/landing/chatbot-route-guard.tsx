"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { cleanupChatbotDom } from "./homepage-chatbot";

function isHomepagePath(pathname: string) {
  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  return ["/", "/en", "/pl"].includes(normalizedPathname);
}

export function ChatbotRouteGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (isHomepagePath(pathname)) return;

    cleanupChatbotDom();

    const observer = new MutationObserver(cleanupChatbotDom);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
