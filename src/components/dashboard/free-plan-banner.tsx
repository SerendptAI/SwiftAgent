"use client";

import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useCompanyPlan } from "@/hooks/use-billing";
import type { UsageMetric } from "@/services/billing";
import { useUpgradeModalStore } from "@/store/upgrade-modal-store";

interface FreePlanBannerProps {
  /**
   * What the reader was reaching for, as a noun phrase the upgrade modal can
   * name ("more strolls").
   */
  feature: string;
}

/** "0/1 agents" — the fraction already says these were used, so nothing adds it. */
function formatUsage(metric: UsageMetric | undefined, noun: string) {
  if (!metric) return null;
  return `${metric.used}/${metric.limit} ${noun}`;
}

/**
 * Renders only for a company on the free plan, where the allowance is small
 * enough that seeing what is left changes what the reader does next. Paid
 * companies get nothing.
 */
export function FreePlanBanner({ feature }: FreePlanBannerProps) {
  const companyId = useActiveCompanyId();
  const plan = useCompanyPlan(companyId);
  const showUpgrade = useUpgradeModalStore((s) => s.show);

  if (!plan.isFree) return null;

  const counters = [
    formatUsage(plan.usage?.agents, "agents"),
    formatUsage(plan.usage?.strolls, "strolls this month"),
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#006BE5]/5 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wider text-[#0055B8]">
          Free plan
        </p>
        <p className="mt-1 text-[11px] leading-[1.6] text-gray-500">
          One agent and one automated stroll a month.
          {counters.length > 0 && ` ${counters.join(" · ")}.`}
        </p>
      </div>
      <button
        type="button"
        onClick={() => showUpgrade(feature)}
        className="shrink-0 cursor-pointer rounded-md bg-[#006BE5] px-4 py-2 text-[11px] font-semibold tracking-wider text-white transition-colors hover:bg-[#0055B8]"
      >
        Upgrade
      </button>
    </div>
  );
}
