"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

import { DemoBookingLink } from "@/components/landing/demo-booking-link";
import type { Plan } from "@/components/pricing/plan-card";
import { plansFromBackend } from "@/components/pricing/plans";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingPlans, useCompanyPlan } from "@/hooks/use-billing";

import { Icons } from "../icons";

// Figma: 143x38 button pinned 14px from the card's right edge, 97px from its top.
const MODAL_CTA_CLASS =
  "font-dm-mono absolute top-[97px] right-[14px] inline-flex h-[38px] w-[143px] cursor-pointer items-center justify-center rounded-[13px] border border-[#EDEDED] bg-[#006BE5] text-[14px] leading-[1.2] tracking-[1.4px] text-white uppercase transition-colors hover:bg-[#0055B8]";

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
  /**
   * What the visitor was trying to reach, named as a noun phrase ("the widget
   * settings"). Falls back to generic copy — the sentence previously carried an
   * unwired `{feature}` placeholder that rendered literally on screen.
   */
  feature?: string;
}

export function UpgradePlanModal({
  open,
  onClose,
  dismissible = true,
  feature,
}: UpgradePlanModalProps) {
  const companyId = useActiveCompanyId();
  const companyPlan = useCompanyPlan(companyId);
  const { data: backendPlans } = useBillingPlans();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("pricing");

  const [visible, setVisible] = useState(open);
  const plans = plansFromBackend(backendPlans, t, locale);

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

      <div className="absolute top-1/2 left-1/2 max-h-[94vh] w-[min(810px,84vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white">
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
          Upgrade your plan to have access to that
        </h2>
        <p className="font-dm-mono mx-auto mt-[22px] w-[492px] max-w-full text-center text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase">
          {feature
            ? `Your current plan doesn't include ${feature}. Upgrade to unlock it.`
            : "Your current plan doesn't include this feature. Upgrade to unlock it."}
        </p>

        <ul className="mx-auto mt-[47px] mb-[40px] flex w-[685px] max-w-full flex-col gap-[29px]">
          {plans.map((plan) => {
            // Only a paid subscription lights a card up as "Presently On" — the
            // backend still reports a tier for every unpaid state.
            const isActive =
              companyPlan.isPaid && plan.tier === companyPlan.tier;
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
  const t = useTranslations("pricing");

  return (
    <div className="relative h-[150px] w-[685px] max-w-full overflow-hidden border border-black bg-white">
      <div className="absolute top-0 left-0 h-[150px] w-[136px] border-r border-black">
        <PlanIcon tier={plan.tier} />
      </div>

      <p
        className={`font-dm-mono absolute top-[12px] left-[154px] leading-[1.2] uppercase ${plan.textColor} ${
          isLargeTitle
            ? "text-[20px] tracking-[2px]"
            : "text-[18px] tracking-[1.8px]"
        }`}
      >
        {plan.name}
      </p>

      <p className="font-dm-mono absolute top-[43px] left-[154px] text-[18px] leading-[1.2] tracking-[1.8px] text-black uppercase">
        {plan.contactSales
          ? t("contactSales")
          : `${plan.price} ${plan.billing}`}
      </p>

      <div className="font-dm-mono absolute top-[90px] left-[154px] max-h-[51px] w-[269px] overflow-hidden text-[14px] leading-[1.86] tracking-[1.4px] text-black/70 uppercase">
        {plan.features.map((feature, i) => (
          <p key={i} className="whitespace-pre-line">
            {feature}
          </p>
        ))}
      </div>

      {isActive && (
        <span className="font-dm-mono absolute top-[44px] right-[27px] flex items-center gap-[7px] text-[16px] leading-[1.2] tracking-[1.6px] text-black/60 uppercase">
          <Icons.CheckCircle className="h-[24px] w-[24px]" />
          Subscribed
        </span>
      )}

      {isActive ? (
        <span className="font-dm-mono absolute top-[97px] right-[27px] inline-flex h-[38px] w-[160px] items-center justify-center rounded-[13px] border border-[#EDEDED] bg-[#EDEDED] text-[14px] leading-[1.2] tracking-[1.4px] text-black uppercase">
          Presently On
        </span>
      ) : plan.contactSales ? (
        <DemoBookingLink
          location="pricing-enterprise"
          className={MODAL_CTA_CLASS}
        >
          {t("contactSales")}
        </DemoBookingLink>
      ) : (
        <button type="button" onClick={onSelect} className={MODAL_CTA_CLASS}>
          View More
        </button>
      )}
    </div>
  );
}
