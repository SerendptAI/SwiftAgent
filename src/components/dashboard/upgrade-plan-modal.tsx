"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Plan } from "@/components/pricing/plan-card";
import { buildPlans } from "@/components/pricing/plans";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails, useCreateCheckout } from "@/hooks/use-billing";
import { useGeoCountry } from "@/hooks/use-geo-country";
import type { SubscriptionTier } from "@/services/billing";

import { Icons } from "../icons";

const PLAN_S_PATH =
  "M144.601 78.7329H177.928V145.447H144.601V178.773H111.214V145.385H144.54V112.121H78.1044V78.7329H111.214V45.8403H144.601V78.7329ZM277.472 78.7329H310.798V145.447H277.472V178.773H244.084V145.385H277.41V112.121H210.974V78.7329H244.084V45.8403H277.472V78.7329Z";

const PLAN_ENTERPRISE_PATHS = [
  "M172.714 217.428H121.143V269H18V217.428H69.5716V165.857H172.714V217.428Z",
  "M327.428 269H275.857V217.428H327.428V269Z",
  "M224.286 114.286H275.857V217.428H224.286V165.857H172.714V114.286H121.143V62.7144H224.286V114.286Z",
  "M379 217.428H327.428V165.857H379V217.428Z",
  "M327.428 114.286H275.857V62.7144H327.428V114.286Z",
  "M379 62.7144H327.428V11.4865H275.857V-40.0847H327.428V-92H379V62.7144Z",
];

const TIER_ICON_STYLE: Record<
  string,
  { bg: string; viewBox: string; paths: string[] }
> = {
  basic: { bg: "#F2B035", viewBox: "60 37 136 150", paths: [PLAN_S_PATH] },
  pro: { bg: "#6433CC", viewBox: "60 37 136 150", paths: [PLAN_S_PATH] },
  enterprise: {
    bg: "#F25430",
    viewBox: "207 25 136 150",
    paths: PLAN_ENTERPRISE_PATHS,
  },
};

function PlanIcon({ tier }: { tier?: string }) {
  const style = TIER_ICON_STYLE[tier ?? "basic"] ?? TIER_ICON_STYLE.basic;
  return (
    <svg
      width="136"
      height="150"
      viewBox={style.viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="block"
    >
      <rect x="0" y="0" width="398" height="269" fill={style.bg} />
      {style.paths.map((d, i) => (
        <path key={i} d={d} fill="#F6F4EF" />
      ))}
    </svg>
  );
}

interface UpgradePlanModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradePlanModal({ open, onClose }: UpgradePlanModalProps) {
  const companyId = useActiveCompanyId();
  const country = useGeoCountry();
  const { data: details } = useBillingDetails(companyId);
  const createCheckout = useCreateCheckout();

  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const [visible, setVisible] = useState(open);
  const activeTier: SubscriptionTier = details?.tier ?? null;
  const plans = buildPlans(country);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const handleSubscribe = (plan: Plan) => {
    if (!plan.tier || !companyId) return;
    setPendingTier(plan.tier);
    createCheckout.mutate(
      { company_id: companyId, tier: plan.tier },
      {
        onSuccess: ({ checkout_url }) => {
          if (checkout_url) window.location.href = checkout_url;
          else setPendingTier(null);
        },
        onError: () => setPendingTier(null),
      },
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-plan-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <button
        type="button"
        aria-label="Close upgrade dialog"
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-black/65"
      />
      <div className="relative flex max-h-[92vh] w-[810px] max-w-full flex-col overflow-y-auto bg-white">
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 text-black/70 transition-colors hover:text-black"
        >
          <X className="size-[30px]" strokeWidth={1.5} />
        </button>

        <div className="px-[60px] pt-[60px] pb-[40px]">
          <h2
            id="upgrade-plan-title"
            className="font-greed-narrow mx-auto w-[447px] max-w-full text-center text-[32px] leading-[1.1] font-semibold tracking-[-0.64px] text-black"
          >
            Upgrade your plan to have access to that
          </h2>
          <p className="font-dm-mono mx-auto mt-[10px] w-[492px] max-w-full text-center text-lg leading-[1.8] tracking-[1.2px] text-black/60 uppercase">
            Your plan currently supports {`{feature}"`} to use {`{feature}`} you
            have to upgrade
          </p>

          <ul className="mt-[32px] space-y-[20px]">
            {plans.map((plan) => {
              const isActive = !!plan.tier && plan.tier === activeTier;
              const isPending = pendingTier === plan.tier;
              return (
                <li key={plan.name}>
                  <UpgradePlanCard
                    plan={plan}
                    isActive={isActive}
                    isPending={isPending}
                    disabled={!companyId || createCheckout.isPending}
                    onSelect={() => handleSubscribe(plan)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function UpgradePlanCard({
  plan,
  isActive,
  isPending,
  disabled,
  onSelect,
}: {
  plan: Plan;
  isActive: boolean;
  isPending: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const isLargeTitle = plan.tier !== "basic";
  return (
    <div className="flex h-[150px] w-[685px] max-w-full overflow-hidden border border-black bg-white">
      <div className="h-[150px] w-[136px] shrink-0">
        <PlanIcon tier={plan.tier} />
      </div>

      <div className="relative flex-1 px-[18px] py-[12px]">
        <p
          className={`font-dm-mono leading-[1.2] tracking-[2px] uppercase ${plan.textColor} ${
            isLargeTitle ? "text-[20px]" : "text-[18px] tracking-[1.8px]"
          }`}
        >
          {plan.name}
        </p>
        <p className="font-dm-mono mt-[5px] text-[18px] leading-[1.2] tracking-[1.8px] text-black uppercase">
          {plan.price} {plan.billing}
        </p>
        <div className="font-dm-mono mt-[10px] h-[51px] w-[269px] overflow-hidden text-[14px] leading-[1.86] tracking-[1.4px] text-black/70 uppercase">
          {plan.features.map((feature, i) => (
            <p key={i} className="whitespace-pre-line">
              {feature}
            </p>
          ))}
        </div>

        {isActive && (
          <span className="font-dm-mono absolute top-[44px] right-[18px] flex items-center gap-2 text-[16px] leading-[1.2] tracking-[1.6px] text-black/60 uppercase">
            <Icons.CheckCircle className="h-8 w-8" />
            Subscribed
          </span>
        )}

        <div className="absolute top-[97px] right-[18px]">
          {isActive ? (
            <span className="font-dm-mono inline-flex h-[38px] items-center justify-center rounded-[13px] border border-[#EDEDED] bg-[#EDEDED] px-5 text-[14px] leading-[1.2] tracking-[1.4px] text-black uppercase">
              Presently On
            </span>
          ) : (
            <button
              type="button"
              onClick={onSelect}
              disabled={disabled}
              className="font-dm-mono inline-flex h-[38px] cursor-pointer items-center justify-center rounded-[13px] border border-[#EDEDED] bg-[#006BE5] px-5 text-[14px] leading-[1.2] tracking-[1.4px] text-white uppercase transition-colors hover:bg-[#0055B8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Redirecting…" : "View More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
