"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const SVG_W = 789;
const SVG_H = 126;
const OVERLAP_RATIO = 0.545; // fraction of arrow width that each arrow hides behind the next
const ARROW_COUNT = 4;

const ARROWS = [
  { src: "/images/arrow-green.svg" },
  { src: "/images/arrow-orange.svg" },
  { src: "/images/arrow-yellow.svg" },
  { src: "/images/arrow-blue.svg" },
];

const MARQUEE_ARROWS = [...ARROWS, ...ARROWS];

export function LiveInHoursBanner() {
  const t = useTranslations("home.liveInHours");
  const containerRef = useRef<HTMLDivElement>(null);
  const [arrowW, setArrowW] = useState(SVG_W);
  const [overlap, setOverlap] = useState(SVG_W * OVERLAP_RATIO);
  const [setWidth, setSetWidth] = useState(
    ARROW_COUNT * (SVG_W * (1 - OVERLAP_RATIO)),
  );

  useEffect(() => {
    const compute = () => {
      if (!containerRef.current) return;
      const h = containerRef.current.offsetHeight;
      const w = h * (SVG_W / SVG_H);
      const ov = w * OVERLAP_RATIO;
      setArrowW(w);
      setOverlap(ov);
      setSetWidth(ARROW_COUNT * (w - ov));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <section className="w-full bg-white">
      <div
        ref={containerRef}
        className="relative h-17.5 w-full overflow-hidden md:h-25 lg:h-31.5"
      >
        <div
          className="animate-arrows absolute top-0 left-0 flex h-full"
          style={
            { "--arrow-set-width": `${setWidth}px` } as React.CSSProperties
          }
        >
          {MARQUEE_ARROWS.map((arrow, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={arrow.src}
              alt=""
              style={{
                width: arrowW,
                height: "100%",
                flexShrink: 0,
                marginLeft: i === 0 ? 0 : -overlap,
              }}
            />
          ))}
        </div>

        {/* Static text overlay */}
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center px-6 md:px-10 lg:px-16">
          <span className="font-greed-narrow mx-auto w-full max-w-360 text-2xl leading-[1.2] font-medium tracking-[10%] text-white uppercase md:text-4xl lg:text-[48px]">
            {t("banner")}
          </span>
        </div>
      </div>
    </section>
  );
}
