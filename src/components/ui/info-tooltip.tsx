"use client";

import { Info } from "lucide-react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function InfoTooltip({
  text,
  className = "h-4 w-4",
  children,
  side = "top",
  sideOffset = 8,
}: {
  text: string;
  className?: string;
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={120}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children || (
            <button
              type="button"
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <Info className={className} />
            </button>
          )}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              "z-[70] rounded-lg bg-gray-900 px-3 py-2 text-xs leading-relaxed whitespace-nowrap text-white shadow-lg",
              "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
            )}
          >
            {text}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
