"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { id: "you" },
  { id: "intro" },
  { id: "business" },
  { id: "live", highlight: true },
];

const LINE_DURATION = 1.3;

export function ReferralPathSection() {
  const t = useTranslations("affiliate.path");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      const nodes = gsap.utils.toArray<HTMLElement>(
        "[data-node]",
        sectionRef.current,
      );
      const labels = gsap.utils.toArray<HTMLElement>(
        "[data-step]",
        sectionRef.current,
      );

      gsap.set(progressRef.current, { scaleX: 0 });
      gsap.set(nodes, { scale: 0, opacity: 0 });
      gsap.set(labels, { y: 12, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: flowRef.current, start: "top 78%" },
      });

      // The path draws left → right; each node lights up as the line reaches it.
      tl.to(
        progressRef.current,
        { scaleX: 1, duration: LINE_DURATION, ease: "power2.inOut" },
        0,
      );

      nodes.forEach((node, i) => {
        const reach = ((2 * i + 1) / (nodes.length * 2)) * LINE_DURATION;
        tl.to(
          node,
          { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.5)" },
          reach,
        );
        tl.to(
          labels[i],
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          reach + 0.04,
        );
      });

      // Extra beat on the "you get paid" payoff.
      const last = nodes[nodes.length - 1];
      tl.to(last, { scale: 1.2, duration: 0.16, ease: "power2.out" }).to(last, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F6F6F6] px-6 py-16 md:px-10 md:py-24 lg:px-20"
    >
      <div className="mx-auto max-w-360">
        <div ref={headerRef} className="flex flex-col gap-6">
          <p className="font-press-start text-base leading-[1.2] font-medium tracking-[10%] text-[#6433CC] uppercase md:text-lg">
            {t("eyebrow")}
          </p>
          <h2 className="font-greed text-3xl leading-snug font-medium tracking-[-2%] text-[#1f1f1f] md:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
        </div>

        <div ref={flowRef} className="relative mt-14 px-4 md:mt-16 md:px-10">
          <div className="absolute top-4 right-0 left-0" />
          {/* Drawing progress line — referral (purple) flowing to payout (gold) */}
          <div
            ref={progressRef}
            className="absolute top-2.5 right-0 left-0 h-0.5 origin-left -translate-y-1/2 rounded-full bg-gradient-to-r from-[#6433cc] to-[#F2B035] sm:top-4"
          />

          <div className="relative flex items-start gap-3 md:gap-0">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-1 flex-col items-center">
                <div
                  data-node
                  className={cn(
                    "xs:border-2 relative z-10 size-5 rounded-full border border-black sm:size-8 md:border-3",
                    step.highlight ? "bg-[#F2B035]" : "bg-white",
                  )}
                />
                <div
                  data-step
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <span
                    className={cn(
                      "xs:text-sm text-xs tracking-[10%] sm:text-base md:text-lg",
                      step.highlight ? "text-[#F2B035]" : "text-[#1f1f1f]",
                    )}
                  >
                    {t(`steps.${step.id}.label`)}
                  </span>
                  <span
                    className={cn(
                      "xs:text-xs text-[10px] tracking-[-2%] md:text-sm",
                      step.highlight
                        ? "font-bold text-[#1f1f1f]"
                        : "text-[#7e7e7e]",
                    )}
                  >
                    {t(`steps.${step.id}.caption`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
