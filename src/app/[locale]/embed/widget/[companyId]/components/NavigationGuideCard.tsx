"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";

import { NavigationGuide } from "./types";

interface NavigationGuideCardProps {
  guide: NavigationGuide;
  compact?: boolean;
}

export function NavigationGuideCard({
  guide,
  compact,
}: NavigationGuideCardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(
    null,
  );
  const steps = guide.steps;

  const handleImgLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
    },
    [],
  );

  if (!steps.length) return null;

  const current = steps[activeStep];
  const hasMultiple = steps.length > 1;

  // Convert pixel coords to percentages relative to the image's natural size
  const h = current.highlight;
  const pct =
    imgNatural && h
      ? {
          left: (h.x / imgNatural.w) * 100,
          top: (h.y / imgNatural.h) * 100,
          width: (h.w / imgNatural.w) * 100,
          height: (h.h / imgNatural.h) * 100,
          cx: ((h.x + h.w / 2) / imgNatural.w) * 100,
          cy: ((h.y + h.h / 2) / imgNatural.h) * 100,
        }
      : null;

  return (
    <div className={compact ? "mt-2" : "mt-3"}>
      {/* Screenshot with highlight overlay */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.screenshot_url}
            alt={current.page_title}
            className="block w-full"
            draggable={false}
            onLoad={handleImgLoad}
          />
          {/* Highlight overlay — only render once we know natural dimensions */}
          {pct && (
            <>
              {/* Dark overlay with cutout */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `rgba(0,0,0,0.35)`,
                  maskImage: `radial-gradient(ellipse ${pct.width + 3}% ${pct.height + 6}% at ${pct.cx}% ${pct.cy}%, transparent 50%, black 51%)`,
                  WebkitMaskImage: `radial-gradient(ellipse ${pct.width + 3}% ${pct.height + 6}% at ${pct.cx}% ${pct.cy}%, transparent 50%, black 51%)`,
                }}
              />
              {/* Highlight ring */}
              <div
                className="pointer-events-none absolute rounded-lg border-2 border-[#1a73e8] shadow-[0_0_0_3px_rgba(26,115,232,0.3)]"
                style={{
                  left: `calc(${pct.left}% - 4px)`,
                  top: `calc(${pct.top}% - 4px)`,
                  width: `calc(${pct.width}% + 8px)`,
                  height: `calc(${pct.height}% + 8px)`,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Instruction */}
      <div
        className={`mt-2 flex items-start gap-2 ${compact ? "text-[12px]" : "text-[13px]"}`}
      >
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-[11px] font-bold text-white">
          {current.step}
        </span>
        <p className="leading-relaxed text-gray-700">{current.instruction}</p>
      </div>

      {/* Step navigation */}
      {hasMultiple && (
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] text-gray-400">
            Step {activeStep + 1} of {steps.length}
          </span>
          <button
            onClick={() =>
              setActiveStep((s) => Math.min(steps.length - 1, s + 1))
            }
            disabled={activeStep === steps.length - 1}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
