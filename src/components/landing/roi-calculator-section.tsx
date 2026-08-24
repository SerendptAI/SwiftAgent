"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Link } from "@/i18n/navigation";

export function RoiCalculatorSection() {
  const cardRef = useScrollReveal<HTMLDivElement>({ self: true });
  const t = useTranslations("home.roiCalculator");

  return (
    <section className="w-full bg-[#F2B035] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col items-start gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex w-full flex-1 flex-col gap-6 lg:w-auto">
          <p className="font-dm-mono text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:text-4xl">
            {t("heading")}
          </p>
          <p className="font-stolzl text-base leading-relaxed text-black">
            {t("body")}
          </p>
          <Button
            variant="outline"
            size="lg"
            className="w-full max-w-100 border-[#1f1f1f] lg:w-fit lg:max-w-none"
            asChild
          >
            <Link href="/demo">{t("cta")}</Link>
          </Button>
        </div>

        <div
          ref={cardRef}
          className="w-full max-w-100 shrink-0 rounded-2xl border border-[#1f1f1f] bg-white p-6 drop-shadow-[-3px_4px_0px_#000000]"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-dm-mono text-xs font-medium text-[#1f1f1f] uppercase">
              {t("estimator.title")}
            </span>
            <span className="size-2.5 rounded-full bg-[#F25430]" />
          </div>

          {/* Illustrative figures, not a live calculation. They are catalogue
              entries because currency and digit grouping differ by locale. */}
          <div className="mb-4 rounded-lg border border-[#1f1f1f] bg-[#F6F4EF] p-3 text-center">
            <span className="font-dm-mono text-2xl text-[#1f1f1f]">
              {t("estimator.saved")}
            </span>
          </div>

          <div className="font-dm-mono flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between text-[#1f1f1f]">
              <span>{t("estimator.ticketsLabel")}</span>
              <span className="font-medium">{t("estimator.ticketsValue")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#1f1f1f]">
                {t("estimator.agentsLabel")}
              </span>
              <span className="font-medium text-[#03A84E]">
                {t("estimator.agentsValue")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
