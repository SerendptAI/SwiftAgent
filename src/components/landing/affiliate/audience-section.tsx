"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Copy lives in the `affiliate.audience` catalogue, keyed by id. */
const COLUMNS = [
  {
    id: "forWho",
    titleColor: "#6433cc",
    bullets: [
      { id: "developers", color: "#6433cc" },
      { id: "agencies", color: "#7f9fff" },
      { id: "anyone", color: "#f25430" },
    ],
  },
  {
    id: "whyYes",
    titleColor: "#f2b035",
    bullets: [
      { id: "answers", color: "#f2b035" },
      { id: "noDevTime", color: "#7f9fff" },
      { id: "liveFast", color: "#f25430" },
    ],
  },
];

export function AudienceSection() {
  const t = useTranslations("affiliate.audience");
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
          <div key={column.id} className="contents">
            {index === 1 && (
              <div className="hidden w-px self-stretch bg-black/15 md:block" />
            )}
            <div className="flex flex-col gap-8">
              <h2
                data-reveal
                className="font-greed text-3xl leading-snug font-medium tracking-[-2%] md:text-4xl"
                style={{ color: column.titleColor }}
              >
                {t(`${column.id}.title`)}
              </h2>
              <ul className="flex flex-col gap-6">
                {column.bullets.map((bullet) => (
                  <li
                    key={bullet.id}
                    data-reveal
                    className="flex items-start gap-4"
                  >
                    <span
                      className="mt-2 size-2 shrink-0"
                      style={{ backgroundColor: bullet.color }}
                    />
                    <span className="text-base leading-normal text-[#1f1f1f]">
                      {t(`${column.id}.bullets.${bullet.id}`)}
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
