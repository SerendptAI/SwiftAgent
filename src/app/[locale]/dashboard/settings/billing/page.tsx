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
    <div className="flex min-h-[450px] flex-col gap-6 rounded-xl bg-white p-4 shadow-sm">
      <HelpBanner bgColor="bg-[#F2B035]" textColor="text-white" />

      {/* Billing Details */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-lg font-bold text-gray-900">
          Billing details
        </h3>

        {/* Saved Cards */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            SAVED CARDS
          </span>
          {savedCards.length > 0 ? (
            <button className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5">
              <CardBrandIcon brand={savedCards[0].brand} />
              <span className="font-dm-mono text-sm font-medium text-gray-700">
                {savedCards[0].last4}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5 transition-colors hover:bg-gray-50"
            >
              <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-600 uppercase">
                ADD NEW CARD
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Present Plan */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            PRESENT PLAN
          </span>
          <button className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5">
            <div className="h-4 w-4 rounded-full bg-[#F2B035]" />
            <span className="font-dm-mono text-sm font-medium tracking-wide text-gray-700 uppercase">
              {presentPlanName}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
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
