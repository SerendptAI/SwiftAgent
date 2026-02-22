"use client";

import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";

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
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-7 w-7", iconColor || "text-gray-500")} />
            <span className={cn("font-bold", iconColor || "text-gray-900")}>
              {title}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Info className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-2">
          {!action && (
            <p className="mb-1 text-sm font-medium text-gray-400">Today</p>
          )}

          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold tracking-tight text-gray-900">
              {value}
            </span>
            {pending && (
              <span className="mb-2 text-lg font-medium text-gray-400">
                pending
              </span>
            )}

            {showTrendLine && (
              <div className="mb-2">
                <svg
                  width="40"
                  height="20"
                  viewBox="0 0 40 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L10 10L20 5L30 15L39 5"
                    stroke="#F25430"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {trend && !showTrendLine && (
              <div className="mb-2 flex flex-col items-end">
                {/* Trend percentage next to value if no sparkle? No, design shows it typically to the right or below */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Last 7 days trend footer - only for non-action cards with trends */}
      {trend && !action && (
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-gray-900">Last 7 days</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center font-bold text-[#008751]">
                <ArrowUpRight className="h-3 w-3" /> 1
              </span>
              <span className="flex items-center font-bold text-[#F25430]">
                <ArrowDownRight className="h-3 w-3" /> 1
              </span>
            </div>
          </div>

          <div className="-mt-8 flex flex-col items-end">
            <svg
              width="24"
              height="16"
              viewBox="0 0 24 16"
              fill="none"
              className="mb-1"
            >
              <path
                d="M2 2L8 10L14 4L22 12"
                stroke="#F25430"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-bold text-[#F25430]">0.0%</span>
          </div>
        </div>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 w-full rounded-xl bg-[#F25430] py-4 text-base font-bold text-white shadow-[-4px_4px_0px_0px_#000000] transition-transform hover:bg-[#d94526] active:translate-y-1 active:shadow-none"
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
