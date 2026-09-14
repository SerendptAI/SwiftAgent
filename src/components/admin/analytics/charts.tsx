"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SeriesPoint } from "@/lib/admin-analytics";

const AXIS_TICK = {
  fill: "#7e7e7e",
  fontSize: 12,
  fontFamily: "var(--font-jetbrains)",
};

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "2px solid rgba(31,31,31,0.1)",
  fontFamily: "var(--font-jetbrains)",
  fontSize: 12,
} as const;

const DEFAULT_AXIS = "default";

const AUTO_DOMAIN = ["dataMin - 2", "dataMax + 2"] as const;

/**
 * Series that share an axis id scale against each other. Give a series its own
 * id when it carries a different unit — hours next to dollars, NPS next to
 * CSAT — so neither flattens the other. Axes stay hidden either way, and
 * tooltips keep reporting the real values.
 */
const axisIdsOf = (series: { axis?: string }[]) => [
  ...new Set(series.map((item) => item.axis ?? DEFAULT_AXIS)),
];

export interface LineSeries {
  key: string;
  name: string;
  color: string;
  dashed?: boolean;
  dots?: boolean;
  dotColor?: string;
  axis?: string;
}

export function TrendLineChart({
  data,
  series,
  height = 180,
  domain,
}: {
  data: SeriesPoint[];
  series: LineSeries[];
  height?: number;
  domain?: [number, number];
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 24, bottom: 0, left: 12 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="rgba(31,31,31,0.06)"
            strokeWidth={1}
          />
          <XAxis
            dataKey="month"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            interval={0}
            dy={8}
          />
          {axisIdsOf(series).map((axisId) => (
            <YAxis
              key={axisId}
              yAxisId={axisId}
              hide
              domain={domain ?? AUTO_DOMAIN}
            />
          ))}
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ stroke: "rgba(31,31,31,0.2)" }}
          />
          {series.map((line) => (
            <Line
              key={line.key}
              yAxisId={line.axis ?? DEFAULT_AXIS}
              type="linear"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              strokeDasharray={line.dashed ? "4 4" : undefined}
              dot={
                line.dots
                  ? { r: 3, fill: line.dotColor ?? line.color, strokeWidth: 0 }
                  : false
              }
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GroupedBarChart({
  data,
  series,
  height = 180,
}: {
  data: SeriesPoint[];
  series: { key: string; name: string; color: string; axis?: string }[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 24, bottom: 0, left: 12 }}
        >
          <XAxis
            dataKey="month"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            interval={0}
            dy={8}
          />
          {axisIdsOf(series).map((axisId) => (
            <YAxis key={axisId} yAxisId={axisId} hide />
          ))}
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f6f4ef" }} />
          {series.map((bar) => (
            <Bar
              key={bar.key}
              yAxisId={bar.axis ?? DEFAULT_AXIS}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
              barSize={8}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StackedColumnChart({
  data,
  series,
  height = 150,
}: {
  data: Record<string, string | number>[];
  series: { key: string; name: string; color: string }[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 24, bottom: 0, left: 12 }}
        >
          <XAxis
            dataKey="week"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            interval={0}
            dy={8}
          />
          <YAxis hide />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f6f4ef" }} />
          {series.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              stackId="outcome"
              fill={bar.color}
              barSize={36}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Sparkline({
  data,
  color,
  width = 160,
  height = 40,
}: {
  data: SeriesPoint[];
  color: string;
  width?: number;
  height?: number;
}) {
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, right: 2, bottom: 4, left: 2 }}
        >
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Line
            type="linear"
            dataKey="arr"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
