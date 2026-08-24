"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Copy lives in the `affiliate.protocol.steps` catalogue, keyed by id. */
const STEPS = [
  { id: "refer", number: "01" },
  { id: "demo", number: "02" },
  { id: "signUp", number: "03" },
  { id: "getPaid", number: "04" },
];

export function ProtocolSection() {
  const t = useTranslations("affiliate.protocol");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
          y: 50,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#D9F99D] px-6 py-16 md:px-10 md:py-24 lg:px-20"
    >
      <div className="mx-auto max-w-360">
        <div ref={headerRef} className="flex flex-col gap-3">
          <p className="font-dm-mono text-sm tracking-[0.15em] text-[#111827] uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="font-greed-narrow text-3xl leading-[1.1] font-medium tracking-[-0.02em] text-[#111827] uppercase md:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
        </div>

        <div
          ref={gridRef}
          className="mt-14 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-8"
        >
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex flex-col gap-6 rounded-[8px] border border-[#111827] bg-white p-8 shadow-[-3px_4px_0px_0px_#111827]"
            >
              <span className="font-dm-mono text-[32px] text-[#f25430]">
                {step.number}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-greed-narrow text-2xl font-medium text-[#111827] uppercase">
                  {t(`steps.${step.id}.title`)}
                </h3>
                <p className="font-stolzl text-[15px] leading-[1.5] text-[#374151]">
                  {t(`steps.${step.id}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
