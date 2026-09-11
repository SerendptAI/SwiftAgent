"use client";

import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.comparison.rows` catalogue, keyed by id. */
const COMPARISON_ROWS = [
  {
    id: "fasterResponses",
    icon: "/images/home/comparison-faster-responses.svg",
  },
  {
    id: "lessManualWork",
    icon: "/images/home/comparison-less-manual-work.svg",
  },
  {
    id: "betterExperiences",
    icon: "/images/home/comparison-better-experiences.svg",
  },
  { id: "lowerCosts", icon: "/images/home/comparison-lower-costs.svg" },
];

export function ComparisonSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.comparison");

  return (
    <section className="w-full border-b border-[#1f1f1f] bg-[#03A84E] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-6">
          <h2 className="font-greed text-background max-w-4xl text-4xl leading-[1.42] font-semibold whitespace-pre-line capitalize md:text-5xl">
            {t("heading")}
          </h2>

          <p className="text-base leading-normal text-white">{t("body")}</p>
          {/* The quotation marks are part of the copy so each locale can use
              its own convention — guillemets in French, for instance. */}
          <p className="text-sm font-medium text-[#F2B035]">{t("quote")}</p>
        </div>

        <div ref={cardsRef} className="flex flex-1 flex-col gap-4">
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-[#1f1f1f] bg-white px-4 py-5 sm:flex-nowrap sm:gap-5"
            >
              <img src={row.icon} alt="" className="size-8 shrink-0" />
              <span className="font-press-start text-sm text-black">
                {t(`rows.${row.id}.label`)}
              </span>
              <span className="text-xs text-[min(calc((100vw-124px)/20.5),14px)] tracking-[-2%] text-[#03A84E] sm:text-sm sm:tracking-tight">
                {t(`rows.${row.id}.detail`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
