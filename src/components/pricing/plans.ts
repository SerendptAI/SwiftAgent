import type { BillingPlan, BillingPlansResponse } from "@/services/billing";
import { FREE_TIER } from "@/services/billing";

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
const PLAN_META = {
  free: { textColor: "text-[#6E6E6E]", image: "/images/pricing/icon1.svg" },
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
} satisfies Record<string, PlanMeta>;

type KnownTier = keyof typeof PLAN_META;

/** Enterprise tiers are sold by conversation, so they show a contact CTA instead of a price. */
const CONTACT_SALES_TIERS = new Set<string>(["enterprise", "enterprise_payg"]);

/** Paid tiers, in the order they are offered. The free plan is not sold. */
const TIER_ORDER: KnownTier[] = ["business", "startup", "enterprise_payg"];

/** Stands in until the backend starts listing the free tier in /plans. */
const FREE_PLAN_FALLBACK: BillingPlan = {
  price_usd: 0,
  display_name: "Free",
};

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
  tier: KnownTier,
  billing: BillingPlan,
  t: PlanTranslator,
  locale: string,
): Plan {
  const meta = PLAN_META[tier];
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

  return TIER_ORDER.flatMap((tier) => {
    const billing = response[tier];
    return billing ? [toPlan(tier, billing, t, locale)] : [];
  });
}

/**
 * The free plan card. It is granted rather than sold, so it renders from local
 * copy whenever the backend catalogue leaves it out.
 */
export function freePlan(
  response: BillingPlansResponse | undefined,
  t: PlanTranslator,
  locale: string,
): Plan {
  return toPlan(
    FREE_TIER,
    response?.[FREE_TIER] ?? FREE_PLAN_FALLBACK,
    t,
    locale,
  );
}
