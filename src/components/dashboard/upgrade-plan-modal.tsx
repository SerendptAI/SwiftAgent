"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useId, useState } from "react";

import type { Plan } from "@/components/pricing/plan-card";
import { plansFromBackend } from "@/components/pricing/plans";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails, useBillingPlans } from "@/hooks/use-billing";
import type { SubscriptionTier } from "@/services/billing";

import { Icons } from "../icons";

// Exact path data lifted from the Figma export (viewBox 0 0 136 150).
const PLAN_ICON_DATA: Record<
  string,
  { bg: string; paths: string[]; clipped?: boolean }
> = {
  basic: {
    bg: "#F2B035",
    paths: [
      "M42.293 57.9629H59.4785V92.3672H42.293V109.554H25.0742V92.3359H42.2607V75.1807H8V57.9629H25.0742V41H42.293V57.9629ZM110.813 57.9629H128V75.1807H76.5215V57.9629H93.5957V41H110.813V57.9629Z",
    ],
  },
  pro: {
    bg: "#6433CC",
    paths: [
      "M45.4346 60.5596H60.1855V90.0898H45.4346V104.842H30.6553V90.0625H45.4072V75.3389H16V60.5596H30.6553V46H45.4346V60.5596ZM104.248 60.5596H119V90.0898H104.248V104.842H89.4697V90.0625H104.221V75.3389H74.8145V60.5596H89.4697V46H104.248V60.5596Z",
    ],
  },
  enterprise: {
    bg: "#F25430",
    clipped: true,
    paths: [
      "M51.2858 117.571H31.8571V137H-7V117.571H12.4286V98.1429H51.2858V117.571Z",
      "M109.571 137H90.1429V117.571H109.571V137Z",
      "M70.7143 78.7143H90.1429V117.571H70.7143V98.1429H51.2858V78.7143H31.8571V59.2858H70.7143V78.7143Z",
      "M129 117.571H109.571V98.1429H129V117.571Z",
      "M109.571 78.7143H90.1429V59.2858H109.571V78.7143Z",
      "M129 59.2858H109.571V39.9866H90.1429V20.5581H109.571V1H129V59.2858Z",
    ],
  },
};

function PlanIcon({ tier }: { tier?: string }) {
  const clipId = useId();
  const style = PLAN_ICON_DATA[tier ?? "basic"] ?? PLAN_ICON_DATA.basic;
  const body = (
    <>
      <rect width="136" height="150" fill={style.bg} />
      {style.paths.map((d, i) => (
        <path key={i} d={d} fill="#F6F4EF" />
      ))}
    </>
  );
  return (
    <svg
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      viewBox="0 0 136 150"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      {style.clipped ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect width="136" height="150" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>{body}</g>
        </>
      ) : (
        body
      )}
    </svg>
  );
}

interface UpgradePlanModalProps {
  open: boolean;
  onClose: () => void;
  /** When false the modal can't be dismissed — no close button, backdrop click, or escape. */
  dismissible?: boolean;
  /** Shows the "choose a plan to get started" activation copy instead of the upgrade copy. */
  getStarted?: boolean;
}

export function UpgradePlanModal({
  open,
  onClose,
  dismissible = true,
  getStarted = false,
}: UpgradePlanModalProps) {
  const companyId = useActiveCompanyId();
  const { data: details } = useBillingDetails(companyId);
  const { data: backendPlans } = useBillingPlans();
  const router = useRouter();
  const locale = useLocale();

  const [visible, setVisible] = useState(open);
  // Only an actually-active subscription counts as the current plan. The backend
  // still reports a `tier` for inactive/canceled/"none" states, so keying off
  // `tier` alone would wrongly light a card up as "Presently On".
  const subscriptionStatus = details?.subscription_status ?? details?.status;
  const activeTier: SubscriptionTier =
    subscriptionStatus === "active" ? (details?.tier ?? null) : null;
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
    const onKey = (e: KeyboardEvent) =>
      dismissible && e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, dismissible]);

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
      className="fixed inset-0 z-1040"
    >
      {dismissible ? (
        <button
          type="button"
          aria-label="Close upgrade dialog"
          onClick={handleClose}
          className="absolute inset-0 cursor-default bg-black/65"
        />
      ) : (
        <div className="absolute inset-0 bg-black/65" />
      )}

      <div className="absolute top-[5vh] left-[8vw] max-h-[94vh] w-[min(810px,84vw)] overflow-y-auto bg-white">
        {dismissible && (
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute top-[12px] right-[10px] z-10 text-black/70 transition-colors hover:text-black"
          >
            <X className="size-[30px]" strokeWidth={1.5} />
          </button>
        )}

        <h2
          id="upgrade-plan-title"
          className="font-greed-narrow mx-auto mt-[46px] w-[447px] max-w-full text-center text-[40px] leading-[1.1] font-semibold tracking-[-0.8px] text-black"
        >
          {getStarted
            ? "Choose a plan to get started"
            : "Upgrade your plan to have access to that"}
        </h2>
        <p className="font-dm-mono mx-auto mt-[22px] w-[492px] max-w-full text-center text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase">
          {getStarted ? (
            "Select a plan to activate your account and start using SwiftAgent"
          ) : (
            <>
              Your plan currently supports {`{feature}`} to use {`{feature}`}{" "}
              you have to upgrade
            </>
          )}
        </p>

        <ul className="mx-auto mt-[47px] mb-[40px] flex w-[685px] max-w-full flex-col gap-[29px]">
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
      {/* Plan image — left rail, full height, right border separates from content */}
      <div className="absolute top-0 left-0 h-[150px] w-[136px] border-r border-black">
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
