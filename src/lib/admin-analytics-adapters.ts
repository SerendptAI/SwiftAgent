import {
  AiPerformanceView,
  AnalyticsSection,
  AnalyticsViews,
  BRAND,
  BusinessImpactView,
  ConversationInsightsView,
  CustomerExperienceView,
  ExecutiveSummaryView,
  FeedbackTone,
  ResolutionPerformanceView,
} from "@/lib/admin-analytics";
import {
  AiPerformancePayload,
  AnalyticsPayloads,
  BusinessImpactPayload,
  ConversationInsightsPayload,
  CustomerExperiencePayload,
  ExecutiveSummaryPayload,
  ResolutionPerformancePayload,
} from "@/services/admin-analytics";

const NUMBER = new Intl.NumberFormat("en-US");

const round = (value: number, digits = 1) => Number(value.toFixed(digits));

/** KPI deltas render as a signed change, matching the design's "+12%" chips. */
const signed = (change: number, unit = "%") =>
  `${change > 0 ? "+" : ""}${round(change)}${unit}`;

const CHANNEL_COLORS = [
  BRAND.purple,
  BRAND.orange,
  BRAND.blue,
  BRAND.yellow,
] as const;

/** Latency reads worse as it grows, so the buckets warm up left to right. */
const LATENCY_COLORS = [
  BRAND.purple,
  BRAND.purple,
  BRAND.yellow,
  BRAND.orange,
  BRAND.orange,
] as const;

const AVATARS = [
  "/images/affiliate/avatar-brown.png",
  "/images/affiliate/avatar-orange.png",
  "/images/affiliate/avatar-yellow.png",
] as const;

const cycle = (values: readonly string[], index: number) =>
  values[index % values.length];

const clamp = (values: readonly string[], index: number) =>
  values[Math.min(index, values.length - 1)];

/** "LAST 30 DAYS" -> "Last 30 days", so it reads as prose in captions. */
const sentenceCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const TONES: Record<string, FeedbackTone> = {
  POSITIVE: "Positive",
  NEUTRAL: "Neutral",
  NEGATIVE: "Negative",
};

const toTone = (sentiment: string): FeedbackTone =>
  TONES[sentiment?.toUpperCase()] ?? "Neutral";

function toExecutiveSummary(
  payload: ExecutiveSummaryPayload,
): ExecutiveSummaryView {
  const { north_star: northStar, kpis, triage_split: triage } = payload;

  return {
    northStar: {
      eyebrow: "North Star Metric",
      title: "Autonomous Resolution Rate (ARR)",
      value: `${round(northStar.current_arr)}%`,
      delta: signed(northStar.arr_change),
      caption: `${sentenceCase(payload.time_range)} resolution velocity`,
    },
    kpis: [
      {
        label: "Total Conversations",
        value: kpis.total_conversations.formatted,
        delta: signed(kpis.total_conversations.change),
      },
      {
        label: "Human Hours Saved",
        value: kpis.human_hours_saved.formatted,
        delta: signed(kpis.human_hours_saved.change),
      },
      {
        label: "Est. Cost Savings",
        value: kpis.est_cost_savings.formatted,
        delta: signed(kpis.est_cost_savings.change),
      },
      {
        label: "CSAT Score",
        value: kpis.csat_score.formatted,
        delta: signed(kpis.csat_score.change),
      },
      {
        label: "Active Companies",
        value: kpis.active_companies.formatted,
        delta: signed(kpis.active_companies.change),
      },
    ],
    arrTrend: payload.historical_arr_12m.map((point) => ({
      month: point.month,
      arr: point.arr,
      target: point.target_goal,
    })),
    sparkline: payload.north_star.velocity_30d.map((point) => ({
      month: point.date,
      arr: point.rate,
    })),
    channels: payload.resolution_by_channel.map((channel, index) => ({
      label: channel.channel,
      value: channel.resolved_count,
      display: `${NUMBER.format(channel.resolved_count)} Resolved`,
      color: cycle(CHANNEL_COLORS, index),
    })),
    triage: {
      centerValue: `${Math.round(triage.autonomous_ai_percentage)}%`,
      centerLabel: "AI ARR",
      slices: [
        {
          label: "Autonomous (AI)",
          value: triage.autonomous_ai_percentage,
          display: `${round(triage.autonomous_ai_percentage)}% (${NUMBER.format(
            triage.autonomous_ai_count,
          )})`,
          color: BRAND.purple,
        },
        {
          label: "Escalated (Human)",
          value: triage.escalated_human_percentage,
          display: `${round(
            triage.escalated_human_percentage,
          )}% (${NUMBER.format(triage.escalated_human_count)})`,
          color: BRAND.orange,
        },
      ],
    },
    companies: payload.top_companies.map((company, index) => ({
      name: company.company_name,
      avatar: company.logo_url ?? cycle(AVATARS, index),
      conversations: NUMBER.format(company.conversations),
      arr: `${round(company.arr)}%`,
      csat: `${round(company.csat_score)}/${round(company.csat_max)}`,
    })),
  };
}

function toResolutionPerformance(
  payload: ResolutionPerformancePayload,
): ResolutionPerformanceView {
  const { kpis } = payload;

  return {
    kpis: [
      {
        label: "ARR Trend",
        value: kpis.arr_trend.formatted,
        delta: signed(kpis.arr_trend.change),
      },
      {
        label: "Escalation Rate",
        value: kpis.escalation_rate.formatted,
        delta: signed(kpis.escalation_rate.change),
      },
      {
        label: "First Contact Resolution",
        value: kpis.first_contact_resolution.formatted,
        delta: signed(kpis.first_contact_resolution.change),
      },
      {
        label: "Avg Resolution Time",
        value: kpis.avg_resolution_time.formatted,
        delta: signed(kpis.avg_resolution_time.change),
      },
      {
        label: "Repeat Contact Rate",
        value: kpis.repeat_contact_rate.formatted,
        delta: signed(kpis.repeat_contact_rate.change),
      },
    ],
    trends: payload.historical_trends.map((point) => ({
      month: point.month,
      arr: point.arr,
      escalation: point.escalation_rate,
    })),
    weekly: payload.weekly_breakdown.map((week) => ({
      week: week.week,
      resolved: week.ai_resolved_percentage,
      escalated: week.escalated_percentage,
      pending: week.pending_percentage,
    })),
    channelTimes: payload.channel_metrics.map((channel) => ({
      channel: channel.channel,
      time: channel.avg_time_formatted,
      volume: channel.volume_formatted,
    })),
  };
}

function toAiPerformance(payload: AiPerformancePayload): AiPerformanceView {
  const { kpis, confidence_distribution: confidence } = payload;

  return {
    kpis: [
      {
        label: "AI Accuracy",
        value: kpis.ai_accuracy.formatted,
        delta: signed(kpis.ai_accuracy.change),
      },
      {
        label: "Confidence Score",
        value: kpis.confidence_score.formatted,
        delta: signed(kpis.confidence_score.change, ""),
      },
      {
        label: "Avg Response Time",
        value: kpis.avg_response_time.formatted,
        delta: signed(kpis.avg_response_time.change, "s"),
      },
      {
        label: "Hallucination Rate",
        value: kpis.hallucination_rate.formatted,
        delta: signed(kpis.hallucination_rate.change),
      },
      {
        label: "Low Confidence Responses",
        value: kpis.low_confidence_responses.formatted,
        delta: signed(kpis.low_confidence_responses.change),
      },
    ],
    trends: payload.accuracy_trends.map((point) => ({
      month: point.month,
      accuracy: point.accuracy,
      confidence: point.confidence_score,
    })),
    responseTimes: payload.latency_distribution.map((bucket, index) => ({
      label: bucket.bucket,
      value: bucket.percentage,
      display: `${round(bucket.percentage, 0)}%`,
      color: clamp(LATENCY_COLORS, index),
    })),
    confidence: {
      centerValue: `${Math.round(confidence.avg_confidence)}%`,
      centerLabel: "Confidence",
      slices: [
        {
          label: "High (>90%)",
          value: confidence.high_percentage,
          display: `${round(confidence.high_percentage)}%`,
          color: BRAND.purple,
        },
        {
          label: "Medium (70-90%)",
          value: confidence.medium_percentage,
          display: `${round(confidence.medium_percentage)}%`,
          color: BRAND.yellow,
        },
        {
          label: "Low (<70%)",
          value: confidence.low_percentage,
          display: `${round(confidence.low_percentage)}%`,
          color: BRAND.orange,
        },
      ],
    },
  };
}

function toCustomerExperience(
  payload: CustomerExperiencePayload,
): CustomerExperienceView {
  const { kpis, sentiment_breakdown: sentiment } = payload;

  return {
    kpis: [
      {
        label: "CSAT Score",
        value: kpis.csat_score.formatted,
        delta: signed(kpis.csat_score.change, ""),
      },
      {
        label: "Positive Sentiment",
        value: kpis.positive_sentiment.formatted,
        delta: signed(kpis.positive_sentiment.change),
      },
      {
        label: "Net Promoter Score (NPS)",
        value: kpis.nps_score.formatted,
        delta: signed(kpis.nps_score.change, ""),
      },
      {
        label: "CES Score",
        value: kpis.ces_score.formatted,
        delta: signed(kpis.ces_score.change, ""),
      },
      {
        label: "Feedback Volume",
        value: kpis.feedback_volume.formatted,
        delta: signed(kpis.feedback_volume.change),
      },
    ],
    trends: payload.csat_nps_trends.map((point) => ({
      month: point.month,
      csat: point.csat_score,
      nps: point.nps_score,
    })),
    sentiment: {
      centerValue: `${Math.round(sentiment.positive_percentage)}%`,
      centerLabel: "Positive",
      slices: [
        {
          label: "Positive",
          value: sentiment.positive_percentage,
          display: `${round(sentiment.positive_percentage)}%`,
          color: BRAND.purple,
        },
        {
          label: "Neutral",
          value: sentiment.neutral_percentage,
          display: `${round(sentiment.neutral_percentage)}%`,
          color: BRAND.yellow,
        },
        {
          label: "Negative",
          value: sentiment.negative_percentage,
          display: `${round(sentiment.negative_percentage)}%`,
          color: BRAND.orange,
        },
      ],
    },
    themes: payload.top_feedback_themes.map((theme) => ({
      label: theme.theme,
      mentions: theme.mentions_formatted,
      tone: toTone(theme.sentiment),
    })),
  };
}

function toBusinessImpact(payload: BusinessImpactPayload): BusinessImpactView {
  const { kpis, roi_summary: roi } = payload;

  return {
    kpis: [
      {
        label: "Human Hours Saved",
        value: kpis.human_hours_saved.formatted,
        delta: signed(kpis.human_hours_saved.change),
      },
      {
        label: "Estimated Cost Saved",
        value: kpis.estimated_cost_saved.formatted,
        delta: signed(kpis.estimated_cost_saved.change),
      },
      {
        label: "ROI Metric",
        value: kpis.roi_metric.formatted,
        delta: signed(kpis.roi_metric.change),
      },
      {
        label: "FTE Equivalent Saved",
        value: kpis.fte_equivalent_saved.formatted,
        delta: signed(kpis.fte_equivalent_saved.change, ""),
      },
      {
        label: "SLA Compliance",
        value: kpis.sla_compliance.formatted,
        delta: signed(kpis.sla_compliance.change),
      },
    ],
    trends: payload.savings_timeline.map((point) => ({
      month: point.month,
      cost: point.cost_saved_k,
      hours: point.hours_saved,
    })),
    departments: payload.department_savings.map((department, index) => ({
      label: department.department,
      value: department.saved_amount,
      display: department.saved_formatted,
      color: cycle(CHANNEL_COLORS, index),
    })),
    roi: {
      totalReturn: roi.total_return_formatted,
      investmentNote: roi.initial_investment_formatted,
      breakdown: [
        {
          label: "Net Savings",
          value: roi.net_savings,
          display: roi.net_savings_formatted,
          color: BRAND.purple,
        },
        {
          label: "SaaS Platform License",
          value: roi.saas_platform_license,
          display: roi.saas_platform_license_formatted,
          color: BRAND.orange,
        },
        {
          label: "Ops & Maintenance",
          value: roi.ops_and_maintenance,
          display: roi.ops_and_maintenance_formatted,
          color: BRAND.yellow,
        },
      ],
    },
  };
}

function toConversationInsights(
  payload: ConversationInsightsPayload,
): ConversationInsightsView {
  const { kpis, channel_distribution: distribution } = payload;

  return {
    kpis: [
      {
        label: "Total Volume",
        value: kpis.total_volume.formatted,
        delta: signed(kpis.total_volume.change),
      },
      {
        label: "Top Intent",
        value: kpis.top_intent.formatted,
        // A flat share is the design's "Steady" chip rather than "0%".
        delta: kpis.top_intent.change
          ? signed(kpis.top_intent.change)
          : "Steady",
      },
      {
        label: "Busiest Channel",
        value: kpis.busiest_channel.formatted,
        delta: signed(kpis.busiest_channel.change),
      },
      {
        label: "KB Usage Rate",
        value: kpis.kb_usage_rate.formatted,
        delta: signed(kpis.kb_usage_rate.change),
      },
      {
        label: "System Uptime",
        // Uptime reports an absolute availability figure, not a delta.
        value: kpis.system_uptime.formatted,
        delta: `${round(kpis.system_uptime.change)}%`,
      },
    ],
    trends: payload.traffic_trends.map((point) => ({
      month: point.month,
      liveChat: point.live_chat_volume,
      email: point.email_volume,
      ticketing: point.ticketing_volume,
    })),
    intents: payload.top_intents.map((intent, index) => ({
      label: `${intent.rank}. ${intent.intent_name}`,
      value: intent.volume,
      display: intent.formatted_label,
      color: cycle(CHANNEL_COLORS, index),
    })),
    distribution: {
      centerValue: `${Math.round(distribution.busiest_channel_percentage)}%`,
      centerLabel: distribution.busiest_channel_name,
      slices: [
        {
          label: "Live Chat",
          value: distribution.live_chat_percentage,
          display: `${round(distribution.live_chat_percentage)}%`,
          color: BRAND.purple,
        },
        {
          label: "Email Support",
          value: distribution.email_support_percentage,
          display: `${round(distribution.email_support_percentage)}%`,
          color: BRAND.orange,
        },
        {
          label: "Ticketing / API",
          value: distribution.ticketing_api_percentage,
          display: `${round(distribution.ticketing_api_percentage)}%`,
          color: BRAND.blue,
        },
      ],
    },
  };
}

type AnalyticsAdapters = {
  [S in AnalyticsSection]: (payload: AnalyticsPayloads[S]) => AnalyticsViews[S];
};

const ADAPTERS: AnalyticsAdapters = {
  "executive-summary": toExecutiveSummary,
  "resolution-performance": toResolutionPerformance,
  "ai-performance": toAiPerformance,
  "customer-experience": toCustomerExperience,
  "business-impact": toBusinessImpact,
  "conversation-insights": toConversationInsights,
};

export function toAnalyticsView<S extends AnalyticsSection>(
  section: S,
  payload: AnalyticsPayloads[S],
): AnalyticsViews[S] {
  return ADAPTERS[section](payload);
}
