"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { Icons } from "@/components/icons";
import { type Plan, PlanCard } from "@/components/pricing/plan-card";
import { useCardStore } from "@/store/card-store";

const PLANS: Plan[] = [
  {
    name: "YELLOW PILL",
    price: "$99",
    billing: "PER AGENT / MONTH",
    description: "BUILT FOR SMALL BUSINESSES\nWITH LOW SUPPORT VOLUME.",
    textColor: "text-[#F3B03D]",
    image: "/images/pricing/icon1.svg",
    features: [
      "1 DEPLOYED AI AGENT",
      "DOCUMENT UPLOAD (UP TO\n10 DOCUMENTS)",
      "VOICE SUPPORT",
      "1 LANGUAGE",
      "BASIC ANSWER BOUNDARIES",
      "BASIC ANALYTICS",
      "ESCALATION TO EMAIL OR\nWHATSAPP",
      "UP TO 800 VOICE MINUTES\nPER MONTH",
      "STANDARD SHARED COMPUTE\nTIER",
    ],
  },
  {
    name: "PURPLE PILL",
    price: "$399",
    billing: "PER AGENT / MONTH",
    description:
      "BUILT FOR STARTUPS AND\nGROWING COMPANIES\nDEPLOYING AI FOR SUPPORT\nOR OPERATIONS.",
    textColor: "text-[#6433CC]",
    image: "/images/pricing/icon2.svg",
    features: [
      "REAL-TIME VOICE SUPPORT",
      "1 LANGUAGE",
      "BASIC ANALYTICS\nDASHBOARD",
      "ESCALATION ROUTING TO\nHUMAN SUPPORT",
      "UP TO 3,000 VOICE\nMINUTES PER MONTH",
      "STANDARD COMPUTE TIER",
      "1 SUPPORTED BLOCKCHAIN\nNETWORK (IF CRYPTO)",
      "EMAIL SUPPORT",
    ],
  },
  {
    name: "ORANGE PILL",
    price: "$1,200",
    billing: "PER AGENT / MONTH",
    description:
      "BUILT FOR HIGH-VOLUME,\nCOMPLIANCE-HEAVY, OR\nMULTI-REGION COMPANIES.",
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
    features: [
      "ADVANCED DOCUMENT\nINGESTION AND PRIORITY\nWEIGHTING",
      "REAL-TIME VOICE WITH\nHIGHER PERFORMANCE TIER",
      "MULTI-LANGUAGE SUPPORT",
      "ADVANCED ANALYTICS AND\nREPORTING",
      "CUSTOM GUARDRAILS AND\nANSWER BOUNDARIES",
      "SLA GUARANTEES",
      "UP TO 10,000 VOICE\nMINUTES PER MONTH",
      "PREMIUM COMPUTE TIER",
      "MULTI-CHAIN SUPPORT (FOR\nCRYPTO)",
      "CUSTOM ESCALATION\nWORKFLOWS…",
    ],
  },
];

export default function BillingPage() {
  const { savedCards, addCard } = useCardStore();
  const [showAddCard, setShowAddCard] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex max-w-7xl items-center gap-8">
        <div className="flex-1">
          <CompanyToolbar />
        </div>
        <div className="mb-4 h-16 w-[400px] rounded-3xl bg-white p-4 py-2 shadow-sm">
          <div className="gap-4">
            <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold text-gray-600">
              <span className="tracking-widest uppercase">SAVED CARDS</span>
              {savedCards.length > 0 ? (
                <aside className="flex items-center gap-2 rounded-2xl border border-gray-100 px-4 py-3">
                  <Icons.mastercard />
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
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} showSubscribe />
          ))}
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
