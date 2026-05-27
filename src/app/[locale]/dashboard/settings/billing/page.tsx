"use client";

import { ChevronDown, CreditCard } from "lucide-react";
import { useState } from "react";

import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { Icons } from "@/components/icons";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails } from "@/hooks/use-billing";
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
  const companyId = useActiveCompanyId();
  const { data: details } = useBillingDetails(companyId);
  const { savedCards: localCards, addCard } = useCardStore();

  const backendCards: SavedCard[] = details?.saved_cards ?? [];
  const localAsSaved: SavedCard[] = localCards.map((c) => ({
    brand: "mastercard",
    last4: c.last4,
  }));
  const savedCards: SavedCard[] = [...backendCards, ...localAsSaved];

  const presentPlanName = details?.subscription_tier
    ? String(details.subscription_tier).toUpperCase()
    : "FREE";

  return (
    <div className="flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#F2B035]" textColor="text-white" />

      {/* Billing Details */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-base font-bold text-gray-900 sm:text-lg">
          Billing details
        </h3>

        {/* Saved Cards */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-dm-mono text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase sm:text-sm">
            SAVED CARDS
          </span>
          {savedCards.length > 0 ? (
            <button className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 sm:justify-start">
              <CardBrandIcon brand={savedCards[0].brand} />
              <span className="font-dm-mono min-w-0 truncate text-sm font-medium text-gray-700">
                {savedCards[0].last4}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 transition-colors hover:bg-gray-50 sm:justify-start"
            >
              <span className="font-dm-mono min-w-0 truncate text-xs font-semibold tracking-[0.15em] text-gray-600 uppercase sm:text-sm">
                ADD NEW CARD
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            </button>
          )}
        </div>

        {/* Present Plan */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-dm-mono text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase sm:text-sm">
            PRESENT PLAN
          </span>
          <button className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 sm:justify-start">
            <div className="h-4 w-4 rounded-full bg-[#F2B035]" />
            <span className="font-dm-mono min-w-0 truncate text-sm font-medium tracking-wide text-gray-700 uppercase">
              {presentPlanName}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
          </button>
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
