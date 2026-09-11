"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function SubmitCtaSection() {
  const t = useTranslations("affiliate.submit");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F2B035] px-6 py-16 md:px-10 md:py-24 lg:px-20"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-360 flex-col items-center gap-10 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-greed text-3xl leading-[1.1] font-medium tracking-[-0.02em] text-[#1f1f1f] uppercase md:text-5xl lg:text-[56px]">
            {t("heading")}
          </h2>
          <p className="font-stolzl text-lg text-[#1f1f1f]/85 md:text-xl">
            {t("body")}
          </p>
        </div>

        <div className="flex w-full max-w-[700px] flex-col items-stretch gap-6 border border-black bg-white p-6 shadow-[-4px_5px_0px_0px_#000000] sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1 text-left">
            <span className="font-dm-mono text-xs text-[#7e7e7e] uppercase">
              {t("channelLabel")}
            </span>
            <span className="font-dm-mono text-lg break-all text-[#6433cc] md:text-xl">
              THELMA@SWIFTAGENTS.ORG
            </span>
          </div>
          <a
            href="mailto:thelma@swiftagents.org"
            className="font-dm-mono inline-flex shrink-0 items-center justify-center border border-black bg-[#1f1f1f] px-6 py-3 text-base text-white uppercase transition-opacity hover:opacity-85"
          >
            {t("emailNow")}
          </a>
        </div>
      </div>
    </section>
  );
}
