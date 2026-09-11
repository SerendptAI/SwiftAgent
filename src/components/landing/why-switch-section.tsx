"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.whySwitch.reasons` catalogue, keyed by id. */
const REASONS = [
  {
    id: "fasterSetup",
    illustration: "/images/home/why-switch-faster-setup.svg",
    maxWidth: 160,
    accent: "#03A84E",
  },
  {
    id: "smarterAutomation",
    illustration: "/images/home/why-switch-smarter-automation-v2.svg",
    maxWidth: 102,
    accent: "#7F9FFF",
  },
  {
    id: "simplerOperations",
    illustration: "/images/home/why-switch-simpler-operations.svg",
    maxWidth: 120,
    accent: "#F2B035",
  },
  {
    id: "predictableGrowth",
    illustration: "/images/home/why-switch-predictable-growth-v2.svg",
    maxWidth: 86,
    accent: "#6433CC",
  },
];

export function WhySwitchSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.whySwitch");

  return (
    <section className="w-full bg-white px-6 pb-16 md:px-10 md:pb-20 lg:px-16">
      <div className="mx-auto flex max-w-360 flex-col gap-12">
        <div className="flex flex-col gap-6">
          <span className="font-press-start text-base leading-[1.2] font-medium tracking-[10%] text-[#F25430] uppercase md:text-lg">
            {t("badge")}
          </span>
          <h2 className="font-greed text-4xl leading-[1.42] font-semibold tracking-[-2%] whitespace-pre-line capitalize md:text-5xl">
            {t("heading")}
          </h2>
          <p className="text-base leading-normal tracking-[2%]">{t("body")}</p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-x-5 gap-y-6 pb-14 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4"
        >
          {REASONS.map((reason) => (
            <div
              key={reason.id}
              className="relative flex h-full flex-col space-y-6 rounded-xl border border-[#1f1f1f] bg-[#F6F4EF] p-6 drop-shadow-[-4px_4px_0px_#000000]"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-[#1f1f1f] uppercase">
                  {t(`reasons.${reason.id}.title`)}
                </h3>

                <p className="text-base tracking-[2%] text-black/60">
                  {t(`reasons.${reason.id}.description`)}
                </p>
              </div>

              <div
                className="relative z-10 mt-auto flex aspect-275/154 h-auto w-full items-center justify-center overflow-hidden border-2 border-[#1f1f1f]"
                style={{ backgroundColor: reason.accent }}
              >
                <Image
                  src={reason.illustration}
                  alt=""
                  fill
                  className="m-auto h-auto w-full object-contain object-center"
                  style={{ maxWidth: reason.maxWidth }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
