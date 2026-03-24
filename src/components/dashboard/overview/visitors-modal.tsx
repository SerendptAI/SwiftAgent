"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { CountryFlag } from "@/components/ui/country-flag";
import { countryCodeToEmoji, getCountryName } from "@/lib/country";
import { formatDate, formatDuration } from "@/lib/format";
import { DashboardVisitor } from "@/services/dashboard";

const PIE_COLORS = [
  "#6433CC",
  "#F3B03D",
  "#F25430",
  "#2196F3",
  "#B0C4DE",
  "#008751",
  "#E91E63",
  "#9C27B0",
];

function renderPieLabel(props: Record<string, unknown>) {
  const { cx, cy, midAngle, innerRadius, outerRadius, name, value, emoji } =
    props as {
      cx: number;
      cy: number;
      midAngle: number;
      innerRadius: number;
      outerRadius: number;
      name: string;
      value: number;
      emoji: string;
    };

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="pointer-events-none"
    >
      <tspan
        x={x}
        dy="-1.2em"
        fontSize={13}
        fontWeight={700}
        fill="white"
        style={{ fontFamily: "var(--font-greed-narrow)" }}
      >
        {name}
      </tspan>
      <tspan
        x={x}
        dy="1.3em"
        fontSize={11}
        fill="rgba(255,255,255,0.85)"
        style={{ fontFamily: "var(--font-dm-mono)" }}
      >
        ~{value.toLocaleString()}
      </tspan>
      <tspan x={x} dy="1.4em" fontSize={22}>
        {emoji}
      </tspan>
    </text>
  );
}

export function VisitorsModal({
  visitors,
  onClose,
}: {
  visitors: DashboardVisitor[];
  onClose: () => void;
}) {
  const countryData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of visitors) {
      const code = v.country_code || "??";
      counts.set(code, (counts.get(code) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([code, count]) => ({
        code,
        name: getCountryName(code),
        value: count,
        emoji: code.length === 2 ? countryCodeToEmoji(code) : "🏳️",
      }))
      .sort((a, b) => b.value - a.value);
  }, [visitors]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className="relative mx-4 flex max-h-[85vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-3xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="m-4 flex items-center justify-between rounded-md bg-[#F3F3F3] px-6 py-3">
          <h2 className="font-greed-narrow text-3xl font-bold text-gray-900">
            Visitors
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-8 md:flex-row">
          {/* Pie Chart */}
          <div className="flex shrink-0 items-center justify-center md:w-[440px]">
            {countryData.length > 0 ? (
              <PieChart width={420} height={420}>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={190}
                  dataKey="value"
                  label={renderPieLabel as unknown as boolean}
                  labelLine={false}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {countryData.map((entry, i) => (
                    <Cell
                      key={entry.code}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <div className="text-sm text-gray-400">No country data</div>
            )}
          </div>

          {/* Visitor List */}
          <div className="min-h-0 flex-1">
            {/* Header pills */}
            <div className="font-dm-mono sticky top-0 flex justify-between gap-2 bg-white pb-3">
              <span className="flex-1 rounded-xl border border-gray-200 px-6 py-2 text-center text-sm tracking-wider text-gray-400 uppercase">
                Visitor
              </span>
              <span className="flex-1 rounded-xl border border-gray-200 px-6 py-2 text-center text-sm tracking-wider text-gray-400 uppercase">
                Duration
              </span>
              <span className="flex-1 rounded-xl border border-gray-200 px-6 py-2 text-center text-sm tracking-wider text-gray-400 uppercase">
                Time/Date
              </span>
            </div>

            {/* Rows */}
            <div className="flex max-h-[340px] flex-col gap-2 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-900 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-200">
              {visitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center rounded-2xl border border-gray-200 px-3 py-2"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <CountryFlag code={visitor.country_code} />
                    <span className="text-sm font-bold text-gray-900">
                      {visitor.visitor_id.length > 8
                        ? `${visitor.visitor_id.substring(0, 4)}...`
                        : visitor.visitor_id}
                    </span>
                  </div>
                  <span className="flex-1 text-sm font-bold text-gray-900">
                    {formatDuration(visitor.duration_seconds)}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatDate(visitor.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
