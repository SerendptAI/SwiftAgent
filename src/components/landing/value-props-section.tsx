"use client";

import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.valueProps` catalogue, keyed by id. */
const VALUE_PROPS = [
  { id: "repetitiveRequests", icon: "wave-rounded-square" },
  { id: "responseTimes", icon: "clock-rounded-square" },
  { id: "betterExperiences", icon: "box-rounded-square" },
  { id: "scaleSupport", icon: "scale-rounded-square" },
];

export function ValuePropsSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.valueProps");

  return (
    <section className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-360 space-y-12">
        <p className="font-greed text-2xl leading-[1.2] font-semibold tracking-[-2%] capitalize md:text-[32px] lg:text-[40px]">
          {t("heading")}
        </p>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.id}
              className="flex flex-col gap-4 rounded-xl border border-[#1f1f1f] bg-[#F6F4EF] p-6 drop-shadow-[-4px_4px_0px_#000000]"
            >
              <img
                src={`/icons/${prop.icon}.svg`}
                alt={t(`items.${prop.id}.title`)}
                className="size-10 object-contain object-center text-white"
              />

              <p className="font-press-start text-base font-medium uppercase">
                {t(`items.${prop.id}.title`)}
              </p>
              <p className="text-base leading-normal text-black">
                {t(`items.${prop.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
