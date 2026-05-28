"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import type { Plan } from "@/components/pricing/plan-card";
import { plansFromBackend } from "@/components/pricing/plans";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails, useBillingPlans } from "@/hooks/use-billing";
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
  const { data: details } = useBillingDetails(companyId);
  const { data: backendPlans } = useBillingPlans();
  const router = useRouter();
  const locale = useLocale();

  const [visible, setVisible] = useState(open);
  const activeTier: SubscriptionTier = details?.tier ?? null;
  const plans = plansFromBackend(backendPlans);

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

  const handleViewMore = (plan: Plan) => {
    handleClose();
    const target = plan.tier
      ? `/${locale}/dashboard/billing?tier=${plan.tier}`
      : `/${locale}/dashboard/billing`;
    router.push(target);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-plan-title"
      className="fixed inset-0 z-1040 flex items-center justify-center p-6"
    >
      <button
        type="button"
        aria-label="Close upgrade dialog"
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-black/65"
      />
      <div className="relative h-[922px] max-h-[92vh] w-[810px] max-w-full overflow-y-auto bg-white">
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute top-[12px] right-[10px] z-10 text-black/70 transition-colors hover:text-black"
        >
          <X className="size-[30px]" strokeWidth={1.5} />
        </button>

        <h2
          id="upgrade-plan-title"
          className="font-greed-narrow mx-auto mt-[126px] w-[447px] max-w-full text-center text-[40px] leading-[1.1] font-semibold tracking-[-0.8px] text-black"
        >
          Upgrade your plan to have access to that
        </h2>
        <p className="font-dm-mono mx-auto mt-[22px] w-[492px] max-w-full text-center text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase">
          Your plan currently supports {`{feature}`} to use {`{feature}`} you
          have to upgrade
        </p>

        <ul className="mx-auto mt-[47px] flex w-[685px] max-w-full flex-col gap-[29px]">
          {plans.map((plan) => {
            const isActive = !!plan.tier && plan.tier === activeTier;
            return (
              <li key={plan.name}>
                <UpgradePlanCard
                  plan={plan}
                  isActive={isActive}
                  onSelect={() => handleViewMore(plan)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function UpgradePlanCard({
  plan,
  isActive,
  onSelect,
}: {
  plan: Plan;
  isActive: boolean;
  onSelect: () => void;
}) {
  const isLargeTitle = plan.tier !== "basic";
  return (
    <div className="relative h-[150px] w-[685px] max-w-full overflow-hidden border border-black bg-white">
      {/* Plan image — left rail, full height */}
      <div className="absolute top-0 left-0 h-[150px] w-[136px]">
        <PlanIcon tier={plan.tier} />
      </div>

      {/* Plan name — Figma: left:154 top:12 */}
      <p
        className={`font-dm-mono absolute top-[12px] left-[154px] leading-[1.2] uppercase ${plan.textColor} ${
          isLargeTitle
            ? "text-[20px] tracking-[2px]"
            : "text-[18px] tracking-[1.8px]"
        }`}
      >
        {plan.name}
      </p>

      {/* Price — Figma: left:154 top:43 */}
      <p className="font-dm-mono absolute top-[43px] left-[154px] text-[18px] leading-[1.2] tracking-[1.8px] text-black uppercase">
        {plan.price} {plan.billing}
      </p>

      {/* Features — Figma: left:154 top:90 w:269 */}
      <div className="font-dm-mono absolute top-[90px] left-[154px] max-h-[51px] w-[269px] overflow-hidden text-[14px] leading-[1.86] tracking-[1.4px] text-black/70 uppercase">
        {plan.features.map((feature, i) => (
          <p key={i} className="whitespace-pre-line">
            {feature}
          </p>
        ))}
      </div>

      {/* Subscribed indicator — Figma: text right edge ~27px from card right, top:44 */}
      {isActive && (
        <span className="font-dm-mono absolute top-[44px] right-[27px] flex items-center gap-[7px] text-[16px] leading-[1.2] tracking-[1.6px] text-black/60 uppercase">
          <Icons.CheckCircle className="h-[24px] w-[24px]" />
          Subscribed
        </span>
      )}

      {/* Action button — PRESENTLY ON 160x38 right:27, VIEW MORE 143x38 right:14 */}
      {isActive ? (
        <span className="font-dm-mono absolute top-[97px] right-[27px] inline-flex h-[38px] w-[160px] items-center justify-center rounded-[13px] border border-[#EDEDED] bg-[#EDEDED] text-[14px] leading-[1.2] tracking-[1.4px] text-black uppercase">
          Presently On
        </span>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="font-dm-mono absolute top-[97px] right-[14px] inline-flex h-[38px] w-[143px] cursor-pointer items-center justify-center rounded-[13px] border border-[#EDEDED] bg-[#006BE5] text-[14px] leading-[1.2] tracking-[1.4px] text-white uppercase transition-colors hover:bg-[#0055B8]"
        >
          View More
        </button>
      )}
    </div>
  );
}
