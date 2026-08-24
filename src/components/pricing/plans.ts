import type { BillingPlan, BillingPlansResponse } from "@/services/billing";

import type { Plan } from "./plan-card";

interface PlanMeta {
  textColor: string;
  image: string;
}

/**
 * Only presentation belongs here. Every plan's name, description and feature
 * bullets live in messages/<locale>/pricing.json under `plans.<tier>`, keyed by
 * the same tier slug the backend returns.
 */
const PLAN_META: Record<string, PlanMeta> = {
  basic: { textColor: "text-[#F2B035]", image: "/images/pricing/icon1.svg" },
  pro: { textColor: "text-[#6433CC]", image: "/images/pricing/icon2.svg" },
  enterprise: {
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
  },
  business: { textColor: "text-[#F2B035]", image: "/images/pricing/icon1.svg" },
  startup: { textColor: "text-[#6433CC]", image: "/images/pricing/icon2.svg" },
  enterprise_payg: {
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
  },
};

/** Enterprise tiers are sold by conversation, so they show a contact CTA instead of a price. */
const CONTACT_SALES_TIERS = new Set(["enterprise", "enterprise_payg"]);

const TIER_ORDER = ["business", "startup", "enterprise_payg"];

/**
 * The part of next-intl's translator this module needs. `raw` is what reads a
 * plan's feature bullets, which are a list rather than a single string and vary
 * in length between tiers.
 */
export interface PlanTranslator {
  (key: string): string;
  raw(key: string): unknown;
}

function formatPrice(usd: number | undefined, locale: string): string {
  if (typeof usd !== "number") return "";

  return `${usd.toLocaleString(locale)} USD`;
}

/** Merge a backend BillingPlan with the local meta and catalogue copy. */
function toPlan(
  tier: string,
  billing: BillingPlan,
  t: PlanTranslator,
  locale: string,
): Plan | null {
  const meta = PLAN_META[tier];
  if (!meta) return null;

  const features = t.raw(`plans.${tier}.features`);

  return {
    name: t(`plans.${tier}.name`),
    tier,
    price: formatPrice(billing.price_usd, locale),
    priceOriginal:
      typeof billing.price_usd_original === "number"
        ? formatPrice(billing.price_usd_original, locale)
        : undefined,
    billing: t("billingPeriod"),
    trialMonths: billing.trial_months,
    description: t(`plans.${tier}.description`),
    textColor: meta.textColor,
    image: meta.image,
    features: Array.isArray(features) ? (features as string[]) : [],
    contactSales: CONTACT_SALES_TIERS.has(tier),
  };
}

/** Build the displayable Plan list from the backend response, in canonical order. */
export function plansFromBackend(
  response: BillingPlansResponse | undefined,
  t: PlanTranslator,
  locale: string,
): Plan[] {
  if (!response) return [];

  return TIER_ORDER.map((tier) => {
    const billing = response[tier];
    return billing ? toPlan(tier, billing, t, locale) : null;
  }).filter((p): p is Plan => p !== null);
}
