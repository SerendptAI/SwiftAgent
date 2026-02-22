"use client";
import { ArrowDown, ArrowUp, Info, TrendingDown } from "lucide-react";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
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
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col justify-between rounded-3xl bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-7 w-7", iconColor || "text-gray-500")} />
            <span className={cn("font-normal", iconColor || "text-gray-900")}>
              {title}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Info className="h-5 w-5" />
          </button>
        </div>

        <div className="my-8">
          {!action && (
            <p className="mb-1 text-sm font-medium text-gray-400">Today</p>
          )}

          <div className="flex items-end justify-between gap-3">
            <span className="text-5xl font-bold tracking-tight text-gray-900">
              {value}
            </span>
            {pending && (
              <span className="mb-2 text-lg font-medium text-gray-400">
                pending
              </span>
            )}

            {trend && !showTrendLine && !hideTrendIndicator && (
              <div className="mb-2 flex flex-col items-center justify-center">
                <TrendingDown className="text-[#F25430]" />
                <span className="font-semi-bold text-lg text-[#F25430]">
                  0.0%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Last 7 days trend footer - only for non-action cards with trends */}
      {trend && !action && (
        <div className="flex items-end justify-between">
          <div className="flex w-full items-center justify-between gap-4 text-sm font-medium">
            <span className="text-gray-900">Last 7 days</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-[#008751]">
                <ArrowUp className="h-4 w-4" /> 1
              </span>
              <span className="flex items-center text-[#F25430]">
                <ArrowDown className="h-4 w-4" /> 1
              </span>
            </div>
          </div>
        </div>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 w-full rounded-xl bg-[#6433CC] py-4 text-base font-bold text-white shadow-[-4px_4px_0px_0px_#000000] transition-transform hover:bg-[#d94526] active:translate-y-1 active:shadow-none"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function StatsCards() {
  return (
    <>
      {/* Visitors */}
      <StatCard
        title="VISITORS"
        icon={Icons.visitors}
        value="100"
        trend={{ value: 0.0, isUp: false }}
        iconColor="text-[#F25430]"
      />

      {/* Chats */}
      <StatCard
        title="CHATS"
        icon={Icons.chats}
        value="100"
        pending={true}
        action={{ label: "Respond", onClick: () => {} }}
        iconColor="text-[#6433CC]"
      />

      {/* Calls */}
      <StatCard
        title="CALLS"
        icon={Icons.calls}
        value="100"
        trend={{ value: 0.0, isUp: false }}
        iconColor="text-[#F2B035]"
      />

      {/* Documents */}
      <StatCard
        title="DOCUMENTS"
        icon={Icons.documents}
        value="3"
        trend={{ value: 0.0, isUp: true }}
        hideTrendIndicator
        iconColor="text-[#7F9FFF]"
      />

      {/* Scrapes */}
      <StatCard
        title="SCRAPES"
        icon={Icons.scrapes}
        value="100"
        trend={{ value: 0.0, isUp: false }}
        iconColor="text-[#F25430]"
      />
    </>
  );
}
