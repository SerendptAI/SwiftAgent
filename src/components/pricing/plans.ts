import type { Plan } from "./plan-card";

export const GEO_PRICING: Record<string, { price: string; billing: string }[]> =
  {
    NG: [
      { price: "NGN 25,000", billing: "PER MONTH" },
      { price: "NGN 45,000", billing: "PER MONTH" },
      { price: "NGN 80,000", billing: "PER MONTH" },
    ],
    default: [
      { price: "200 USD", billing: "PER MONTH" },
      { price: "700 USD", billing: "PER MONTH" },
      { price: "1,700 USD", billing: "PER MONTH" },
    ],
  };

export const BASE_PLANS: Omit<Plan, "price" | "billing">[] = [
  {
    name: "BASIC PLAN",
    tier: "basic",
    description:
      "DESIGNED FOR EARLY STARTUPS\nAND SMALL PROJECTS\nTESTING THE WATERS.",
    textColor: "text-[#F3B03D]",
    image: "/images/pricing/icon1.svg",
    features: [
      "1 DEPLOYED AI AGENT",
      "UP TO 10 DOCUMENT UPLOADS",
      "1 SUPPORTED LANGUAGE",
      "BASIC ANSWER BOUNDARIES",
      "BASIC ANALYTICS REPORTING",
      "UP TO 800 VOICE MINUTES\nPER MONTH",
      "STANDARD SHARED COMPUTE TIER",
      "MAXIMUM OF 1 COMPANY PER\nCORE USER ACCOUNT",
      "UP TO 3 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  {
    name: "PRO PLAN",
    tier: "pro",
    description:
      "GEARED TOWARDS GROWING\nOPERATIONS NEEDING SCALE\nAND HEAVIER WORKLOAD VOLUME.",
    textColor: "text-[#6433CC]",
    image: "/images/pricing/icon2.svg",
    features: [
      "UP TO 3 DEPLOYED AI AGENTS",
      "UP TO 50 DOCUMENT UPLOADS",
      "UP TO 3 SUPPORTED LANGUAGES",
      "ADVANCED ANSWER BOUNDARIES\nFOR NUANCED AGENT RESPONSES",
      "ADVANCED ANALYTICS REPORTING",
      "UP TO 3,000 VOICE MINUTES\nPER MONTH",
      "PRIORITY COMPUTE TIER\n(REDUCES GENERATION LATENCY)",
      "MAXIMUM OF 3 COMPANIES PER\nCORE USER ACCOUNT",
      "UP TO 10 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  {
    name: "ENTERPRISE PLAN",
    tier: "enterprise",
    description:
      "UNCAPPED SCALING FOR\nESTABLISHED OPERATIONS\nAND INTENSIVE NEEDS.",
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
    features: [
      "UNLIMITED DEPLOYED AI AGENTS",
      "UNLIMITED DOCUMENT UPLOADS",
      "ALL SUPPORTED LANGUAGES\n(UNLIMITED)",
      "CUSTOM ANSWER BOUNDARY\nCONTROLS",
      "FULLY CUSTOMIZABLE ANALYTICS",
      "UNLIMITED VOICE MINUTES\nPER MONTH",
      "DEDICATED COMPUTE TIER FOR\nTHE FASTEST RESPONSE TIMES",
      "UNLIMITED COMPANIES",
      "UNLIMITED INVITED MEMBERS\nPER COMPANY",
    ],
  },
];

export function buildPlans(country: string | null | undefined): Plan[] {
  const pricing = GEO_PRICING[country ?? "default"] ?? GEO_PRICING.default;
  return BASE_PLANS.map((base, i) => ({ ...base, ...pricing[i] }));
}
