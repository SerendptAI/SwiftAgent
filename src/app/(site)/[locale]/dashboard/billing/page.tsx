"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { CheckoutModal } from "@/components/dashboard/billing/checkout-modal";
import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { CanceledSubscriptionBanner } from "@/components/dashboard/settings/canceled-subscription-banner";
import { CardBrandIcon } from "@/components/dashboard/settings/card-brand-icon";
import { type Plan, PlanCard } from "@/components/pricing/plan-card";
import { freePlan, plansFromBackend } from "@/components/pricing/plans";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import {
  useBillingDetails,
  useBillingPlans,
  useCompanyPlan,
} from "@/hooks/use-billing";
import { cn } from "@/lib/utils";
import type { SavedCard } from "@/services/billing";
import { useCardStore } from "@/store/card-store";

/** A plan is only checkout-ready once the backend has given it a tier slug. */
type CheckoutPlan = Plan & { tier: string };

export default function BillingPage() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardMenuOpen, setCardMenuOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<CheckoutPlan | null>(null);
  const cardMenuRef = useRef<HTMLDivElement>(null);

  const companyId = useActiveCompanyId();
  const { data: details } = useBillingDetails(companyId);
  const { data: backendPlans } = useBillingPlans();
  const { savedCards: localCards, addCard } = useCardStore();
  const t = useTranslations("pricing");
  const locale = useLocale();
  const companyPlan = useCompanyPlan(companyId);
  const paidPlans: Plan[] = plansFromBackend(backendPlans, t, locale);
  const free: Plan = freePlan(backendPlans, t, locale);

  const backendCards: SavedCard[] = details?.saved_cards ?? [];
  const localAsSaved: SavedCard[] = localCards.map((c) => ({
    brand: "mastercard",
    last4: c.last4,
  }));
  const savedCards: SavedCard[] = [...backendCards, ...localAsSaved];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cardMenuRef.current &&
        !cardMenuRef.current.contains(event.target as Node)
      ) {
        setCardMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubscribe = (plan: Plan) => {
    if (!plan.tier || !companyId) return;
    setCheckoutPlan({ ...plan, tier: plan.tier });
  };

  return (
    <div className="flex h-full min-w-0 flex-col pb-6 lg:pb-0">
      <div className="mb-6 flex w-full max-w-[1536px] flex-col gap-3 lg:mb-4 lg:grid lg:grid-cols-3 lg:items-center lg:gap-10">
        <div className="min-w-0 lg:col-span-2">
          <CompanyToolbar />
        </div>
        <div className="mb-4 rounded-[20px] bg-white p-2 shadow-sm lg:col-span-1 lg:h-16 lg:rounded-3xl lg:py-2 lg:pr-2 lg:pl-6">
          <div className="flex w-full items-center justify-between gap-2 text-xs font-semibold text-gray-600 sm:text-sm">
            <span className="shrink-0 tracking-[0.14em] sm:tracking-widest">
              Saved Cards
            </span>
            {savedCards.length > 0 ? (
              <div ref={cardMenuRef} className="relative min-w-0">
                <button
                  onClick={() => setCardMenuOpen((open) => !open)}
                  className="flex min-w-0 items-center gap-2 rounded-2xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 sm:px-4 sm:py-3"
                >
                  <CardBrandIcon brand={savedCards[0].brand} />
                  <span className="truncate">{savedCards[0].last4}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform sm:h-4 sm:w-4",
                      cardMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {cardMenuOpen && (
                  <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1 shadow-xl duration-200">
                    {savedCards.map((card, index) => (
                      <div
                        key={`${card.last4}-${index}`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700"
                      >
                        <CardBrandIcon brand={card.brand} />
                        <span className="min-w-0 flex-1 truncate">
                          •••• {card.last4}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setCardMenuOpen(false);
                        setShowAddCard(true);
                      }}
                      className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-xs font-semibold tracking-[0.14em] text-[#6433CC] transition-colors hover:bg-gray-50 sm:text-sm"
                    >
                      <Plus className="h-4 w-4 shrink-0" />
                      Add New Card
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAddCard(true)}
                className="flex min-w-0 items-center gap-2 rounded-2xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 sm:px-4 sm:py-3"
              >
                <span className="truncate text-xs font-semibold tracking-[0.14em] text-gray-600 sm:text-sm sm:tracking-widest">
                  Add New Card
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1536px]">
        <div className="mb-4">
          <CanceledSubscriptionBanner details={details} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-10 xl:grid-cols-4">
          {/* The free plan is granted, never bought: it offers no CTA beyond
              marking itself as the plan in force. */}
          <PlanCard
            plan={free}
            showSubscribe={companyPlan.isFree}
            isCurrentPlan={companyPlan.isFree}
          />
          {paidPlans.map((paidPlan) => (
            <PlanCard
              key={paidPlan.name}
              plan={paidPlan}
              showSubscribe
              onSubscribe={handleSubscribe}
              subscribeDisabled={!companyId}
              isCurrentPlan={
                companyPlan.isPaid && paidPlan.tier === companyPlan.tier
              }
            />
          ))}
        </div>
      </div>

      {checkoutPlan && companyId && (
        <CheckoutModal
          plan={checkoutPlan}
          companyId={companyId}
          onClose={() => setCheckoutPlan(null)}
        />
      )}

      {showAddCard && (
        <AddCardModal
          onClose={() => setShowAddCard(false)}
          onSubmit={(card) => {
            const last4 = card.cardNumber.slice(-4) || "****";
            addCard({ last4, nameOnCard: card.nameOnCard });
            setShowAddCard(false);
          }}
        />
      )}
    </div>
  );
}
