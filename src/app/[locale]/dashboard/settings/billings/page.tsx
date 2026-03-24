"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { Icons } from "@/components/icons";

interface SavedCard {
  last4: string;
}

const PRESENT_PLAN = { label: "PRESENT PLAN", name: "FREE" };

export default function BillingsPage() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

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
          <div className="flex items-center gap-3">
            {savedCards.length > 0 ? (
              <button className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5">
                <Icons.mastercard />
                <span className="font-dm-mono text-sm font-medium text-gray-700">
                  {savedCards[0].last4}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              <span className="font-dm-mono text-sm text-gray-400">
                No cards saved
              </span>
            )}
            <button
              onClick={() => setShowAddCard(true)}
              className="font-dm-mono rounded-lg bg-[#006BE5] px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#1E88E5]"
            >
              + Add Card
            </button>
          </div>
        </div>

        {/* Present Plan */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-6 py-4">
          <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
            {PRESENT_PLAN.label}
          </span>
          <button className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-2.5">
            <div className="h-4 w-4 rounded-full bg-[#F2B035]" />
            <span className="font-dm-mono text-sm font-medium tracking-wide text-gray-700 uppercase">
              {PRESENT_PLAN.name}
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
            setSavedCards((prev) => [...prev, { last4 }]);
            setShowAddCard(false);
          }}
        />
      )}
    </div>
  );
}
