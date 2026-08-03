"use client";

import {
  StackedColumnChart,
  TrendLineChart,
} from "@/components/admin/analytics/charts";
import {
  ChartLegend,
  KpiRow,
  Panel,
} from "@/components/admin/analytics/primitives";
import { BRAND, ResolutionPerformanceView } from "@/lib/admin-analytics";

const OUTCOME_SERIES = [
  { key: "resolved", name: "AI Resolved", color: BRAND.purple },
  { key: "escalated", name: "Escalated", color: BRAND.orange },
  { key: "pending", name: "Pending", color: BRAND.yellow },
];

function ChannelTimesTable({
  channelTimes,
}: Pick<ResolutionPerformanceView, "channelTimes">) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#f6f4ef]">
          <th className="font-dm-mono rounded-l-[6px] px-3 py-2 text-left text-[12px] font-normal text-[#7e7e7e] uppercase">
            Channel
          </th>
          <th className="font-dm-mono px-3 py-2 text-right text-[12px] font-normal text-[#7e7e7e] uppercase">
            Avg Time
          </th>
          <th className="font-dm-mono rounded-r-[6px] px-3 py-2 text-right text-[12px] font-normal text-[#7e7e7e] uppercase">
            Volume
          </th>
        </tr>
      </thead>
      <tbody>
        {channelTimes.map((row) => (
          <tr
            key={row.channel}
            className="border-b border-[rgba(31,31,31,0.06)] last:border-0"
          >
            <td className="font-stolzl px-3 py-3 text-[14px] text-[#1f1f1f]">
              {row.channel}
            </td>
            <td className="font-dm-mono px-3 py-3 text-right text-[14px] text-[#6433cc]">
              {row.time}
            </td>
            <td className="font-dm-mono px-3 py-3 text-right text-[14px] text-[#1f1f1f]">
              {row.volume}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ResolutionPerformance({
  data,
}: {
  data: ResolutionPerformanceView;
}) {
  return (
    <div className="flex flex-col gap-4">
      <KpiRow items={data.kpis} />
      <Panel eyebrow="Historical Metrics" title="ARR & Escalation Rate Trends">
        <ChartLegend
          items={[
            {
              label: "Autonomous Resolution Rate (ARR)",
              color: BRAND.purple,
            },
            { label: "Human Escalation Rate", color: BRAND.orange },
          ]}
        />
        <TrendLineChart
          data={data.trends}
          series={[
            {
              key: "arr",
              name: "Autonomous Resolution Rate (ARR)",
              color: BRAND.purple,
            },
            {
              key: "escalation",
              name: "Human Escalation Rate",
              color: BRAND.orange,
              dashed: true,
            },
          ]}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-4">
        <Panel eyebrow="Weekly Breakdown" title="Resolution Outcomes by Week">
          {/* Reversed so AI Resolved stacks on top, as in the design. */}
          <StackedColumnChart
            data={data.weekly}
            series={[...OUTCOME_SERIES].reverse()}
          />
          <ChartLegend
            items={OUTCOME_SERIES.map(({ name, color }) => ({
              label: name,
              color,
            }))}
          />
        </Panel>
        <Panel eyebrow="Channel Metrics" title="Resolution Time by Channel">
          <ChannelTimesTable channelTimes={data.channelTimes} />
        </Panel>
      </div>
    </div>
  );
}
