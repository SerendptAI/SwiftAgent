"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface OnboardingErrorToastProps {
  message: string | null;
  onDismiss: () => void;
  /** Auto-dismiss delay in ms. Defaults to 5000. Set to 0 to disable. */
  autoDismissMs?: number;
}

export function OnboardingErrorToast({
  message,
  onDismiss,
  autoDismissMs = 5000,
}: OnboardingErrorToastProps) {
  useEffect(() => {
    if (!message || autoDismissMs === 0) return;
    const id = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(id);
  }, [message, autoDismissMs, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <span className="flex-1">{message}</span>
      <button
        aria-label="Dismiss error"
        onClick={onDismiss}
        className="shrink-0 rounded-md p-0.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
