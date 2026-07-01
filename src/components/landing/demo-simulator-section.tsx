"use client";

import { useState } from "react";

import { ComparisonPanel } from "./demo-simulator/comparison-panel";
import { CtaPanel } from "./demo-simulator/cta-panel";
import { CurrencySelector } from "./demo-simulator/currency-selector";
import { FteAvoidedPanel } from "./demo-simulator/fte-avoided-panel";
import {
  BENCHMARK,
  CURRENCIES,
  type CurrencyCode,
  EXCHANGE_RATES,
} from "./demo-simulator/utils";
import { YourNumbersPanel } from "./demo-simulator/your-numbers-panel";

export function DemoSimulatorSection() {
  const [monthlyConvos, setMonthlyConvos] = useState(8000);
  const [teamSize, setTeamSize] = useState(6);
  // Source of truth is always USD; other currencies are derived from it.
  const [costPerAgentUsd, setCostPerAgentUsd] = useState(4500);
  const [repetitiveRate, setRepetitiveRate] = useState(65);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const sym = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";
  const rate = EXCHANGE_RATES[currency];
  const costPerAgent = Math.ceil(costPerAgentUsd * rate);
  const setCostPerAgent = (v: number) => setCostPerAgentUsd(v / rate);

  const ticketsAutomated = Math.round(monthlyConvos * (repetitiveRate / 100));
  const fteAvoided = ticketsAutomated / BENCHMARK;
  const totalAgentsNeeded = monthlyConvos / BENCHMARK;
  const agentsStillNeeded = (monthlyConvos - ticketsAutomated) / BENCHMARK;
  const newSupportLoad = monthlyConvos - ticketsAutomated;
  const currentMonthlyCost = teamSize * costPerAgent;
  const costAfterAutomation = agentsStillNeeded * costPerAgent;
  const monthlySavings = currentMonthlyCost - costAfterAutomation;

  return (
    <div className="mt-10 w-full">
      <CurrencySelector
        currency={currency}
        currencyOpen={currencyOpen}
        onSelect={(code) => {
          setCurrency(code);
          setCurrencyOpen(false);
        }}
        onToggle={() => setCurrencyOpen((p) => !p)}
      />
      <YourNumbersPanel
        monthlyConvos={monthlyConvos}
        setMonthlyConvos={setMonthlyConvos}
        teamSize={teamSize}
        setTeamSize={setTeamSize}
        costPerAgent={costPerAgent}
        setCostPerAgent={setCostPerAgent}
        repetitiveRate={repetitiveRate}
        setRepetitiveRate={setRepetitiveRate}
        sym={sym}
        currency={currency}
      />
      <FteAvoidedPanel
        fteAvoided={fteAvoided}
        totalAgentsNeeded={totalAgentsNeeded}
        agentsStillNeeded={agentsStillNeeded}
      />
      <ComparisonPanel
        monthlyConvos={monthlyConvos}
        totalAgentsNeeded={totalAgentsNeeded}
        currentMonthlyCost={currentMonthlyCost}
        repetitiveRate={repetitiveRate}
        ticketsAutomated={ticketsAutomated}
        fteAvoided={fteAvoided}
        newSupportLoad={newSupportLoad}
        costAfterAutomation={costAfterAutomation}
        monthlySavings={monthlySavings}
        sym={sym}
      />
      <CtaPanel />
    </div>
  );
}
