import type { BillingPlan, BillingPlansResponse } from "@/services/billing";

import type { Plan } from "./plan-card";

interface PlanMeta {
  name: string;
  description: string;
  textColor: string;
  image: string;
  features: string[];
}

/** Enterprise tiers are sold by conversation, so they show a contact CTA instead of a price. */
const CONTACT_SALES_TIERS = new Set(["enterprise", "enterprise_payg"]);

export const CONTACT_SALES_LABEL = "CONTACT US";

const PLAN_META: Record<string, PlanMeta> = {
  basic: {
    name: "BASIC PLAN",
    description:
      "DESIGNED FOR EARLY STARTUPS\nAND SMALL PROJECTS\nTESTING THE WATERS.",
    textColor: "text-[#F2B035]",
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
  pro: {
    name: "PRO PLAN",
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
  enterprise: {
    name: "ENTERPRISE PLAN",
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
  business: {
    name: "BUSINESS PLAN",
    description:
      "FOR SMALL SETUPS GETTING\nSTARTED WITH AI SUPPORT\nAT A LOW ENTRY POINT.",
    textColor: "text-[#F2B035]",
    image: "/images/pricing/icon1.svg",
    features: [
      "1 DEPLOYED AI AGENT",
      "UP TO 5 DOCUMENT UPLOADS",
      "1 SUPPORTED LANGUAGE",
      "BASIC ANSWER BOUNDARIES",
      "BASIC ANALYTICS REPORTING",
      "UNLIMITED AGENT CHATS\nPER MONTH",
      "UP TO 2 STROLLS PER MONTH",
      "STANDARD SHARED COMPUTE TIER",
      "UP TO 2 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  startup: {
    name: "STARTUP PLAN",
    description:
      "BUILT FOR GROWING TEAMS\nSCALING THEIR AI OPERATIONS\nWITH MORE HEADROOM.",
    textColor: "text-[#6433CC]",
    image: "/images/pricing/icon2.svg",
    features: [
      "1 DEPLOYED AI AGENT",
      "UP TO 20 DOCUMENT UPLOADS",
      "UP TO 2 SUPPORTED LANGUAGES",
      "ADVANCED ANSWER BOUNDARIES\nFOR NUANCED AGENT RESPONSES",
      "ADVANCED ANALYTICS REPORTING",
      "UNLIMITED AGENT CHATS\nPER MONTH",
      "UP TO 5 STROLLS PER MONTH",
      "PRIORITY COMPUTE TIER\n(REDUCES GENERATION LATENCY)",
      "UP TO 5 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  enterprise_payg: {
    name: "ENTERPRISE PLAN",
    description:
      "FOR LARGE ORGANIZATIONS\nRUNNING AI SUPPORT ACROSS\nTHEIR ENTIRE OPERATION.",
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
    features: [
      "UNLIMITED DEPLOYED AI AGENTS",
      "UP TO 50 DOCUMENT UPLOADS",
      "ALL SUPPORTED LANGUAGES\n(UNLIMITED)",
      "CUSTOM ANSWER BOUNDARY\nCONTROLS",
      "FULLY CUSTOMIZABLE ANALYTICS",
      "UNLIMITED AGENT CHATS\nPER MONTH",
      "UP TO 25 STROLLS PER MONTH",
      "DEDICATED COMPUTE TIER FOR\nTHE FASTEST RESPONSE TIMES",
      "UP TO 5 INVITED MEMBERS\nPER COMPANY",
    ],
  },
};

const TIER_ORDER = ["business", "startup", "enterprise_payg"];

function formatPrice(usd: number | undefined): string {
  if (typeof usd !== "number") return "";
  return `${usd.toLocaleString("en-US")} USD`;
}

/** Merge a backend BillingPlan with the local meta into the UI Plan shape. */
function toPlan(tier: string, billing: BillingPlan): Plan | null {
  const meta = PLAN_META[tier];
  if (!meta) return null;
  return {
    name: meta.name,
    tier,
    price: formatPrice(billing.price_usd),
    priceOriginal:
      typeof billing.price_usd_original === "number"
        ? formatPrice(billing.price_usd_original)
        : undefined,
    billing: "PER MONTH",
    trialMonths: billing.trial_months,
    description: meta.description,
    textColor: meta.textColor,
    image: meta.image,
    features: meta.features,
    contactSales: CONTACT_SALES_TIERS.has(tier),
  };
}

/** Build the displayable Plan list from the backend response, in canonical order. */
export function plansFromBackend(
  response: BillingPlansResponse | undefined,
): Plan[] {
  if (!response) return [];
  return TIER_ORDER.map((tier) => {
    const billing = response[tier];
    return billing ? toPlan(tier, billing) : null;
  }).filter((p): p is Plan => p !== null);
}
