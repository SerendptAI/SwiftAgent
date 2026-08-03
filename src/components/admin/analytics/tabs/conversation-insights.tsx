"use client";

import { TrendLineChart } from "@/components/admin/analytics/charts";
import {
  BarList,
  ChartLegend,
  Donut,
  DonutLegend,
  KpiRow,
  Panel,
} from "@/components/admin/analytics/primitives";
import { BRAND, ConversationInsightsView } from "@/lib/admin-analytics";

export function ConversationInsights({
  data,
}: {
  data: ConversationInsightsView;
}) {
  return (
    <div className="flex flex-col gap-4">
      <KpiRow items={data.kpis} fit />
      <Panel
        eyebrow="Traffic Volume Trends"
        title="Conversation Volumes Over Last 12 Months"
        action={
          <ChartLegend
            items={[
              { label: "Live Chat", color: BRAND.purple },
              { label: "Email", color: BRAND.orange },
              { label: "Ticketing & Forms", color: BRAND.blue },
            ]}
          />
        }
      >
        <TrendLineChart
          data={data.trends}
          series={[
            { key: "liveChat", name: "Live Chat", color: BRAND.purple },
            { key: "email", name: "Email", color: BRAND.orange },
            {
              key: "ticketing",
              name: "Ticketing & Forms",
              color: BRAND.blue,
            },
          ]}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-4">
        <Panel eyebrow="Semantic Mapping" title="Top 5 Customer Intents">
          <BarList items={data.intents} labelClassName="font-normal" />
        </Panel>
        <Panel eyebrow="Routing Analysis" title="Channel Distribution">
          <div className="flex flex-1 items-center justify-center gap-8">
            <Donut
              slices={data.distribution.slices}
              centerValue={data.distribution.centerValue}
              centerLabel={data.distribution.centerLabel}
            />
            <div className="flex-1">
              <DonutLegend slices={data.distribution.slices} variant="inline" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
