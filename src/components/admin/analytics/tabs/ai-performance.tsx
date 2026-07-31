"use client";

import { TrendLineChart } from "@/components/admin/analytics/charts";
import {
  ChartLegend,
  Donut,
  DonutLegend,
  InlineBarList,
  KpiRow,
  Panel,
} from "@/components/admin/analytics/primitives";
import { aiPerformance as data, BRAND } from "@/lib/admin-analytics";

export function AiPerformance() {
  return (
    <div className="flex flex-col gap-4">
      <KpiRow items={data.kpis} />
      <Panel
        eyebrow="Accuracy Analytics"
        title="AI Accuracy & Confidence Trends"
      >
        <ChartLegend
          items={[
            { label: "AI Accuracy Rate", color: BRAND.purple },
            { label: "Confidence Score Avg", color: BRAND.yellow },
          ]}
        />
        <TrendLineChart
          data={data.trends}
          domain={[74, 98]}
          series={[
            { key: "accuracy", name: "AI Accuracy Rate", color: BRAND.purple },
            {
              key: "confidence",
              name: "Confidence Score Avg",
              color: BRAND.yellow,
            },
          ]}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-4">
        <Panel eyebrow="Latency Analytics" title="Response Time Distribution">
          <InlineBarList items={data.responseTimes} />
        </Panel>
        <Panel eyebrow="Model Health" title="Confidence Level Distribution">
          <div className="flex flex-1 items-center justify-center gap-8">
            <Donut
              slices={data.confidence.slices}
              centerValue={data.confidence.centerValue}
              centerLabel={data.confidence.centerLabel}
            />
            <div className="flex-1">
              <DonutLegend slices={data.confidence.slices} variant="inline" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
