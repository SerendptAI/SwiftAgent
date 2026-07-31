"use client";

import { useState } from "react";

import {
  AnalyticsControls,
  AnalyticsNavbar,
  AnalyticsTabs,
} from "@/components/admin/analytics/analytics-shell";
import { AiPerformance } from "@/components/admin/analytics/tabs/ai-performance";
import { BusinessImpact } from "@/components/admin/analytics/tabs/business-impact";
import { ConversationInsights } from "@/components/admin/analytics/tabs/conversation-insights";
import { CustomerExperience } from "@/components/admin/analytics/tabs/customer-experience";
import { ExecutiveSummary } from "@/components/admin/analytics/tabs/executive-summary";
import { ResolutionPerformance } from "@/components/admin/analytics/tabs/resolution-performance";
import { useToast } from "@/components/ui/toast";
import { DateRange, KPIS_BY_TAB, TabId } from "@/lib/admin-analytics";

const VIEWS: Record<TabId, React.ComponentType> = {
  "Executive Summary": ExecutiveSummary,
  "Resolution Performance": ResolutionPerformance,
  "AI Performance": AiPerformance,
  "Customer Experience": CustomerExperience,
  "Business Impact": BusinessImpact,
  "Conversation Insights": ConversationInsights,
};

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function downloadCsv(tab: TabId, range: DateRange) {
  const rows = [
    ["Metric", "Value", "Change"],
    ...KPIS_BY_TAB[tab].map((kpi) => [kpi.label, kpi.value, kpi.delta]),
  ];
  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(tab)}-${slug(range)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function AnalyticsClient() {
  const [tab, setTab] = useState<TabId>("Executive Summary");
  const [range, setRange] = useState<DateRange>("Last 30 Days");
  const toast = useToast();

  const View = VIEWS[tab];

  const handleExport = () => {
    downloadCsv(tab, range);
    toast.success(`Exported ${tab} for ${range.toLowerCase()}.`);
  };

  return (
    <div className="min-h-screen bg-[#f6f4ef]">
      <AnalyticsNavbar />
      <AnalyticsTabs active={tab} onChange={setTab} />
      <AnalyticsControls
        range={range}
        onRangeChange={setRange}
        onExport={handleExport}
      />
      <main className="px-10 pb-10">
        <View />
      </main>
    </div>
  );
}
