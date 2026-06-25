/* eslint-disable @next/next/no-img-element */

import { NumberInput } from "./number-input";
import { BENCHMARK } from "./utils";

export interface YourNumbersPanelProps {
  monthlyConvos: number;
  setMonthlyConvos: (v: number) => void;
  teamSize: number;
  setTeamSize: (v: number) => void;
  costPerAgent: number;
  setCostPerAgent: (v: number) => void;
  repetitiveRate: number;
  setRepetitiveRate: (v: number) => void;
}

export function YourNumbersPanel({
  monthlyConvos,
  setMonthlyConvos,
  teamSize,
  setTeamSize,
  costPerAgent,
  setCostPerAgent,
  repetitiveRate,
  setRepetitiveRate,
}: YourNumbersPanelProps) {
  return (
    <div className="relative isolate grid min-h-71 overflow-hidden bg-[#03A84E] px-6 pt-8 pb-32 md:px-10 lg:px-14 lg:pb-12">
      <img
        alt=""
        src="/images/demo-numbers-section-bg-1.svg"
        className="absolute top-0 right-4 -z-1 rotate-180 sm:top-auto sm:right-auto sm:bottom-0 sm:left-6 sm:rotate-0 md:left-14"
      />
      <img
        alt=""
        src="/images/demo-numbers-section-bg-2.svg"
        className="absolute right-0 -bottom-8 -z-1 sm:bottom-0"
      />

      <div className="relative grid w-full">
        <p className="font-dm-mono mb-6 text-base leading-[1.2] tracking-[10%] text-white uppercase md:text-lg">
          YOUR NUMBERS
        </p>

        <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-[2fr_1fr] xl:gap-12">
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-[250px_250px_250px] xl:gap-12">
            <div>
              <p className="font-dm-mono mb-2.5 text-sm leading-normal font-medium tracking-[10%] text-white/50 uppercase md:text-base">
                MONTHLY CONVERSATIONS
              </p>
              <NumberInput
                value={monthlyConvos}
                onChange={setMonthlyConvos}
                suffix="CONVOS"
                width="w-20"
              />
            </div>

            <div>
              <p className="font-dm-mono mb-2.5 text-sm leading-normal font-medium tracking-[10%] text-white/50 uppercase md:text-base">
                CURRENT TEAM SIZE
              </p>
              <NumberInput
                value={teamSize}
                onChange={setTeamSize}
                suffix="HUMAN AGENTS"
                width="w-10"
              />
            </div>

            <div>
              <p className="font-dm-mono mb-2.5 text-sm leading-normal font-medium tracking-[10%] text-white/50 uppercase md:text-base">
                MONTHLY COST PER AGENT
              </p>
              <NumberInput
                value={costPerAgent}
                onChange={setCostPerAgent}
                suffix="/HUMAN AGENTS"
                width="w-16"
              />
            </div>
          </div>

          <div>
            <div className="font-dm-mono mb-2.5 flex items-center justify-between text-sm leading-normal font-medium tracking-[10%] uppercase md:text-base">
              <p className="text-white/50">REPETITIVE SUPPORT QUERIES</p>
              <span className="text-white">{repetitiveRate}%</span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={repetitiveRate}
              onChange={(e) => setRepetitiveRate(Number(e.target.value))}
              className="h-2 w-full cursor-grab rounded-full border border-black active:cursor-grabbing [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-[#F2B035]"
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                background: `linear-gradient(to right, #F2B035 ${repetitiveRate}%, rgba(255,255,255) ${repetitiveRate}%)`,
              }}
            />
          </div>
        </div>

        <p className="font-dm-mono mt-8 w-full max-w-196 text-sm leading-normal tracking-[10%] text-white uppercase md:text-base">
          BASED ON AN INDUSTRY BENCHMARK OF {BENCHMARK.toLocaleString()} TICKETS
          RESOLVED PER AGENT PER MONTH.
        </p>
      </div>
    </div>
  );
}
