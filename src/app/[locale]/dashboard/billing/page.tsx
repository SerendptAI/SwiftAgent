"use client";

import { ChevronDown, CreditCard } from "lucide-react";
import { useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { CanceledSubscriptionBanner } from "@/components/dashboard/settings/canceled-subscription-banner";
import { Icons } from "@/components/icons";
import { type Plan, PlanCard } from "@/components/pricing/plan-card";
import { plansFromBackend } from "@/components/pricing/plans";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import {
  useBillingDetails,
  useBillingPlans,
  useCreateCheckout,
} from "@/hooks/use-billing";
import type { SavedCard } from "@/services/billing";
import { useCardStore } from "@/store/card-store";

function CardBrandIcon({ brand }: { brand: string }) {
  if (brand.toLowerCase() === "mastercard") {
    return <Icons.mastercard />;
  }
  return <CreditCard className="h-4 w-4 text-gray-500" />;
}

export default function BillingPage() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const companyId = useActiveCompanyId();
  const { data: details } = useBillingDetails(companyId);
  const { data: backendPlans } = useBillingPlans();
  const createCheckout = useCreateCheckout();
  const { savedCards: localCards, addCard } = useCardStore();
  const plans: Plan[] = plansFromBackend(backendPlans);

  const backendCards: SavedCard[] = details?.saved_cards ?? [];
  const localAsSaved: SavedCard[] = localCards.map((c) => ({
    brand: "mastercard",
    last4: c.last4,
  }));
  const savedCards: SavedCard[] = [...backendCards, ...localAsSaved];
  const activeTier = details?.tier ?? null;

  const handleSubscribe = (plan: Plan) => {
    if (!plan.tier || !companyId) return;
    setCheckoutError("");
    setPendingTier(plan.tier);

    createCheckout.mutate(
      { company_id: companyId, tier: plan.tier },
      {
        onSuccess: ({ checkout_url }) => {
          if (checkout_url) {
            window.location.href = checkout_url;
          } else {
            setPendingTier(null);
          }
        },
        onError: (error: unknown) => {
          setPendingTier(null);
          const data =
            error && typeof error === "object" && "response" in error
              ? (
                  error as {
                    response?: {
                      data?: { message?: string; detail?: string };
                    };
                  }
                ).response?.data
              : undefined;
          setCheckoutError(
            data?.message ||
              data?.detail ||
              "Unable to start checkout. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="flex h-full min-w-0 flex-col pb-6 lg:pb-0">
      <div className="mb-6 flex w-full max-w-[1536px] flex-col gap-3 lg:mb-4 lg:flex-row lg:items-center lg:gap-8">
        <div className="min-w-0 flex-1">
          <CompanyToolbar />
        </div>
        <div className="rounded-[20px] bg-white p-2 shadow-sm lg:h-16 lg:w-[400px] lg:rounded-3xl lg:py-2 lg:pr-2 lg:pl-6">
          <div className="flex w-full items-center justify-between gap-2 text-xs font-semibold text-gray-600 sm:text-sm">
            <span className="shrink-0 tracking-[0.14em] uppercase sm:tracking-widest">
              Saved Cards
            </span>
            {savedCards.length > 0 ? (
              <aside className="flex min-w-0 items-center gap-2 rounded-2xl border border-gray-100 px-3 py-2.5 sm:px-4 sm:py-3">
                <CardBrandIcon brand={savedCards[0].brand} />
                <span className="truncate">{savedCards[0].last4}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
              </aside>
            ) : (
              <button
                onClick={() => setShowAddCard(true)}
                className="flex min-w-0 items-center gap-2 rounded-2xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 sm:px-4 sm:py-3"
              >
                <span className="truncate text-xs font-semibold tracking-[0.14em] text-gray-600 uppercase sm:text-sm sm:tracking-widest">
                  ADD NEW CARD
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="w-full max-w-[1536px]">
        <div className="mb-4">
          <CanceledSubscriptionBanner details={details} />
        </div>
        {checkoutError && (
          <p className="font-stolzl mb-4 text-xs text-red-600 sm:text-sm">
            {checkoutError}
          </p>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {plans.map((plan) => {
            const isActive =
              !!plan.tier && !!activeTier && plan.tier === activeTier;
            const isPending = pendingTier === plan.tier;
            return (
              <PlanCard
                key={plan.name}
                plan={plan}
                showSubscribe
                onSubscribe={handleSubscribe}
                subscribeDisabled={
                  !companyId || isActive || createCheckout.isPending
                }
                subscribeLabel={
                  isActive
                    ? "CURRENT PLAN"
                    : isPending
                      ? "REDIRECTING..."
                      : undefined
                }
              />
            );
          })}
        </div>
      </div>

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
