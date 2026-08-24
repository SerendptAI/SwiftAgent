"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.features` catalogue, keyed by id. */
const FEATURES = [
  {
    id: "instantSupport",
    icon: "/images/home/feature-instant-support.svg",
    accent: "#7F9FFF",
  },
  {
    id: "productGuidance",
    icon: "/images/home/feature-product-guidance.svg",
    accent: "#F2B035",
  },
  {
    id: "paymentSupport",
    icon: "/images/home/feature-payment-support.svg",
    accent: "#F25430",
  },
  {
    id: "knowledgeSearch",
    icon: "/images/home/feature-knowledge-search.svg",
    accent: "#03A84E",
  },
];

export function FeaturesGridSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.features");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-360">
        <p className="font-dm-mono mb-8 text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:mb-10 md:text-[32px]">
          {t("heading")}
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col gap-4 rounded-2xl border border-[#1f1f1f] bg-[#F6F4EF] p-8 drop-shadow-[-3px_4px_0px_#000000]"
            >
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#1f1f1f]"
                style={{ backgroundColor: feature.accent }}
              >
                <Image src={feature.icon} alt="" width={24} height={24} />
              </div>
              <p className="font-dm-mono text-xl font-medium text-[#1f1f1f] uppercase">
                {t(`items.${feature.id}.title`)}
              </p>
              <p className="font-stolzl text-base leading-relaxed text-black">
                {t(`items.${feature.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
