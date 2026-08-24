import { useTranslations } from "next-intl";

/* eslint-disable @next/next/no-img-element */
import { fmtDec } from "./utils";

export interface FteAvoidedPanelProps {
  fteAvoided: number;
  totalAgentsNeeded: number;
  agentsStillNeeded: number;
}

export function FteAvoidedPanel({
  fteAvoided,
  totalAgentsNeeded,
  agentsStillNeeded,
}: FteAvoidedPanelProps) {
  const t = useTranslations("demo.fte");

  return (
    <div className="relative isolate mt-8 grid min-h-58 overflow-hidden bg-[#03A84E] px-6 pt-8 pb-28 md:px-10 lg:px-14 lg:pb-12">
      <img
        alt=""
        src="/images/demo-fte-section-bg.svg"
        className="absolute right-0 bottom-0 -z-1 sm:-bottom-8 lg:bottom-0"
      />

      <div className="relative grid w-full">
        <p className="font-dm-mono mb-6 text-base leading-[1.2] tracking-[10%] text-white uppercase md:text-lg">
          {t("eyebrow")}
        </p>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="font-greed-narrow text-8xl leading-none font-medium tracking-[-2%] text-white md:text-9xl lg:text-[128px]">
            {fmtDec(fteAvoided)}
          </div>

          <div className="font-dm-mono flex flex-col gap-2 text-base leading-[1.2] tracking-[10%] uppercase md:-mb-10 md:text-lg lg:-mb-12">
            <span className="text-white/50">{t("unit")}</span>
            <div className="flex gap-8 text-white">
              <span>
                {fmtDec(totalAgentsNeeded)} {t("needed")}
              </span>
              <span>
                {fmtDec(agentsStillNeeded)} {t("needed")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
