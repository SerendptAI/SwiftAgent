export const BRAND = {
  purple: "#6433CC",
  orange: "#F25430",
  yellow: "#F2B035",
  blue: "#7F9FFF",
} as const;

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const DATE_RANGES = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "Last 12 Months",
] as const;

export type DateRange = (typeof DATE_RANGES)[number];

export const DAYS_BY_RANGE: Record<DateRange, number> = {
  "Last 7 Days": 7,
  "Last 30 Days": 30,
  "Last 90 Days": 90,
  "Last 12 Months": 365,
};

export const TABS = [
  "Executive Summary",
  "Resolution Performance",
  "AI Performance",
  "Customer Experience",
  "Business Impact",
  "Conversation Insights",
] as const;

export type TabId = (typeof TABS)[number];

export const ANALYTICS_SECTIONS = [
  "executive-summary",
  "resolution-performance",
  "ai-performance",
  "customer-experience",
  "business-impact",
  "conversation-insights",
] as const;

export type AnalyticsSection = (typeof ANALYTICS_SECTIONS)[number];

export const SECTION_BY_TAB: Record<TabId, AnalyticsSection> = {
  "Executive Summary": "executive-summary",
  "Resolution Performance": "resolution-performance",
  "AI Performance": "ai-performance",
  "Customer Experience": "customer-experience",
  "Business Impact": "business-impact",
  "Conversation Insights": "conversation-insights",
};

export interface Kpi {
  label: string;
  value: string;
  delta: string;
}

export interface BarDatum {
  label: string;
  value: number;
  display: string;
  color: string;
}

export interface DonutSlice {
  label: string;
  value: number;
  display: string;
  color: string;
}

export interface SeriesPoint {
  month: string;
  [series: string]: string | number;
}

export interface DonutView {
  centerValue: string;
  centerLabel: string;
  slices: DonutSlice[];
}

export interface ExecutiveSummaryView {
  northStar: {
    eyebrow: string;
    title: string;
    value: string;
    delta: string;
    caption: string;
  };
  kpis: Kpi[];
  arrTrend: SeriesPoint[];
  sparkline: SeriesPoint[];
  channels: BarDatum[];
  triage: DonutView;
  companies: {
    name: string;
    avatar: string;
    conversations: string;
    arr: string;
    csat: string;
  }[];
}

export interface ResolutionPerformanceView {
  kpis: Kpi[];
  trends: SeriesPoint[];
  weekly: {
    week: string;
    resolved: number;
    escalated: number;
    pending: number;
  }[];
  channelTimes: { channel: string; time: string; volume: string }[];
}

export interface AiPerformanceView {
  kpis: Kpi[];
  trends: SeriesPoint[];
  responseTimes: BarDatum[];
  confidence: DonutView;
}

export type FeedbackTone = "Positive" | "Neutral" | "Negative";

export interface CustomerExperienceView {
  kpis: Kpi[];
  trends: SeriesPoint[];
  sentiment: DonutView;
  themes: { label: string; mentions: string; tone: FeedbackTone }[];
}

export interface BusinessImpactView {
  kpis: Kpi[];
  trends: SeriesPoint[];
  departments: BarDatum[];
  roi: { totalReturn: string; investmentNote: string; breakdown: BarDatum[] };
}

export interface ConversationInsightsView {
  kpis: Kpi[];
  trends: SeriesPoint[];
  intents: BarDatum[];
  distribution: DonutView;
}

export interface AnalyticsViews {
  "executive-summary": ExecutiveSummaryView;
  "resolution-performance": ResolutionPerformanceView;
  "ai-performance": AiPerformanceView;
  "customer-experience": CustomerExperienceView;
  "business-impact": BusinessImpactView;
  "conversation-insights": ConversationInsightsView;
}
