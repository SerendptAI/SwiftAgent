/**
 * The figures the dashboard was built against, straight from the Figma frames.
 * Nothing in the app imports these — the tabs render whatever the analytics API
 * returns. They are kept for offline UI work and as a reference for the shape
 * each adapter has to produce.
 */
import {
  AiPerformanceView,
  BRAND,
  BusinessImpactView,
  ConversationInsightsView,
  CustomerExperienceView,
  ExecutiveSummaryView,
  Kpi,
  MONTHS,
  ResolutionPerformanceView,
  SeriesPoint,
  TabId,
} from "@/lib/admin-analytics";

const series = (values: Record<string, number[]>): SeriesPoint[] =>
  MONTHS.map((month, i) => ({
    month,
    ...Object.fromEntries(
      Object.entries(values).map(([key, nums]) => [key, nums[i]]),
    ),
  }));

export const executiveSummary = {
  northStar: {
    eyebrow: "North Star Metric",
    title: "Autonomous Resolution Rate (ARR)",
    value: "78.4%",
    delta: "+3.2%",
    caption: "30-day resolution velocity",
  },
  kpis: [
    { label: "Total Conversations", value: "142,847", delta: "+12%" },
    { label: "Human Hours Saved", value: "2,340 hrs", delta: "+8%" },
    { label: "Est. Cost Savings", value: "$187,200", delta: "+15%" },
    { label: "CSAT Score", value: "4.6 / 5.0", delta: "+2%" },
    { label: "Active Companies", value: "312", delta: "+4%" },
  ],
  arrTrend: series({
    arr: [
      71.2, 72.4, 72.0, 73.8, 72.6, 75.1, 74.3, 76.0, 75.4, 77.2, 78.0, 78.4,
    ],
    target: Array(12).fill(80),
  }),
  sparkline: series({
    arr: [
      74.1, 74.9, 74.4, 75.8, 75.2, 76.4, 76.0, 77.1, 76.7, 77.6, 78.1, 78.4,
    ],
  }),
  channels: [
    {
      label: "Live Chat",
      value: 62450,
      display: "62,450 Resolved",
      color: BRAND.purple,
    },
    {
      label: "Email",
      value: 38120,
      display: "38,120 Resolved",
      color: BRAND.orange,
    },
    {
      label: "Ticketing",
      value: 28940,
      display: "28,940 Resolved",
      color: BRAND.blue,
    },
    {
      label: "Forms",
      value: 13337,
      display: "13,337 Resolved",
      color: BRAND.yellow,
    },
  ],
  triage: {
    centerValue: "78%",
    centerLabel: "AI ARR",
    slices: [
      {
        label: "Autonomous (AI)",
        value: 78.4,
        display: "78.4% (111,992)",
        color: BRAND.purple,
      },
      {
        label: "Escalated (Human)",
        value: 21.6,
        display: "21.6% (30,855)",
        color: BRAND.orange,
      },
    ],
  },
  companies: [
    {
      name: "Acme Corp",
      avatar: "/images/affiliate/avatar-brown.png",
      conversations: "34,812",
      arr: "84.2%",
      csat: "4.8/5.0",
    },
    {
      name: "Globex Inc",
      avatar: "/images/affiliate/avatar-orange.png",
      conversations: "28,941",
      arr: "79.1%",
      csat: "4.5/5.0",
    },
    {
      name: "Initech LLC",
      avatar: "/images/affiliate/avatar-yellow.png",
      conversations: "22,402",
      arr: "76.4%",
      csat: "4.6/5.0",
    },
    {
      name: "Umbrella Corp",
      avatar: "/images/affiliate/avatar-brown.png",
      conversations: "18,299",
      arr: "74.0%",
      csat: "4.3/5.0",
    },
    {
      name: "Hooli",
      avatar: "/images/affiliate/avatar-orange.png",
      conversations: "15,115",
      arr: "81.5%",
      csat: "4.7/5.0",
    },
  ],
} satisfies ExecutiveSummaryView;

export const resolutionPerformance = {
  kpis: [
    { label: "ARR Trend", value: "82.1%", delta: "+2.4%" },
    { label: "Escalation Rate", value: "17.9%", delta: "-1.8%" },
    { label: "First Contact Resolution", value: "71.3%", delta: "+0.9%" },
    { label: "Avg Resolution Time", value: "4.2 min", delta: "-12%" },
    { label: "Repeat Contact Rate", value: "8.7%", delta: "-0.5%" },
  ],
  trends: series({
    arr: [
      74.2, 76.8, 73.9, 78.4, 75.1, 79.6, 76.8, 80.4, 78.2, 82.6, 79.8, 82.1,
    ],
    escalation: [
      25.8, 23.2, 26.1, 21.6, 24.9, 20.4, 23.2, 19.6, 21.8, 17.4, 20.2, 17.9,
    ],
  }),
  weekly: [
    { week: "Week 1", resolved: 68, escalated: 24, pending: 8 },
    { week: "Week 2", resolved: 72, escalated: 20, pending: 8 },
    { week: "Week 3", resolved: 79, escalated: 14, pending: 7 },
    { week: "Week 4", resolved: 74, escalated: 21, pending: 5 },
  ],
  channelTimes: [
    { channel: "Live Chat", time: "1.8 min", volume: "64,250" },
    { channel: "Email", time: "14.5 min", volume: "38,120" },
    { channel: "Ticketing", time: "24.2 min", volume: "28,940" },
    { channel: "Forms", time: "8.1 min", volume: "13,337" },
  ],
} satisfies ResolutionPerformanceView;

export const aiPerformance = {
  kpis: [
    { label: "AI Accuracy", value: "94.2%", delta: "+1.1%" },
    { label: "Confidence Score", value: "87.6", delta: "+2.3" },
    { label: "Avg Response Time", value: "1.8s", delta: "-0.4s" },
    { label: "Hallucination Rate", value: "0.8%", delta: "-0.2%" },
    { label: "Low Confidence Responses", value: "4.1%", delta: "-0.6%" },
  ],
  trends: series({
    accuracy: [
      89.4, 90.1, 89.8, 90.9, 91.4, 91.0, 92.2, 92.8, 93.1, 93.6, 94.0, 94.2,
    ],
    confidence: [
      79.2, 80.4, 81.1, 80.6, 82.3, 83.0, 83.8, 84.4, 85.2, 86.1, 87.0, 87.6,
    ],
  }),
  responseTimes: [
    { label: "< 1s", value: 65, display: "65%", color: BRAND.purple },
    { label: "1 - 3s", value: 82, display: "82%", color: BRAND.purple },
    { label: "3 - 5s", value: 40, display: "40%", color: BRAND.yellow },
    { label: "5 - 10s", value: 15, display: "15%", color: BRAND.orange },
    { label: "> 10s", value: 5, display: "5%", color: BRAND.orange },
  ],
  confidence: {
    centerValue: "87%",
    centerLabel: "Confidence",
    slices: [
      {
        label: "High (>90%)",
        value: 68.4,
        display: "68.4%",
        color: BRAND.purple,
      },
      {
        label: "Medium (70-90%)",
        value: 22.1,
        display: "22.1%",
        color: BRAND.yellow,
      },
      { label: "Low (<70%)", value: 9.5, display: "9.5%", color: BRAND.orange },
    ],
  },
} satisfies AiPerformanceView;

export const customerExperience = {
  kpis: [
    { label: "CSAT Score", value: "4.6 / 5.0", delta: "+0.2" },
    { label: "Positive Sentiment", value: "78.0%", delta: "+3%" },
    { label: "Net Promoter Score (NPS)", value: "62", delta: "+5" },
    { label: "CES Score", value: "2.1 / 5.0", delta: "-0.3" },
    { label: "Feedback Volume", value: "12,847", delta: "+15%" },
  ],
  trends: series({
    csat: [3.6, 4.0, 4.6, 5.0, 4.2, 4.4, 4.8, 5.2, 4.4, 4.2, 4.6, 5.0],
    nps: [2.8, 3.8, 4.2, 2.6, 3.4, 4.6, 2.8, 3.6, 4.4, 3.0, 3.4, 4.2],
  }),
  sentiment: {
    centerValue: "78%",
    centerLabel: "Positive",
    slices: [
      { label: "Positive", value: 78.0, display: "78.0%", color: BRAND.purple },
      { label: "Neutral", value: 14.5, display: "14.5%", color: BRAND.yellow },
      { label: "Negative", value: 7.5, display: "7.5%", color: BRAND.orange },
    ],
  },
  themes: [
    {
      label: "Instant Resolution / No Queue",
      mentions: "3,142 mentions",
      tone: "Positive" as const,
    },
    {
      label: "Complex Billing Issues Support",
      mentions: "2,401 mentions",
      tone: "Neutral" as const,
    },
    {
      label: "AI Hallucinated Wrong Refund Link",
      mentions: "1,812 mentions",
      tone: "Negative" as const,
    },
    {
      label: "Accurate Integration Guides Delivery",
      mentions: "1,550 mentions",
      tone: "Positive" as const,
    },
  ],
} satisfies CustomerExperienceView;

export const businessImpact = {
  kpis: [
    { label: "Human Hours Saved", value: "2,340 hrs", delta: "+18%" },
    { label: "Estimated Cost Saved", value: "$187,200", delta: "+22%" },
    { label: "ROI Metric", value: "340%", delta: "+15%" },
    { label: "FTE Equivalent Saved", value: "14.6 FTE", delta: "+2.1" },
    { label: "SLA Compliance", value: "96.8%", delta: "+1.2%" },
  ],
  trends: series({
    cost: [4.2, 8.6, 7.9, 12.4, 9.8, 18.2, 14.1, 16.8, 24.6, 20.3, 18.9, 21.4],
    hours: [3.1, 7.4, 6.8, 11.2, 8.4, 15.6, 12.2, 14.9, 20.1, 17.4, 16.2, 18.0],
  }),
  departments: [
    {
      label: "Customer Support",
      value: 94500,
      display: "$94,500 Saved",
      color: BRAND.purple,
    },
    {
      label: "Sales & Enablement",
      value: 48120,
      display: "$48,120 Saved",
      color: BRAND.orange,
    },
    {
      label: "Business Operations",
      value: 32400,
      display: "$32,400 Saved",
      color: BRAND.blue,
    },
    {
      label: "Product & Engineering",
      value: 12180,
      display: "$12,180 Saved",
      color: BRAND.yellow,
    },
  ],
  roi: {
    totalReturn: "$241,800",
    investmentNote: "On $54,600 Initial Investment",
    breakdown: [
      {
        label: "Net Savings",
        value: 187200,
        display: "$187,200",
        color: BRAND.purple,
      },
      {
        label: "SaaS Platform License",
        value: 32000,
        display: "$32,000",
        color: BRAND.orange,
      },
      {
        label: "Ops & Maintenance",
        value: 22600,
        display: "$22,600",
        color: BRAND.yellow,
      },
    ],
  },
} satisfies BusinessImpactView;

export const conversationInsights = {
  kpis: [
    { label: "Total Volume", value: "142,847", delta: "+12%" },
    { label: "Top Intent", value: "Password Reset (18.2%)", delta: "Steady" },
    { label: "Busiest Channel", value: "Live Chat (43%)", delta: "+4%" },
    { label: "KB Usage Rate", value: "67.3%", delta: "+5.1%" },
    { label: "System Uptime", value: "99.97%", delta: "100%" },
  ],
  trends: series({
    liveChat: [
      10.2, 12.4, 9.6, 14.8, 16.9, 8.1, 9.4, 10.6, 12.8, 11.2, 12.0, 11.4,
    ],
    email: [8.4, 10.1, 7.8, 12.2, 14.6, 8.6, 9.8, 10.2, 12.4, 10.8, 11.6, 11.0],
    ticketing: [
      6.8, 8.2, 6.1, 9.4, 10.8, 9.2, 10.4, 9.8, 12.6, 10.4, 11.2, 10.8,
    ],
  }),
  intents: [
    {
      label: "1. Password Reset & Recovery",
      value: 26012,
      display: "26,012 (18.2%)",
      color: BRAND.purple,
    },
    {
      label: "2. Subscription / Billing Issue",
      value: 21450,
      display: "21,450 (15.0%)",
      color: BRAND.orange,
    },
    {
      label: "3. Account Customization",
      value: 17141,
      display: "17,141 (12.0%)",
      color: BRAND.blue,
    },
    {
      label: "4. API Key Integration Help",
      value: 12500,
      display: "12,500 (8.7%)",
      color: BRAND.yellow,
    },
    {
      label: "5. Refund / Return Status",
      value: 9280,
      display: "9,280 (6.5%)",
      color: BRAND.purple,
    },
  ],
  distribution: {
    centerValue: "43%",
    centerLabel: "Chat",
    slices: [
      {
        label: "Live Chat",
        value: 43.0,
        display: "43.0%",
        color: BRAND.purple,
      },
      {
        label: "Email Support",
        value: 32.1,
        display: "32.1%",
        color: BRAND.orange,
      },
      {
        label: "Ticketing / API",
        value: 24.9,
        display: "24.9%",
        color: BRAND.blue,
      },
    ],
  },
} satisfies ConversationInsightsView;

export const KPIS_BY_TAB: Record<TabId, Kpi[]> = {
  "Executive Summary": executiveSummary.kpis,
  "Resolution Performance": resolutionPerformance.kpis,
  "AI Performance": aiPerformance.kpis,
  "Customer Experience": customerExperience.kpis,
  "Business Impact": businessImpact.kpis,
  "Conversation Insights": conversationInsights.kpis,
};
