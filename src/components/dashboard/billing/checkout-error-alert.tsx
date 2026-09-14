"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import { useOpenBillingPortal } from "@/hooks/use-billing";

export interface CheckoutError {
  message: string;
  /** Set when cancelling the existing subscription in the portal unblocks checkout. */
  canOpenPortal: boolean;
}

interface CheckoutErrorAlertProps {
  error: CheckoutError;
  companyId: string | null;
}

export function CheckoutErrorAlert({
  error,
  companyId,
}: CheckoutErrorAlertProps) {
  const portal = useOpenBillingPortal(companyId);

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          aria-hidden
          className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
        />
        <p className="min-w-0 flex-1 text-xs text-red-700 sm:text-sm">
          {error.message}
        </p>
      </div>

      {error.canOpenPortal && companyId && (
        <div className="flex flex-col gap-2 sm:pl-8">
          <button
            type="button"
            onClick={portal.open}
            disabled={portal.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006BE5] px-6 py-2.5 text-xs font-bold tracking-wide text-white shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#0058C0] disabled:opacity-50 sm:w-auto sm:self-start sm:text-sm"
          >
            {portal.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening…
              </>
            ) : (
              "Go to Billing Portal"
            )}
          </button>
          {portal.error && (
            <p className="text-xs text-red-600">{portal.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
