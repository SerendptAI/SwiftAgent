"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  type CheckoutError,
  CheckoutErrorAlert,
} from "@/components/dashboard/billing/checkout-error-alert";
import { CheckoutOptions } from "@/components/dashboard/billing/checkout-options";
import type { Plan } from "@/components/pricing/plan-card";
import { useCreateCheckout } from "@/hooks/use-billing";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  type BillingProvider,
  isCrossProviderConflict,
} from "@/services/billing";

interface CheckoutModalProps {
  /** Only a plan carrying a tier can be checked out. */
  plan: Plan & { tier: string };
  companyId: string;
  onClose: () => void;
}

export function CheckoutModal({
  plan,
  companyId,
  onClose,
}: CheckoutModalProps) {
  const [provider, setProvider] = useState<BillingProvider>("polar");
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState<CheckoutError | null>(null);
  const createCheckout = useCreateCheckout();

  useScrollLock(true);

  // Dismissal is blocked mid-request: the tab is about to be handed to the
  // provider, and closing would strand the user with no sign of what happened.
  const isPending = createCheckout.isPending;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onClose]);

  const handleProviderChange = (nextProvider: BillingProvider) => {
    setProvider(nextProvider);
    // The message names the provider that was attempted, so it goes stale here.
    setError(null);
  };

  const handleConfirm = () => {
    setError(null);
    createCheckout.mutate(
      {
        company_id: companyId,
        tier: plan.tier,
        provider,
        discount_code: provider === "bachs" ? discountCode : undefined,
      },
      {
        onSuccess: ({ checkout_url }) => {
          if (checkout_url) {
            window.location.href = checkout_url;
            return;
          }
          setError({
            message: "Checkout is unavailable right now. Please try again.",
            canOpenPortal: false,
          });
        },
        onError: (err: unknown) => {
          setError({
            message: getApiErrorMessage(
              err,
              "Unable to start checkout. Please try again.",
            ),
            canOpenPortal: isCrossProviderConflict(err),
          });
        },
      },
    );
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-10000 flex items-center justify-center px-4 py-6"
    >
      <button
        type="button"
        aria-label="Close checkout"
        disabled={isPending}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/45 disabled:cursor-default"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-[520px] flex-col gap-6 overflow-y-auto rounded-2xl bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:px-10"
      >
        <button
          type="button"
          aria-label="Close"
          disabled={isPending}
          onClick={onClose}
          className="absolute top-4 right-4 text-black/50 transition-colors hover:text-black disabled:opacity-40"
        >
          <X className="size-6" strokeWidth={1.5} />
        </button>

        <div className="min-w-0">
          <h2
            id="checkout-modal-title"
            className="font-greed-narrow text-2xl leading-tight font-medium tracking-[-0.02em] text-black uppercase sm:text-[30px]"
          >
            Subscribe to {plan.name}
          </h2>
          <p className="font-dm-mono mt-2 flex items-baseline gap-2 text-sm tracking-[0.1em] text-black/60 uppercase">
            {plan.priceOriginal ? (
              <span className="text-black/35 line-through">
                {plan.priceOriginal}
              </span>
            ) : null}
            <span>
              {plan.price} {plan.billing}
            </span>
          </p>
        </div>

        <CheckoutOptions
          provider={provider}
          onProviderChange={handleProviderChange}
          discountCode={discountCode}
          onDiscountCodeChange={setDiscountCode}
          disabled={isPending}
        />

        {error && <CheckoutErrorAlert error={error} companyId={companyId} />}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="font-dm-mono h-11 rounded-lg border border-gray-200 px-6 text-sm tracking-[0.08em] text-gray-700 uppercase transition-colors hover:bg-gray-50 disabled:opacity-50 sm:h-10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="font-dm-mono inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#006BE5] px-6 text-sm tracking-[0.08em] text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#005fca] disabled:opacity-60 sm:h-10"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              "Continue to checkout"
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
