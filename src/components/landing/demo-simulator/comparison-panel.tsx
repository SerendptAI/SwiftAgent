/* eslint-disable @next/next/no-img-element */

import { AutomatedSystemCard } from "./automated-system-card";
import { CurrentRealityCard } from "./current-reality-card";

export interface ComparisonPanelProps {
  monthlyConvos: number;
  totalAgentsNeeded: number;
  currentMonthlyCost: number;
  repetitiveRate: number;
  ticketsAutomated: number;
  fteAvoided: number;
  newSupportLoad: number;
  costAfterAutomation: number;
  monthlySavings: number;
  sym: string;
}

export function ComparisonPanel({
  monthlyConvos,
  totalAgentsNeeded,
  currentMonthlyCost,
  repetitiveRate,
  ticketsAutomated,
  fteAvoided,
  newSupportLoad,
  costAfterAutomation,
  monthlySavings,
  sym,
}: ComparisonPanelProps) {
  return (
    <div className="mt-8 flex flex-col gap-8 xl:flex-row">
      <div className="relative isolate grid overflow-hidden bg-[#03A84E] px-4 py-6 sm:px-6 sm:py-8 md:flex-1 md:px-8 md:py-10 lg:px-10">
        <img
          alt=""
          src="/images/demo-overloaded-star.svg"
          className="absolute top-0 right-0 hidden md:flex"
        />
        <CurrentRealityCard
          monthlyConvos={monthlyConvos}
          totalAgentsNeeded={totalAgentsNeeded}
          currentMonthlyCost={currentMonthlyCost}
          sym={sym}
        />
      </div>

      <div className="grid bg-[#03A84E] px-4 py-6 sm:px-6 sm:py-8 md:flex-1 md:px-8 md:py-10 lg:px-10">
        <AutomatedSystemCard
          repetitiveRate={repetitiveRate}
          ticketsAutomated={ticketsAutomated}
          fteAvoided={fteAvoided}
          newSupportLoad={newSupportLoad}
          costAfterAutomation={costAfterAutomation}
          monthlySavings={monthlySavings}
          sym={sym}
        />
      </div>
    </div>
  );
}
