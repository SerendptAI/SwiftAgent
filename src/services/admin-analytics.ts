import { AnalyticsSection } from "@/lib/admin-analytics";
import { localApiClient } from "@/lib/local-api-client";

/** Every KPI card on every section arrives in this shape. */
export interface MetricValue {
  value: number;
  change: number;
  formatted: string;
  max_value?: number | null;
}

interface SectionWindow {
  time_range: string;
  start_date: string;
  end_date: string;
}

export interface ExecutiveSummaryPayload extends SectionWindow {
  north_star: {
    current_arr: number;
    arr_change: number;
    velocity_30d: { date: string; rate: number }[];
  };
  kpis: {
    total_conversations: MetricValue;
    human_hours_saved: MetricValue;
    est_cost_savings: MetricValue;
    csat_score: MetricValue;
    active_companies: MetricValue;
  };
  historical_arr_12m: { month: string; arr: number; target_goal: number }[];
  resolution_by_channel: {
    channel: string;
    resolved_count: number;
    percentage: number;
  }[];
  triage_split: {
    autonomous_ai_count: number;
    autonomous_ai_percentage: number;
    escalated_human_count: number;
    escalated_human_percentage: number;
    total_resolved: number;
  };
  top_companies: {
    company_id: string;
    company_name: string;
    logo_url: string | null;
    conversations: number;
    arr: number;
    csat_score: number;
    csat_max: number;
  }[];
}

export interface ResolutionPerformancePayload extends SectionWindow {
  kpis: {
    arr_trend: MetricValue;
    escalation_rate: MetricValue;
    first_contact_resolution: MetricValue;
    avg_resolution_time: MetricValue;
    repeat_contact_rate: MetricValue;
  };
  historical_trends: { month: string; arr: number; escalation_rate: number }[];
  weekly_breakdown: {
    week: string;
    ai_resolved: number;
    escalated: number;
    pending: number;
    ai_resolved_percentage: number;
    escalated_percentage: number;
    pending_percentage: number;
  }[];
  channel_metrics: {
    channel: string;
    avg_time_minutes: number;
    avg_time_formatted: string;
    volume: number;
    volume_formatted: string;
  }[];
}

export interface AiPerformancePayload extends SectionWindow {
  kpis: {
    ai_accuracy: MetricValue;
    confidence_score: MetricValue;
    avg_response_time: MetricValue;
    hallucination_rate: MetricValue;
    low_confidence_responses: MetricValue;
  };
  accuracy_trends: {
    month: string;
    accuracy: number;
    confidence_score: number;
  }[];
  latency_distribution: {
    bucket: string;
    percentage: number;
    count: number;
  }[];
  confidence_distribution: {
    high_count: number;
    high_percentage: number;
    medium_count: number;
    medium_percentage: number;
    low_count: number;
    low_percentage: number;
    total_responses: number;
    avg_confidence: number;
  };
}

export interface CustomerExperiencePayload extends SectionWindow {
  kpis: {
    csat_score: MetricValue;
    positive_sentiment: MetricValue;
    nps_score: MetricValue;
    ces_score: MetricValue;
    feedback_volume: MetricValue;
  };
  csat_nps_trends: {
    month: string;
    csat_score: number;
    nps_score: number;
  }[];
  sentiment_breakdown: {
    positive_count: number;
    positive_percentage: number;
    neutral_count: number;
    neutral_percentage: number;
    negative_count: number;
    negative_percentage: number;
    total_feedback_count: number;
  };
  top_feedback_themes: {
    theme: string;
    mentions_count: number;
    mentions_formatted: string;
    sentiment: string;
  }[];
}

export interface BusinessImpactPayload extends SectionWindow {
  kpis: {
    human_hours_saved: MetricValue;
    estimated_cost_saved: MetricValue;
    roi_metric: MetricValue;
    fte_equivalent_saved: MetricValue;
    sla_compliance: MetricValue;
  };
  savings_timeline: {
    month: string;
    cost_saved: number;
    cost_saved_k: number;
    hours_saved: number;
  }[];
  department_savings: {
    department: string;
    saved_amount: number;
    saved_formatted: string;
    percentage: number;
  }[];
  roi_summary: {
    total_return: number;
    total_return_formatted: string;
    initial_investment: number;
    initial_investment_formatted: string;
    net_savings: number;
    net_savings_formatted: string;
    saas_platform_license: number;
    saas_platform_license_formatted: string;
    ops_and_maintenance: number;
    ops_and_maintenance_formatted: string;
    roi_percentage: number;
  };
}

export interface ConversationInsightsPayload extends SectionWindow {
  kpis: {
    total_volume: MetricValue;
    top_intent: MetricValue;
    busiest_channel: MetricValue;
    kb_usage_rate: MetricValue;
    system_uptime: MetricValue;
  };
  traffic_trends: {
    month: string;
    live_chat_volume: number;
    email_volume: number;
    ticketing_volume: number;
    total_volume: number;
  }[];
  top_intents: {
    rank: number;
    intent_name: string;
    volume: number;
    percentage: number;
    formatted_label: string;
  }[];
  channel_distribution: {
    live_chat_percentage: number;
    email_support_percentage: number;
    ticketing_api_percentage: number;
    busiest_channel_name: string;
    busiest_channel_percentage: number;
  };
}

export interface AnalyticsPayloads {
  "executive-summary": ExecutiveSummaryPayload;
  "resolution-performance": ResolutionPerformancePayload;
  "ai-performance": AiPerformancePayload;
  "customer-experience": CustomerExperiencePayload;
  "business-impact": BusinessImpactPayload;
  "conversation-insights": ConversationInsightsPayload;
}

/**
 * Both calls go through the Next route handlers rather than the API directly,
 * because the analytics endpoints authenticate with a server-only key.
 */
export const adminAnalyticsApi = {
  async getSection<S extends AnalyticsSection>(section: S, days: number) {
    const { data } = await localApiClient.get<AnalyticsPayloads[S]>(
      `/api/admin/analytics/${section}`,
      { params: { days } },
    );

    return data;
  },

  async exportSection(
    section: AnalyticsSection,
    days: number,
    format: "csv" | "json" = "csv",
  ) {
    const { data } = await localApiClient.get<Blob>(
      `/api/admin/analytics/${section}/export`,
      { params: { days, format }, responseType: "blob" },
    );

    return data;
  },
};
