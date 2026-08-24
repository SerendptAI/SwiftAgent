"use client";

import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.industries.items` catalogue, keyed by id. */
const INDUSTRIES = [
  { id: "ecommerce", image: "/images/home/industry-ecommerce.svg" },
  { id: "esaas", image: "/images/home/industry-esaas.svg" },
  { id: "fintech", image: "/images/home/industry-fintech.svg" },
  {
    id: "digitalPlatforms",
    image: "/images/home/industry-digital-platforms.svg",
  },
];

export function IndustriesSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.industries");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        {/* Header */}
        <div className="mb-10 text-center md:mb-14 md:text-left">
          <p className="font-dm-mono mb-4 text-xs tracking-[0.2em] text-gray-500 uppercase md:text-sm">
            {t("eyebrow")}
          </p>
          {/* The newline in the copy only becomes a break from md up, which is
              what the responsive <br> it replaced did. */}
          <h2 className="font-greed-narrow max-w-240 text-4xl leading-[1.34] font-medium tracking-[-2%] whitespace-normal text-black uppercase md:text-5xl md:whitespace-pre-line lg:text-[66px]">
            {t("heading")}
          </h2>
        </div>

        {/* Industry cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4 xl:gap-15"
        >
          {INDUSTRIES.map((industry) => (
            <div key={industry.id} className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={industry.image}
                alt={t(`items.${industry.id}.label`)}
                className="aspect-297/185 h-auto w-auto object-cover"
              />
              <p className="font-stolzl text-base leading-normal tracking-[2%] text-black xl:text-lg">
                <span className="font-bold">
                  {t(`items.${industry.id}.label`)}:
                </span>{" "}
                {t(`items.${industry.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
