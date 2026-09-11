import { useTranslations } from "next-intl";

import { fmtDec, fmtInt, fmtMoney } from "./utils";

export interface AutomatedSystemCardProps {
  repetitiveRate: number;
  ticketsAutomated: number;
  fteAvoided: number;
  newSupportLoad: number;
  costAfterAutomation: number;
  monthlySavings: number;
  sym: string;
}

export function AutomatedSystemCard({
  repetitiveRate,
  ticketsAutomated,
  fteAvoided,
  newSupportLoad,
  costAfterAutomation,
  monthlySavings,
  sym,
}: AutomatedSystemCardProps) {
  const t = useTranslations("demo.automated");

  return (
    <div className="bg-white p-6 shadow-[-4px_4px_0px_0px_#000000] md:px-8.5 md:pt-5.5 md:pb-8">
      <div className="font-dm-mono mb-8 flex flex-col text-base leading-[1.6] tracking-[10%] uppercase md:flex-row md:items-center md:justify-between md:text-lg">
        <span className="text-black/60">{t("badge")}</span>
        <span className="text-black">
          {t("automatedPercent", { rate: repetitiveRate })}
        </span>
      </div>

      <h3 className="font-dm-mono mb-8 text-lg leading-[1.6] font-medium tracking-[10%] text-black uppercase md:text-xl">
        {t("title")}
      </h3>

      <div className="font-stolzl mb-8 divide-y divide-black/37 border-b border-black/37 text-sm leading-normal tracking-[2%] text-black/80 sm:text-base">
        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">{t("ticketsAutomated")}</span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtInt(ticketsAutomated)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">{t("ticketsRemoved")}</span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtInt(ticketsAutomated)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">
            {t("agentsNoLongerNeeded")}
          </span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtDec(fteAvoided)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">{t("newSupportLoad")}</span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtInt(newSupportLoad)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">{t("costAfter")}</span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtMoney(costAfterAutomation, sym)}
          </span>
        </div>
      </div>

      <div className="font-stolzl flex items-center justify-between gap-3 bg-[#F2B035] p-4 leading-normal tracking-[2%] text-black shadow-[-4px_4px_0px_0px_#000000] md:px-6 md:py-5">
        <span className="min-w-0 flex-1">{t("monthlySavings")}</span>
        <span className="shrink-0 text-xl font-medium whitespace-nowrap sm:text-2xl md:text-[30px]">
          {fmtMoney(monthlySavings, sym)}
        </span>
      </div>
    </div>
  );
}
