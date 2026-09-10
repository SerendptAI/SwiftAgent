import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * The dashboard's raised brand button. Blue by default; pass a background
 * class pair to recolour it for a page's accent.
 */
export function ActionButton({
  loading = false,
  variant = "primary",
  className,
  disabled,
  children,
  ...props
}: ComponentProps<"button"> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        "flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold tracking-wide uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:h-10",
        variant === "primary" &&
          "bg-[#006BE5] text-white shadow-[-3px_3px_0px_0px_#000000] hover:bg-[#0055B8]",
        variant === "secondary" &&
          "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
        variant === "danger" &&
          "bg-red-600 text-white shadow-[-3px_3px_0px_0px_#000000] hover:bg-red-700",
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
