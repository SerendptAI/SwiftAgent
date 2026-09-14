"use client";

import { ArrowUp } from "lucide-react";
import Image from "next/image";

import { Sparkline, TrendLineChart } from "@/components/admin/analytics/charts";
import {
  BarList,
  CARD,
  ChartLegend,
  Donut,
  DonutLegend,
  KpiRow,
  Panel,
} from "@/components/admin/analytics/primitives";
import { useToast } from "@/components/ui/toast";
import { BRAND, ExecutiveSummaryView } from "@/lib/admin-analytics";
import { cn } from "@/lib/utils";

function NorthStarCard({
  northStar,
  sparkline,
}: Pick<ExecutiveSummaryView, "northStar" | "sparkline">) {
  return (
    <section className="flex items-center gap-12 rounded-[16px] border-2 border-[rgba(31,31,31,0.1)] bg-[#ece6f7] p-8">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-[14px] text-[#6433cc] uppercase">
            {northStar.eyebrow}
          </p>
          <h2 className="font-greed text-[24px] text-[#1f1f1f]">
            {northStar.title}
          </h2>
        </div>
        <div className="flex items-baseline gap-3">
          <p className="text-[40px] font-medium text-[#6433cc]">
            {northStar.value}
          </p>
          <div className="flex items-center gap-1">
            <ArrowUp className="size-4 text-[#6433cc]" />
            <span className="text-[16px] font-medium text-[#6433cc]">
              {northStar.delta}
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-4">
        <div className="flex size-[72px] items-center justify-center rounded-[36px] border-2 border-[rgba(31,31,31,0.1)] bg-[#f2b035]">
          <Image
            src="/images/affiliate/avatar-orange.png"
            alt=""
            width={56}
            height={56}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Sparkline data={sparkline} color={BRAND.purple} />
          <p className="text-[11px] text-[#7e7e7e]">{northStar.caption}</p>
        </div>
      </div>
    </section>
  );
}

function CompaniesTable({
  companies,
}: Pick<ExecutiveSummaryView, "companies">) {
  const toast = useToast();

  return (
    <section className={cn(CARD, "flex flex-col gap-3")}>
      <h2 className="font-greed text-[16px] text-[#1f1f1f]">
        Top Companies by Conversation Volume
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-[rgba(31,31,31,0.1)]">
            <th className="px-2 py-2 text-left text-[12px] font-normal text-[#7e7e7e] uppercase">
              Company Name
            </th>
            <th className="px-2 py-2 text-right text-[12px] font-normal text-[#7e7e7e] uppercase">
              Conversations
            </th>
            <th className="px-2 py-2 text-right text-[12px] font-normal text-[#7e7e7e] uppercase">
              ARR
            </th>
            <th className="px-2 py-2 text-right text-[12px] font-normal text-[#7e7e7e] uppercase">
              CSAT Score
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company.name}
              onClick={() => toast.success(`Opening ${company.name} report.`)}
              className="cursor-pointer border-b border-[rgba(31,31,31,0.06)] transition-colors last:border-0 hover:bg-[#f6f4ef]"
            >
              <td className="px-2 py-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={company.avatar}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-[14px] font-semibold text-[#1f1f1f]">
                    {company.name}
                  </span>
                </div>
              </td>
              <td className="px-2 py-3 text-right text-[14px] text-[#1f1f1f]">
                {company.conversations}
              </td>
              <td className="px-2 py-3 text-right text-[14px] text-[#6433cc]">
                {company.arr}
              </td>
              <td className="px-2 py-3 text-right text-[14px] text-[#1f1f1f]">
                {company.csat}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function ExecutiveSummary({ data }: { data: ExecutiveSummaryView }) {
  return (
    <div className="flex flex-col gap-4">
      <NorthStarCard northStar={data.northStar} sparkline={data.sparkline} />
      <KpiRow items={data.kpis} />
      <Panel
        eyebrow="Historical Performance"
        title="ARR Trend Over Last 12 Months"
        action={
          <ChartLegend
            items={[
              { label: "Autonomous Resolution Rate", color: BRAND.purple },
              { label: "Target Goal (80%)", color: BRAND.orange, muted: true },
            ]}
          />
        }
      >
        <TrendLineChart
          data={data.arrTrend}
          series={[
            {
              key: "arr",
              name: "Autonomous Resolution Rate",
              color: BRAND.purple,
              dots: true,
              dotColor: BRAND.yellow,
            },
            {
              key: "target",
              name: "Target Goal",
              color: BRAND.orange,
              dashed: true,
            },
          ]}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-4">
        <Panel eyebrow="Load Distribution" title="Resolution by Channel">
          <BarList items={data.channels} />
        </Panel>
        <Panel eyebrow="Direct Triage Split" title="AI vs. Human Resolution">
          <div className="flex flex-1 items-center justify-center gap-8">
            <Donut
              slices={data.triage.slices}
              centerValue={data.triage.centerValue}
              centerLabel={data.triage.centerLabel}
            />
            <div className="flex-1">
              <DonutLegend slices={data.triage.slices} />
            </div>
          </div>
        </Panel>
      </div>
      <CompaniesTable companies={data.companies} />
    </div>
  );
}
