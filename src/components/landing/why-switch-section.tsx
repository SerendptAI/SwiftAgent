"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/** Copy lives in the `home.whySwitch.reasons` catalogue, keyed by id. */
const REASONS = [
  {
    id: "fasterSetup",
    illustration: "/images/home/why-switch-faster-setup.svg",
    accent: "#03A84E",
  },
  {
    id: "smarterAutomation",
    illustration: "/images/home/why-switch-smarter-automation-v2.svg",
    accent: "#7F9FFF",
  },
  {
    id: "simplerOperations",
    illustration: "/images/home/why-switch-simpler-operations.svg",
    accent: "#F2B035",
  },
  {
    id: "predictableGrowth",
    illustration: "/images/home/why-switch-predictable-growth-v2.svg",
    accent: "#6433CC",
  },
];

export function WhySwitchSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();
  const t = useTranslations("home.whySwitch");

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <span className="font-dm-mono w-fit rounded-full bg-[#F25430] px-4 py-1.5 text-sm text-white uppercase">
            {t("badge")}
          </span>
          <p className="font-dm-mono text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:text-[32px]">
            {t("heading")}
          </p>
          <p className="font-stolzl text-base leading-relaxed text-black">
            {t("body")}
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-x-5 gap-y-26 pb-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {REASONS.map((reason) => (
            <div
              key={reason.id}
              className="relative flex h-full flex-col rounded-xl border border-[#1f1f1f] bg-[#F6F4EF] drop-shadow-[-3px_4px_0px_#000000]"
            >
              <div className="flex flex-col gap-2 p-5 xl:p-6">
                <p className="font-dm-mono text-lg font-medium text-[#1f1f1f] uppercase">
                  {t(`reasons.${reason.id}.title`)}
                </p>
                <p className="font-stolzl text-base text-black/60">
                  {t(`reasons.${reason.id}.description`)}
                </p>
              </div>
              <div
                className="relative z-10 mx-5 mt-auto -mb-14 h-29 overflow-hidden rounded-lg border border-[#1f1f1f] xl:mx-6"
                style={{ backgroundColor: reason.accent }}
              >
                <Image
                  src={reason.illustration}
                  alt=""
                  fill
                  className="object-contain object-bottom p-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
