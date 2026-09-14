"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { CanceledSubscriptionBanner } from "@/components/dashboard/settings/canceled-subscription-banner";
import { CardBrandIcon } from "@/components/dashboard/settings/card-brand-icon";
import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import {
  useBillingDetails,
  useCompanyPlan,
  useOpenBillingPortal,
} from "@/hooks/use-billing";
import { cn } from "@/lib/utils";
import type { SavedCard } from "@/services/billing";
import { useCardStore } from "@/store/card-store";

export default function BillingPage() {
  const [showAddCard, setShowAddCard] = useState(false);
  const companyId = useActiveCompanyId();
  const { data: details, refetch: refetchDetails } =
    useBillingDetails(companyId);
  const companyPlan = useCompanyPlan(companyId);
  const portal = useOpenBillingPortal(companyId);
  const { savedCards: localCards, addCard } = useCardStore();

  const backendCards: SavedCard[] = details?.saved_cards ?? [];
  const localAsSaved: SavedCard[] = localCards.map((c) => ({
    brand: "mastercard",
    last4: c.last4,
  }));
  const savedCards: SavedCard[] = [...backendCards, ...localAsSaved];

  const presentPlanName = companyPlan.isPaid
    ? (details?.display_name ?? String(companyPlan.tier))
    : companyPlan.isFree
      ? "Free"
      : companyPlan.isLoading
        ? "Loading…"
        : "Unavailable";

  const subscriptionStatus =
    details?.subscription_status ?? details?.status ?? null;
  const canManageSubscription =
    companyPlan.isPaid &&
    (subscriptionStatus === "active" || subscriptionStatus === "canceled");

  return (
    <div className="flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#F2B035]" textColor="text-white" />

      <CanceledSubscriptionBanner details={details} />

      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 sm:text-lg">
          Billing details
        </h3>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="text-xs font-semibold tracking-[2%] text-gray-500 sm:text-sm">
            Saved Cards
          </span>
          {savedCards.length > 0 ? (
            <button className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 sm:justify-start">
              <CardBrandIcon brand={savedCards[0].brand} />
              <span className="min-w-0 truncate text-sm font-medium text-gray-700">
                {savedCards[0].last4}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 transition-colors hover:bg-gray-50 sm:justify-start"
            >
              <span className="min-w-0 truncate text-xs font-semibold tracking-[2%] text-gray-600 sm:text-sm">
                Add New Card
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="text-xs font-semibold tracking-[2%] text-gray-500 sm:text-sm">
            Present Plan
          </span>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <button className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 sm:justify-start">
              <div
                className={cn(
                  "h-4 w-4 rounded-full",
                  companyPlan.isPaid || companyPlan.isFree
                    ? "bg-[#F2B035]"
                    : "bg-gray-300",
                )}
              />
              <span className="min-w-0 truncate text-sm font-medium tracking-[2%] text-gray-700">
                {presentPlanName}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            </button>
            {companyPlan.isError && (
              <button
                onClick={() => refetchDetails()}
                className="cursor-pointer text-xs text-red-500 underline underline-offset-2"
              >
                Couldn&apos;t load your subscription. Try again.
              </button>
            )}
          </div>
        </div>

        {canManageSubscription && (
          <div className="flex flex-col gap-2 rounded-xl border border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tracking-[2%] text-gray-500">
                Manage Subscription
              </span>
              <button
                onClick={portal.open}
                disabled={portal.isPending}
                className="flex items-center gap-2 rounded-2xl bg-[#006BE5] px-6 py-2.5 text-sm font-bold tracking-[2%] text-white shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#0058C0] disabled:opacity-50"
              >
                {portal.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opening…
                  </>
                ) : subscriptionStatus === "canceled" ? (
                  "Reactivate or Manage"
                ) : (
                  "Manage Subscription"
                )}
              </button>
            </div>
            {portal.error && (
              <p className="text-xs text-red-500">{portal.error}</p>
            )}
          </div>
        )}
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
