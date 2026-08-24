"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.valueProps` catalogue, keyed by id. */
const VALUE_PROPS = [
  { id: "repetitiveRequests", accent: "#F2B035" },
  { id: "responseTimes", accent: "#F25430" },
  { id: "betterExperiences", accent: "#7F9FFF" },
  { id: "scaleSupport", accent: "#03A84E" },
];

export function ValuePropsSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.valueProps");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-360">
        <p className="font-dm-mono mb-8 text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:mb-10 md:text-[32px]">
          {t("heading")}
        </p>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.id}
              className="flex flex-col gap-4 rounded-xl border border-[#1f1f1f] bg-[#F6F4EF] p-6 drop-shadow-[-3px_4px_0px_#000000]"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#1f1f1f]"
                style={{ backgroundColor: prop.accent }}
              >
                <Check className="size-4 text-white" strokeWidth={3} />
              </div>
              <p className="font-dm-mono text-lg font-medium text-[#1f1f1f] uppercase">
                {t(`items.${prop.id}.title`)}
              </p>
              <p className="font-stolzl text-base leading-relaxed text-black">
                {t(`items.${prop.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
