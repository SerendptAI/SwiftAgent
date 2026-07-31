"use client";

import { TrendLineChart } from "@/components/admin/analytics/charts";
import {
  BarList,
  ChartLegend,
  KpiRow,
  Panel,
  StackedBar,
} from "@/components/admin/analytics/primitives";
import { BRAND, businessImpact as data } from "@/lib/admin-analytics";

function RoiSummary() {
  const { roi } = data;

  return (
    <div className="flex flex-1 items-start gap-6">
      <div className="flex w-[248px] shrink-0 flex-col gap-2 rounded-[8px] border-2 border-[rgba(31,31,31,0.1)] bg-[#ece6f7] p-4">
        <p className="font-dm-mono text-[12px] text-[#6433cc] uppercase">
          Total Return
        </p>
        <p className="font-dm-mono text-[24px] font-medium text-[#1f1f1f]">
          {roi.totalReturn}
        </p>
        <p className="font-dm-mono text-[11px] whitespace-nowrap text-[#7e7e7e]">
          {roi.investmentNote}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-3">
          {roi.breakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="font-stolzl flex-1 text-[14px] text-[#1f1f1f]">
                {item.label}
              </p>
              <p className="font-dm-mono text-[14px] text-[#1f1f1f]">
                {item.display}
              </p>
            </div>
          ))}
        </div>
        <StackedBar items={roi.breakdown} />
      </div>
    </div>
  );
}

export function BusinessImpact() {
  return (
    <div className="flex flex-col gap-4">
      <KpiRow items={data.kpis} />
      <Panel
        eyebrow="Cumulative Savings Timeline"
        title="Cost Saved vs. Hours Saved Trends"
        action={
          <ChartLegend
            items={[
              { label: "Cost Saved ($k)", color: BRAND.purple },
              { label: "Hours Saved", color: BRAND.yellow },
            ]}
          />
        }
      >
        <TrendLineChart
          data={data.trends}
          domain={[0, 28]}
          series={[
            { key: "cost", name: "Cost Saved ($k)", color: BRAND.purple },
            {
              key: "hours",
              name: "Hours Saved",
              color: BRAND.yellow,
              dashed: true,
              dots: true,
            },
          ]}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-4">
        <Panel eyebrow="Organizational Impact" title="Savings by Department">
          <BarList items={data.departments} />
        </Panel>
        <Panel eyebrow="Efficiency Audit" title="ROI Calculator Summary">
          <RoiSummary />
        </Panel>
      </div>
    </div>
  );
}
