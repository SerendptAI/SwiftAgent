"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS = [
  {
    title: "Who this is for",
    titleColor: "#6433cc",
    bullets: [
      {
        color: "#6433cc",
        text: "Web developers and designers who build or maintain business websites",
      },
      {
        color: "#7f9fff",
        text: "Agency owners and freelancers with active business clients",
      },
      {
        color: "#f25430",
        text: "Anyone with a friend, family member, or contact who runs a business with a website",
      },
    ],
  },
  {
    title: "Why owners say yes",
    titleColor: "#f2b035",
    bullets: [
      {
        color: "#f2b035",
        text: "Their website starts answering customer questions on its own, day and night",
      },
      {
        color: "#7f9fff",
        text: "No developer time needed to set it up, SwiftAgents learns the site directly",
      },
      {
        color: "#f25430",
        text: "Live within days, across web chat, WhatsApp, and social messages",
      },
    ],
  },
];

export function AudienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll("[data-reveal]");
      if (items?.length) {
        gsap.from(items, {
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
          y: 40,
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
      className="w-full bg-white px-6 py-16 md:px-10 md:py-24 lg:px-20"
    >
      <div
        ref={gridRef}
        className="mx-auto grid max-w-360 gap-12 md:grid-cols-[1fr_auto_1fr] md:gap-20"
      >
        {COLUMNS.map((column, index) => (
          <div key={column.title} className="contents">
            {index === 1 && (
              <div className="hidden w-px self-stretch bg-black/15 md:block" />
            )}
            <div className="flex flex-col gap-8">
              <h2
                data-reveal
                className="font-greed-narrow text-3xl leading-[1.1] font-medium tracking-[-0.02em] uppercase md:text-4xl"
                style={{ color: column.titleColor }}
              >
                {column.title}
              </h2>
              <ul className="flex flex-col gap-6">
                {column.bullets.map((bullet) => (
                  <li
                    key={bullet.text}
                    data-reveal
                    className="flex items-start gap-4"
                  >
                    <span
                      className="mt-[7px] size-2 shrink-0"
                      style={{ backgroundColor: bullet.color }}
                    />
                    <span className="font-stolzl text-base leading-[1.5] text-[#1f1f1f]">
                      {bullet.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
