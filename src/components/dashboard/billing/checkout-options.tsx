"use client";

import { cn } from "@/lib/utils";
import type { BillingProvider } from "@/services/billing";

const PROVIDER_OPTIONS: ReadonlyArray<{
  value: BillingProvider;
  label: string;
}> = [
  { value: "polar", label: "Card / International (Polar)" },
  { value: "bachs", label: "Bachs" },
];

interface CheckoutOptionsProps {
  provider: BillingProvider;
  onProviderChange: (provider: BillingProvider) => void;
  discountCode: string;
  onDiscountCodeChange: (discountCode: string) => void;
  /** Locks the controls while a checkout request is in flight. */
  disabled?: boolean;
}

/** Collects the provider and discount code sent alongside the chosen tier. */
export function CheckoutOptions({
  provider,
  onProviderChange,
  discountCode,
  onDiscountCodeChange,
  disabled = false,
}: CheckoutOptionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <fieldset disabled={disabled} className="min-w-0">
        <legend className="font-dm-mono text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase sm:text-sm">
          Payment Method
        </legend>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
          {PROVIDER_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "font-dm-mono flex items-center gap-2 text-xs tracking-wider text-gray-700 uppercase sm:text-sm",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
              )}
            >
              <input
                type="radio"
                name="billing-provider"
                value={option.value}
                checked={provider === option.value}
                onChange={() => onProviderChange(option.value)}
                className="h-4 w-4 shrink-0 accent-[#006BE5]"
              />
              <span className="min-w-0">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {provider === "bachs" && (
        <div className="min-w-0">
          <label
            htmlFor="discount-code"
            className="font-dm-mono block text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase sm:text-sm"
          >
            Discount Code (Optional)
          </label>
          <input
            id="discount-code"
            type="text"
            value={discountCode}
            onChange={(event) => onDiscountCodeChange(event.target.value)}
            disabled={disabled}
            placeholder="ENTER CODE"
            autoComplete="off"
            autoCapitalize="characters"
            className="font-dm-mono mt-2 w-full max-w-xs rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm tracking-wider text-gray-900 uppercase outline-none placeholder:text-gray-400 focus:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      )}
    </div>
  );
}
