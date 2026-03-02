"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active tab into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentStep]);

  const stepColors = [
    "bg-[#6433CC]", // Purple
    "bg-orange-300", // Orange
    "bg-pink-300", // Pink
    "bg-violet-300", // Lavender
    "bg-yellow-100", // Yellow
  ];

  return (
    <div className="font-dm-mono relative mb-8">
      {/* Scrollable tab container */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto border-b border-gray-100"
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const barColor = stepColors[index] || "bg-gray-200";

          return (
            <div
              key={step}
              ref={isActive ? activeRef : undefined}
              className={cn(
                "relative shrink-0 cursor-default snap-start px-6 py-4 text-xs font-medium whitespace-nowrap transition-colors",
                isActive ? "text-gray-900" : "text-gray-400",
              )}
            >
              {step}
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-1 w-full rounded-t-full",
                  barColor,
                  index > currentStep && "opacity-40",
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Dot indicators for small screens */}
      <div className="mt-3 flex justify-center gap-1.5 md:hidden">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentStep ? "w-4 bg-gray-900" : "w-1.5 bg-gray-300",
            )}
          />
        ))}
      </div>
    </div>
  );
}
