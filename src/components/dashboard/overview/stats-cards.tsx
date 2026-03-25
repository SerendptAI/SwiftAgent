"use client";
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

import { Icons } from "@/components/icons";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/services/dashboard";

interface StatCardProps {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string | number;
  trend?: {
    value: number;
    last7DaysUp: number;
    last7DaysDown: number;
  };
  pending?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  iconColor?: string;
  showTrendLine?: boolean;
  hideTrendIndicator?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

function StatCard({
  title,
  icon: Icon,
  value,
  trend,
  pending,
  action,
  className,
  iconColor,
  showTrendLine,
  hideTrendIndicator,
  isLoading,
  tooltip,
}: StatCardProps) {
  const percentChange = trend?.value || 0;
  const isUp = percentChange >= 0;

  return (
    <div
      className={cn(
        "flex min-h-[250px] flex-col justify-between rounded-3xl bg-white p-6",
        className,
      )}
    >
      <div className="flex h-3/4 flex-col justify-between">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-7 w-7", iconColor || "text-gray-500")} />
            <span
              className={cn(
                "font-dm-mono font-normal",
                iconColor || "text-gray-900",
              )}
            >
              {title}
            </span>
          </div>
          <InfoTooltip
            text={tooltip || `View ${title.toLowerCase()} details`}
            className="h-5 w-5"
          />
        </div>

        <div>
          {!action && (
            <p className="font-dm-mono mb-1 text-sm font-normal text-gray-400">
              Today
            </p>
          )}

          <div className="flex items-end justify-between gap-3">
            <span className="font-greed-narrow font-condensed text-5xl font-medium tracking-tight text-gray-900">
              {isLoading ? "-" : value}
            </span>
            {pending && (
              <span className="font-stolzl mb-2 text-lg font-medium text-gray-400">
                pending
              </span>
            )}

            {trend && !showTrendLine && !hideTrendIndicator && !isLoading && (
              <div className="mb-2 flex flex-col items-center justify-center">
                {isUp ? (
                  <TrendingUp className="text-[#008751]" />
                ) : (
                  <TrendingDown className="text-[#F25430]" />
                )}
                <span
                  className={cn(
                    "font-greed-narrow font-semi-bold text-lg",
                    isUp ? "text-[#008751]" : "text-[#F25430]",
                  )}
                >
                  {Math.abs(percentChange).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Last 7 days trend footer - only for non-action cards with trends */}
      {trend && !action && !isLoading && (
        <div className="font-stolzl flex items-end justify-between">
          <div className="flex w-full items-center justify-between gap-4 text-sm font-medium">
            <span className="text-gray-900">Last 7 days</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-[#008751]">
                <ArrowUp className="h-4 w-4" /> {trend.last7DaysUp}
              </span>
              <span className="flex items-center text-[#F25430]">
                <ArrowDown className="h-4 w-4" /> {trend.last7DaysDown}
              </span>
            </div>
          </div>
        </div>
      )}

      {action && (
        <button
          onClick={action.onClick}
          disabled={isLoading}
          className="font-dm-mono w-full rounded-md bg-[#6433CC] py-1 text-base font-bold text-white shadow-[-4px_4px_0px_0px_#000000] transition-transform hover:bg-[#d94526] active:translate-y-1 active:shadow-none disabled:opacity-50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function StatsCards({
  initialData,
}: {
  initialData?: DashboardStats | null;
}) {
  const router = useRouter();
  const { data: stats, isLoading } = useDashboardStats(initialData);

  return (
    <>
      <StatCard
        title="VISITORS"
        icon={Icons.visitors}
        value={stats?.visitors.today || 0}
        trend={{
          value: stats?.visitors.percent_change || 0,
          last7DaysUp: stats?.visitors.last_7_days_up || 0,
          last7DaysDown: stats?.visitors.last_7_days_down || 0,
        }}
        iconColor="text-[#F25430]"
        tooltip="Total unique visitors to your site today"
        isLoading={isLoading}
      />

      <StatCard
        title="CHATS"
        icon={Icons.chats}
        value={stats?.chats.pending || 0}
        pending={true}
        action={{
          label: "Respond",
          onClick: () => router.push("/dashboard/ticketing"),
        }}
        iconColor="text-[#6433CC]"
        tooltip="Pending chat conversations awaiting response"
        isLoading={isLoading}
      />

      <StatCard
        title="CALLS"
        icon={Icons.calls}
        value={stats?.calls.today || 0}
        trend={{
          value: stats?.calls.percent_change || 0,
          last7DaysUp: stats?.calls.last_7_days_up || 0,
          last7DaysDown: stats?.calls.last_7_days_down || 0,
        }}
        iconColor="text-[#F2B035]"
        tooltip="Total voice calls received today"
        isLoading={isLoading}
      />

      <StatCard
        title="DOCUMENTS"
        icon={Icons.documents}
        value={stats?.documents.today || 0}
        trend={{
          value: stats?.documents.percent_change || 0,
          last7DaysUp: stats?.documents.last_7_days_up || 0,
          last7DaysDown: stats?.documents.last_7_days_down || 0,
        }}
        hideTrendIndicator
        iconColor="text-[#7F9FFF]"
        tooltip="Documents uploaded to your knowledge base"
        isLoading={isLoading}
      />

      <StatCard
        title="SCRAPES"
        icon={Icons.scrapes}
        value={stats?.scrapes.today || 0}
        trend={{
          value: stats?.scrapes.percent_change || 0,
          last7DaysUp: stats?.scrapes.last_7_days_up || 0,
          last7DaysDown: stats?.scrapes.last_7_days_down || 0,
        }}
        iconColor="text-[#F25430]"
        tooltip="Web pages scraped for your knowledge base"
        isLoading={isLoading}
      />
    </>
  );
}
