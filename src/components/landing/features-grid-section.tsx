"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.features` catalogue, keyed by id. */
const FEATURES = [
  {
    id: "instantSupport",
    icon: "chat-bubble-rounded-square.svg",
  },
  {
    id: "productGuidance",
    icon: "curly-braces-rounded-square.svg",
  },
  {
    id: "paymentSupport",
    icon: "wallet-rounded-square.svg",
  },
  {
    id: "knowledgeSearch",
    icon: "bot-rounded-square.svg",
  },
];

export function FeaturesGridSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.features");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-360 space-y-12">
        <h2 className="font-greed max-w-4xl text-4xl leading-[1.42] font-semibold tracking-[-2%] whitespace-pre-line text-black capitalize md:text-5xl">
          {t("heading")}
        </h2>

        <div ref={cardsRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col gap-4 rounded-2xl border border-black bg-[#F6F4EF] p-8 drop-shadow-[-4px_4px_0px_#000000]"
            >
              <img
                loading="eager"
                src={`/icons/${feature.icon}`}
                alt={t(`items.${feature.id}.title`)}
                className="size-12 object-contain object-center"
              />

              <p className="font-press-start text-base text-[#1F1F1F] uppercase">
                {t(`items.${feature.id}.title`)}
              </p>
              <p className="text-base leading-normal text-black">
                {t(`items.${feature.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
