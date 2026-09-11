import { ArrowUpRight } from "lucide-react";

import { BarDatum, DonutSlice, Kpi } from "@/lib/admin-analytics";
import { cn } from "@/lib/utils";

export const CARD =
  "rounded-[12px] border-2 border-[rgba(31,31,31,0.1)] bg-white p-4";

export function Panel({
  eyebrow,
  title,
  action,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(CARD, "flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-dm-mono text-[12px] text-[#7e7e7e] uppercase">
            {eyebrow}
          </p>
          <h2 className="font-greed text-[16px] text-[#1f1f1f]">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function KpiCard({ label, value, delta, fit }: Kpi & { fit?: boolean }) {
  return (
    <div
      className={cn(
        CARD,
        "flex min-w-0 flex-col gap-2",
        fit ? "flex-auto" : "flex-1",
      )}
    >
      <p
        className={cn(
          "font-dm-mono text-[12px] text-[#7e7e7e] uppercase",
          fit ? "whitespace-nowrap" : "truncate",
        )}
      >
        {label}
      </p>
      <div className="flex items-baseline justify-between gap-3">
        <p
          className={cn(
            "font-dm-mono text-[22px] font-medium text-[#1f1f1f]",
            fit ? "whitespace-nowrap" : "truncate",
          )}
        >
          {value}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <ArrowUpRight className="size-3 text-[#6433cc]/40" />
          <span className="font-dm-mono text-[12px] font-medium text-[#6433cc]">
            {delta}
          </span>
        </div>
      </div>
    </div>
  );
}

/** `fit` sizes cards to their content instead of equal widths, for long text values. */
export function KpiRow({ items, fit }: { items: Kpi[]; fit?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {items.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} fit={fit} />
      ))}
    </div>
  );
}

export function BarList({
  items,
  labelClassName,
}: {
  items: BarDatum[];
  labelClassName?: string;
}) {
  const max = Math.max(...items.map((item) => item.value));

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-4">
            <p
              className={cn(
                "font-stolzl text-[14px] font-semibold text-[#1f1f1f]",
                labelClassName,
              )}
            >
              {item.label}
            </p>
            <p className="font-dm-mono shrink-0 text-[13px] text-[#7e7e7e]">
              {item.display}
            </p>
          </div>
          <div className="h-4 overflow-hidden rounded-[4px] border-[1.5px] border-[rgba(31,31,31,0.1)] bg-[#f6f4ef]">
            <div
              className="h-full"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Inline bar list used where the label and track share a row (AI latency buckets). */
export function InlineBarList({ items }: { items: BarDatum[] }) {
  const max = Math.max(...items.map((item) => item.value));

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <p className="font-dm-mono w-14 shrink-0 text-[13px] text-[#1f1f1f]">
            {item.label}
          </p>
          <div className="h-4 flex-1 overflow-hidden rounded-[4px] border-[1.5px] border-[rgba(31,31,31,0.1)] bg-[#f6f4ef]">
            <div
              className="h-full"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <p className="font-dm-mono w-8 shrink-0 text-right text-[13px] text-[#7e7e7e]">
            {item.display}
          </p>
        </div>
      ))}
    </div>
  );
}

export function StackedBar({ items }: { items: BarDatum[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex h-4 overflow-hidden rounded-[4px] border-[1.5px] border-[rgba(31,31,31,0.1)] bg-[#f6f4ef]">
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            width: `${(item.value / total) * 100}%`,
            backgroundColor: item.color,
          }}
        />
      ))}
    </div>
  );
}

export function Donut({
  slices,
  centerValue,
  centerLabel,
  size = 120,
}: {
  slices: DonutSlice[];
  centerValue: string;
  centerLabel: string;
  size?: number;
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const stroke = size * 0.2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {slices.map((slice) => {
          const length = (slice.value / total) * circumference;
          const dash = (
            <circle
              key={slice.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={stroke}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return dash;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <p className="font-dm-mono text-[18px] font-medium text-[#1f1f1f]">
          {centerValue}
        </p>
        <p className="font-dm-mono text-[10px] text-[#7e7e7e] uppercase">
          {centerLabel}
        </p>
      </div>
    </div>
  );
}

export function DonutLegend({
  slices,
  variant = "stacked",
}: {
  slices: DonutSlice[];
  variant?: "stacked" | "inline";
}) {
  return (
    <div
      className={cn("flex flex-col", variant === "stacked" ? "gap-4" : "gap-3")}
    >
      {slices.map((slice) => (
        <div key={slice.label} className="flex items-center gap-3">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: slice.color }}
          />
          {variant === "stacked" ? (
            <div className="flex flex-col gap-0.5">
              <p className="font-stolzl text-[14px] font-semibold text-[#1f1f1f]">
                {slice.label}
              </p>
              <p className="font-dm-mono text-[12px] text-[#7e7e7e]">
                {slice.display}
              </p>
            </div>
          ) : (
            <p className="font-stolzl text-[14px] text-[#1f1f1f]">
              {slice.label}: {slice.display}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function ChartLegend({
  items,
}: {
  items: { label: string; color: string; muted?: boolean }[];
}) {
  return (
    <div className="flex items-center gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span
            className={cn(
              "font-stolzl text-[13px]",
              item.muted ? "text-[#7e7e7e]" : "text-[#1f1f1f]",
            )}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
