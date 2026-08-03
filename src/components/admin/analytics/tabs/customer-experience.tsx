"use client";

import { GroupedBarChart } from "@/components/admin/analytics/charts";
import {
  ChartLegend,
  Donut,
  DonutLegend,
  KpiRow,
  Panel,
} from "@/components/admin/analytics/primitives";
import { BRAND, CustomerExperienceView } from "@/lib/admin-analytics";

const TONE_COLOR = {
  Positive: BRAND.purple,
  Neutral: BRAND.yellow,
  Negative: BRAND.orange,
} as const;

function ThemeRow({
  label,
  mentions,
  tone,
}: CustomerExperienceView["themes"][number]) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[8px] border-2 border-[rgba(31,31,31,0.1)] px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: TONE_COLOR[tone] }}
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-stolzl truncate text-[14px] font-semibold text-[#1f1f1f]">
            {label}
          </p>
          <p className="font-dm-mono text-[12px] text-[#7e7e7e]">{mentions}</p>
        </div>
      </div>
      <span className="font-dm-mono shrink-0 rounded-[4px] border border-[rgba(31,31,31,0.1)] bg-[#f6f4ef] px-2 py-1 text-[10px] text-[#7e7e7e] uppercase">
        {tone}
      </span>
    </div>
  );
}

export function CustomerExperience({ data }: { data: CustomerExperienceView }) {
  return (
    <div className="flex flex-col gap-4">
      <KpiRow items={data.kpis} />
      <Panel
        eyebrow="NPS & Satisfaction Tracker"
        title="Monthly CSAT & NPS Trends"
      >
        <ChartLegend
          items={[
            { label: "CSAT Score", color: BRAND.purple },
            { label: "NPS Score", color: BRAND.yellow },
          ]}
        />
        <GroupedBarChart
          data={data.trends}
          series={[
            { key: "csat", name: "CSAT Score", color: BRAND.purple },
            // NPS runs 0-100 against CSAT's 0-5, so it needs its own scale.
            { key: "nps", name: "NPS Score", color: BRAND.yellow, axis: "nps" },
          ]}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-4">
        <Panel eyebrow="Feedback Analysis" title="Customer Sentiment Breakdown">
          <div className="flex flex-1 items-center justify-center gap-8">
            <Donut
              slices={data.sentiment.slices}
              centerValue={data.sentiment.centerValue}
              centerLabel={data.sentiment.centerLabel}
            />
            <div className="flex-1">
              <DonutLegend slices={data.sentiment.slices} variant="inline" />
            </div>
          </div>
        </Panel>
        <Panel eyebrow="Text Analytics" title="Top Feedback Themes">
          <div className="flex flex-col gap-2">
            {data.themes.map((theme) => (
              <ThemeRow key={theme.label} {...theme} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
