"use client";

import { TrendLineChart } from "@/components/admin/analytics/charts";
import {
  BarList,
  ChartLegend,
  KpiRow,
  Panel,
  StackedBar,
} from "@/components/admin/analytics/primitives";
import { BRAND, BusinessImpactView } from "@/lib/admin-analytics";

function RoiSummary({ roi }: Pick<BusinessImpactView, "roi">) {
  return (
    <div className="flex flex-1 items-start gap-6">
      <div className="flex w-[248px] shrink-0 flex-col gap-2 rounded-[8px] border-2 border-[rgba(31,31,31,0.1)] bg-[#ece6f7] p-4">
        <p className="text-[12px] text-[#6433cc] uppercase">Total Return</p>
        <p className="text-[24px] font-medium text-[#1f1f1f]">
          {roi.totalReturn}
        </p>
        <p className="text-[11px] whitespace-nowrap text-[#7e7e7e]">
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
              <p className="flex-1 text-[14px] text-[#1f1f1f]">{item.label}</p>
              <p className="text-[14px] text-[#1f1f1f]">{item.display}</p>
            </div>
          ))}
        </div>
        <StackedBar items={roi.breakdown} />
      </div>
    </div>
  );
}

export function BusinessImpact({ data }: { data: BusinessImpactView }) {
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
          series={[
            { key: "cost", name: "Cost Saved ($k)", color: BRAND.purple },
            {
              // Raw hours dwarf the same period's dollars-in-thousands.
              key: "hours",
              name: "Hours Saved",
              color: BRAND.yellow,
              dashed: true,
              dots: true,
              axis: "hours",
            },
          ]}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-4">
        <Panel eyebrow="Organizational Impact" title="Savings by Department">
          <BarList items={data.departments} />
        </Panel>
        <Panel eyebrow="Efficiency Audit" title="ROI Calculator Summary">
          <RoiSummary roi={data.roi} />
        </Panel>
      </div>
    </div>
  );
}
