"use client";

import { CheckCircle, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { Plan } from "@/components/pricing/plan-card";
import { buildPlans } from "@/components/pricing/plans";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails, useCreateCheckout } from "@/hooks/use-billing";
import { useGeoCountry } from "@/hooks/use-geo-country";
import type { SubscriptionTier } from "@/services/billing";

interface UpgradePlanModalProps {
  open: boolean;
  onClose: () => void;
  /** Feature name interpolated into the subtitle (e.g. "Advanced analytics") */
  feature?: string;
}

export function UpgradePlanModal({
  open,
  onClose,
  feature = "this feature",
}: UpgradePlanModalProps) {
  const companyId = useActiveCompanyId();
  const country = useGeoCountry();
  const { data: details } = useBillingDetails(companyId);
  const createCheckout = useCreateCheckout();

  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const activeTier: SubscriptionTier = details?.subscription_tier ?? null;
  const plans = buildPlans(country);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

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
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/65"
      />
      <div className="relative flex max-h-[92vh] w-[810px] max-w-full flex-col overflow-y-auto bg-white">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 text-black/70 transition-colors hover:text-black"
        >
          <X className="size-[30px]" strokeWidth={1.5} />
        </button>

        <div className="px-[60px] pt-[126px] pb-[60px]">
          <h2
            id="upgrade-plan-title"
            className="font-greed-narrow mx-auto w-[447px] max-w-full text-center text-[40px] leading-[1.1] font-semibold tracking-[-0.8px] text-black"
          >
            Upgrade your plan to have access to that
          </h2>
          <p className="font-dm-mono mx-auto mt-[14px] w-[492px] max-w-full text-center text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase">
            Your plan currently supports {feature} — to use {feature} you have
            to upgrade
          </p>

          <ul className="mt-[42px] space-y-[29px]">
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
      <div className="relative h-[150px] w-[136px] shrink-0">
        <Image
          src={plan.image}
          alt={plan.name}
          fill
          sizes="136px"
          className="object-cover"
        />
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
            <CheckCircle className="h-5 w-5" />
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
