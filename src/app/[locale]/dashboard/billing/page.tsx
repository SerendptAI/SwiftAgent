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
    <div className="flex h-full flex-col">
      <div className="flex max-w-[1536px] items-center gap-8">
        <div className="flex-1">
          <CompanyToolbar />
        </div>
        <div className="mb-4 h-16 w-[400px] rounded-3xl bg-white py-2 pr-2 pl-6 shadow-sm">
          <div className="gap-4">
            <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold text-gray-600">
              <span className="tracking-widest uppercase">SAVED CARDS</span>
              {savedCards.length > 0 ? (
                <aside className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-3">
                  <CardBrandIcon brand={savedCards[0].brand} />
                  <span>{savedCards[0].last4}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </aside>
              ) : (
                <button
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <span className="text-sm font-semibold tracking-widest text-gray-600 uppercase">
                    ADD NEW CARD
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="w-full max-w-[1536px]">
        <div className="mb-4">
          <CanceledSubscriptionBanner details={details} />
        </div>
        {checkoutError && (
          <p className="font-stolzl mb-4 text-sm text-red-600">
            {checkoutError}
          </p>
        )}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
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
