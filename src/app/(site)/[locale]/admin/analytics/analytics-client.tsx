"use client";

import { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

import {
  AnalyticsControls,
  AnalyticsNavbar,
  AnalyticsTabs,
} from "@/components/admin/analytics/analytics-shell";
import { CARD } from "@/components/admin/analytics/primitives";
import { AiPerformance } from "@/components/admin/analytics/tabs/ai-performance";
import { BusinessImpact } from "@/components/admin/analytics/tabs/business-impact";
import { ConversationInsights } from "@/components/admin/analytics/tabs/conversation-insights";
import { CustomerExperience } from "@/components/admin/analytics/tabs/customer-experience";
import { ExecutiveSummary } from "@/components/admin/analytics/tabs/executive-summary";
import { ResolutionPerformance } from "@/components/admin/analytics/tabs/resolution-performance";
import { useToast } from "@/components/ui/toast";
import { useAnalyticsSection } from "@/hooks/use-admin-analytics";
import {
  DateRange,
  DAYS_BY_RANGE,
  SECTION_BY_TAB,
  TabId,
} from "@/lib/admin-analytics";
import { cn } from "@/lib/utils";
import { adminAnalyticsApi } from "@/services/admin-analytics";

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function SectionSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="flex gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={cn(CARD, "h-[76px] flex-1")} />
        ))}
      </div>
      <div className={cn(CARD, "h-[236px]")} />
      <div className="grid grid-cols-2 gap-4">
        <div className={cn(CARD, "h-[220px]")} />
        <div className={cn(CARD, "h-[220px]")} />
      </div>
    </div>
  );
}

function SectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className={cn(CARD, "flex flex-col items-center gap-3 py-16 text-center")}
    >
      <h2 className="font-greed text-[18px] text-[#1f1f1f]">
        Analytics unavailable
      </h2>
      <p className="font-stolzl max-w-md text-[14px] text-[#7e7e7e]">
        The analytics service did not respond, so nothing is shown here rather
        than figures that might be out of date.
      </p>
      <button
        onClick={onRetry}
        className="font-dm-mono mt-1 rounded-[6px] border-2 border-[rgba(31,31,31,0.1)] bg-[#6433cc] px-4 py-2 text-[12px] text-white uppercase transition-opacity hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}

function SectionState<T>({
  query,
  children,
}: {
  query: UseQueryResult<T>;
  children: (data: T) => React.ReactNode;
}) {
  if (query.isPending) {
    return <SectionSkeleton />;
  }

  if (query.isError || query.data === undefined) {
    return <SectionError onRetry={() => query.refetch()} />;
  }

  return <>{children(query.data)}</>;
}

interface TabViewProps {
  range: DateRange;
}

/**
 * One wrapper per section so each query is typed by its literal section name
 * and hands its view component exactly the shape it expects.
 */
function ExecutiveSummaryTab({ range }: TabViewProps) {
  const query = useAnalyticsSection("executive-summary", range);

  return (
    <SectionState query={query}>
      {(data) => <ExecutiveSummary data={data} />}
    </SectionState>
  );
}

function ResolutionPerformanceTab({ range }: TabViewProps) {
  const query = useAnalyticsSection("resolution-performance", range);

  return (
    <SectionState query={query}>
      {(data) => <ResolutionPerformance data={data} />}
    </SectionState>
  );
}

function AiPerformanceTab({ range }: TabViewProps) {
  const query = useAnalyticsSection("ai-performance", range);

  return (
    <SectionState query={query}>
      {(data) => <AiPerformance data={data} />}
    </SectionState>
  );
}

function CustomerExperienceTab({ range }: TabViewProps) {
  const query = useAnalyticsSection("customer-experience", range);

  return (
    <SectionState query={query}>
      {(data) => <CustomerExperience data={data} />}
    </SectionState>
  );
}

function BusinessImpactTab({ range }: TabViewProps) {
  const query = useAnalyticsSection("business-impact", range);

  return (
    <SectionState query={query}>
      {(data) => <BusinessImpact data={data} />}
    </SectionState>
  );
}

function ConversationInsightsTab({ range }: TabViewProps) {
  const query = useAnalyticsSection("conversation-insights", range);

  return (
    <SectionState query={query}>
      {(data) => <ConversationInsights data={data} />}
    </SectionState>
  );
}

const VIEWS: Record<TabId, React.ComponentType<TabViewProps>> = {
  "Executive Summary": ExecutiveSummaryTab,
  "Resolution Performance": ResolutionPerformanceTab,
  "AI Performance": AiPerformanceTab,
  "Customer Experience": CustomerExperienceTab,
  "Business Impact": BusinessImpactTab,
  "Conversation Insights": ConversationInsightsTab,
};

export function AnalyticsClient() {
  const [tab, setTab] = useState<TabId>("Executive Summary");
  const [range, setRange] = useState<DateRange>("Last 30 Days");
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const View = VIEWS[tab];

  const handleExport = async () => {
    setExporting(true);

    try {
      const blob = await adminAnalyticsApi.exportSection(
        SECTION_BY_TAB[tab],
        DAYS_BY_RANGE[range],
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug(tab)}-${slug(range)}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${tab} for ${range.toLowerCase()}.`);
    } catch {
      toast.error(`Could not export ${tab}. Please try again.`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4ef]">
      <AnalyticsNavbar />
      <AnalyticsTabs active={tab} onChange={setTab} />
      <AnalyticsControls
        range={range}
        onRangeChange={setRange}
        onExport={handleExport}
        exporting={exporting}
      />
      <main className="px-10 pb-10">
        <View range={range} />
      </main>
    </div>
  );
}
