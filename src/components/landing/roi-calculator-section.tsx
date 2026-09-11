"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Link } from "@/i18n/navigation";

export function RoiCalculatorSection() {
  const cardRef = useScrollReveal<HTMLDivElement>({ self: true });
  const t = useTranslations("home.roiCalculator");

  return (
    <section className="w-full bg-[#6433CC] px-6 py-16 text-white md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col items-start justify-between gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex w-full max-w-222 flex-1 flex-col gap-6 lg:w-auto">
          <p className="font-press-start text-2xl leading-relaxed font-medium uppercase md:text-3xl">
            {t("heading")}
          </p>
          <p className="text-base leading-normal tracking-[2%]">{t("body")}</p>
          <Button
            variant="outline"
            size="lg"
            className="w-full max-w-100 border-black bg-[#03A84E] px-8 py-4 text-center leading-tight whitespace-normal text-white capitalize lg:w-fit lg:max-w-none"
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
            <span className="text-xs font-medium text-[#1f1f1f] uppercase">
              {t("estimator.title")}
            </span>

            <span className="size-2.5 rounded-full bg-[#F25430]" />
          </div>

          {/* Illustrative figures, not a live calculation. They are catalogue
              entries because currency and digit grouping differ by locale. */}
          <div className="mb-4 rounded-lg border border-[#1f1f1f] bg-[#F6F4EF] p-3 text-center">
            <span className="text-2xl text-[#1f1f1f]">
              {t("estimator.saved")}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
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
