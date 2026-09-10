import { useTranslations } from "next-intl";

import { fmtDec, fmtInt, fmtMoney } from "./utils";

export interface CurrentRealityCardProps {
  monthlyConvos: number;
  totalAgentsNeeded: number;
  currentMonthlyCost: number;
  sym: string;
}

export function CurrentRealityCard({
  monthlyConvos,
  totalAgentsNeeded,
  currentMonthlyCost,
  sym,
}: CurrentRealityCardProps) {
  const t = useTranslations("demo.currentReality");

  return (
    <div className="bg-white p-6 shadow-[-3px_3px_0px_0px_#000000] md:px-8.5 md:pt-5.5 md:pb-8">
      <div className="mb-8">
        <span className="font-dm-mono text-base leading-[1.6] tracking-[10%] text-black/60 uppercase md:text-lg">
          {t("badge")}
        </span>
      </div>

      <h3 className="font-dm-mono mb-8 text-lg leading-[1.6] font-medium tracking-[10%] text-black uppercase md:text-xl">
        {t("title")}
      </h3>

      <div className="font-stolzl mb-8 divide-y divide-black/37 border-b border-black/37 text-sm leading-normal tracking-[2%] text-black/80 sm:text-base">
        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">
            {t("monthlyConversations")}
          </span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtInt(monthlyConvos)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">{t("monthlyTickets")}</span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtInt(monthlyConvos)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">{t("agentsRequired")}</span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtDec(totalAgentsNeeded)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 py-4 pl-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:pr-4">
          <span className="md:min-w-0 md:flex-1">{t("monthlyTeamCost")}</span>
          <span className="mt-1 shrink-0 text-lg font-medium whitespace-nowrap sm:mt-0 sm:text-base md:font-normal">
            {fmtMoney(currentMonthlyCost, sym)}
          </span>
        </div>
      </div>

      <p className="font-dm-mono px-2.5 text-sm leading-[1.8] tracking-[10%] text-black/92 uppercase">
        {t("note")}
      </p>
    </div>
  );
}
