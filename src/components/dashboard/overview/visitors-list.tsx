"use client";

import { useCallback, useMemo, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { Loader } from "@/components/loader";
import { useDashboardVisitors } from "@/hooks/use-dashboard";
import { DashboardVisitor } from "@/services/dashboard";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (!seconds) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function countryCodeToEmoji(code: string): string {
  const upper = code.toUpperCase();
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(
    upper.charCodeAt(0) + offset,
    upper.charCodeAt(1) + offset,
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  KE: "Kenya",
  GH: "Ghana",
  ZA: "South Africa",
  RW: "Rwanda",
  SN: "Senegal",
  PT: "Portugal",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  IN: "India",
  BR: "Brazil",
  AU: "Australia",
};

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code?.toUpperCase()] || code?.toUpperCase() || "Unknown";
}

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

// ── Shared Components ───────────────────────────────────────────────────────

function CountryFlag({ code }: { code: string }) {
  if (!code || code.length !== 2) {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-gray-100 text-[10px] font-bold text-gray-400">
        --
      </div>
    );
  }
  return (
    <span className="shrink-0 text-xl leading-none" title={code.toUpperCase()}>
      {countryCodeToEmoji(code)}
    </span>
  );
}

function VisitorRow({ visitor }: { visitor: DashboardVisitor }) {
  return (
    <tr className="group">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <CountryFlag code={visitor.country_code} />
          <span className="text-xs font-bold text-gray-900">
            {visitor.visitor_id.length > 8
              ? `${visitor.visitor_id.substring(0, 4)}...`
              : visitor.visitor_id}
          </span>
        </div>
      </td>
      <td className="py-3 text-xs font-bold text-gray-900">
        {formatDuration(visitor.duration_seconds)}
      </td>
      <td className="py-3 text-right text-xs font-bold text-gray-900">
        {formatDate(visitor.timestamp)}
      </td>
    </tr>
  );
}

function VisitorTableHead() {
  return (
    <thead>
      <tr className="border-b border-gray-100 text-xs text-gray-500">
        <th className="pb-3 font-normal">Visitor</th>
        <th className="pb-3 font-normal">Duration</th>
        <th className="pb-3 text-right font-normal">Time/Date</th>
      </tr>
    </thead>
  );
}

// ── Pie Chart Label ─────────────────────────────────────────────────────────

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
  const radius =
    (innerRadius as number) +
    ((outerRadius as number) - (innerRadius as number)) * 0.55;
  const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
  const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="pointer-events-none"
    >
      <tspan x={x} dy="-1.2em" fontSize={13} fontWeight={700} fill="white">
        {name}
      </tspan>
      <tspan x={x} dy="1.3em" fontSize={11} fill="rgba(255,255,255,0.85)">
        ~{(value as number).toLocaleString()}
      </tspan>
      <tspan x={x} dy="1.4em" fontSize={16}>
        {emoji}
      </tspan>
    </text>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────

function VisitorsModal({
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className="relative mx-4 flex max-h-[85vh] w-full max-w-[900px] flex-col overflow-hidden rounded-3xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <h2 className="text-2xl font-bold text-gray-900">Visitors</h2>
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
          <div className="flex shrink-0 items-center justify-center md:w-[380px]">
            {countryData.length > 0 ? (
              <PieChart width={360} height={360}>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={160}
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

          {/* Visitor Table */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs text-gray-500">
                  <th className="rounded-l-lg border border-r-0 border-gray-200 px-4 py-2 font-semibold tracking-wider uppercase">
                    Visitor
                  </th>
                  <th className="border-y border-gray-200 px-4 py-2 font-semibold tracking-wider uppercase">
                    Duration
                  </th>
                  <th className="rounded-r-lg border border-l-0 border-gray-200 px-4 py-2 text-right font-semibold tracking-wider uppercase">
                    Time/Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.map((visitor) => (
                  <VisitorRow key={visitor.id} visitor={visitor} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function VisitorsList({
  initialData,
}: {
  initialData?: DashboardVisitor[];
}) {
  const { data: visitors, isLoading } = useDashboardVisitors(20, initialData);
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <>
      <div className="flex max-h-[350px] flex-col rounded-3xl bg-white p-6 shadow-sm">
        {/* Header with SEE ALL */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Visitors</h3>
          {visitors && visitors.length > 0 && (
            <button
              onClick={openModal}
              className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs font-bold tracking-wider text-gray-900 uppercase transition-colors hover:bg-gray-50"
            >
              SEE ALL
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader />
            </div>
          ) : !visitors || visitors.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-gray-500">
              No visitors found.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <VisitorTableHead />
              <tbody className="divide-y divide-gray-100">
                {visitors.map((visitor) => (
                  <VisitorRow key={visitor.id} visitor={visitor} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && visitors && (
        <VisitorsModal visitors={visitors} onClose={closeModal} />
      )}
    </>
  );
}
