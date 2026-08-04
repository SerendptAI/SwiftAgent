"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  initAnalytics,
  setSessionRecording,
  shouldRecordSession,
} from "@/lib/analytics";

/**
 * Pageviews are captured by posthog-js itself (`capture_pageview:
 * "history_change"`), so route changes need no work here — only replay is
 * toggled per route.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const isReplayRoute = shouldRecordSession(pathname);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    setSessionRecording(isReplayRoute);
  }, [isReplayRoute]);

  return null;
}
