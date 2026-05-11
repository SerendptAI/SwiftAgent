"use client";

import { ChevronDown, CreditCard } from "lucide-react";
import { useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { Icons } from "@/components/icons";
import { type Plan, PlanCard } from "@/components/pricing/plan-card";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails, useCreateCheckout } from "@/hooks/use-billing";
import { useGeoCountry } from "@/hooks/use-geo-country";
import type { SavedCard } from "@/services/billing";
import { useCardStore } from "@/store/card-store";

const GEO_PRICING: Record<string, { price: string; billing: string }[]> = {
  NG: [
    { price: "NGN 25,000", billing: "PER MONTH" },
    { price: "NGN 45,000", billing: "PER MONTH" },
    { price: "NGN 80,000", billing: "PER MONTH" },
  ],
  default: [
    { price: "200 USD", billing: "PER MONTH" },
    { price: "700 USD", billing: "PER MONTH" },
    { price: "1,700 USD", billing: "PER MONTH" },
  ],
};

const BASE_PLANS: Omit<Plan, "price" | "billing">[] = [
  {
    name: "BASIC PLAN",
    tier: "basic",
    description:
      "DESIGNED FOR EARLY STARTUPS\nAND SMALL PROJECTS\nTESTING THE WATERS.",
    textColor: "text-[#F3B03D]",
    image: "/images/pricing/icon1.svg",
    features: [
      "1 DEPLOYED AI AGENT",
      "UP TO 10 DOCUMENT UPLOADS",
      "1 SUPPORTED LANGUAGE",
      "BASIC ANSWER BOUNDARIES",
      "BASIC ANALYTICS REPORTING",
      "UP TO 800 VOICE MINUTES\nPER MONTH",
      "STANDARD SHARED COMPUTE TIER",
      "MAXIMUM OF 1 COMPANY PER\nCORE USER ACCOUNT",
      "UP TO 3 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  {
    name: "PRO PLAN",
    tier: "pro",
    description:
      "GEARED TOWARDS GROWING\nOPERATIONS NEEDING SCALE\nAND HEAVIER WORKLOAD VOLUME.",
    textColor: "text-[#6433CC]",
    image: "/images/pricing/icon2.svg",
    features: [
      "UP TO 3 DEPLOYED AI AGENTS",
      "UP TO 50 DOCUMENT UPLOADS",
      "UP TO 3 SUPPORTED LANGUAGES",
      "ADVANCED ANSWER BOUNDARIES\nFOR NUANCED AGENT RESPONSES",
      "ADVANCED ANALYTICS REPORTING",
      "UP TO 3,000 VOICE MINUTES\nPER MONTH",
      "PRIORITY COMPUTE TIER\n(REDUCES GENERATION LATENCY)",
      "MAXIMUM OF 3 COMPANIES PER\nCORE USER ACCOUNT",
      "UP TO 10 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  {
    name: "ENTERPRISE PLAN",
    tier: "enterprise",
    description:
      "UNCAPPED SCALING FOR\nESTABLISHED OPERATIONS\nAND INTENSIVE NEEDS.",
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
    features: [
      "UNLIMITED DEPLOYED AI AGENTS",
      "UNLIMITED DOCUMENT UPLOADS",
      "ALL SUPPORTED LANGUAGES\n(UNLIMITED)",
      "CUSTOM ANSWER BOUNDARY\nCONTROLS",
      "FULLY CUSTOMIZABLE ANALYTICS",
      "UNLIMITED VOICE MINUTES\nPER MONTH",
      "DEDICATED COMPUTE TIER FOR\nTHE FASTEST RESPONSE TIMES",
      "UNLIMITED COMPANIES",
      "UNLIMITED INVITED MEMBERS\nPER COMPANY",
    ],
  },
];

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
  const createCheckout = useCreateCheckout();
  const country = useGeoCountry();
  const { savedCards: localCards, addCard } = useCardStore();
  const pricing = GEO_PRICING[country ?? "default"] ?? GEO_PRICING.default;
  const plans: Plan[] = BASE_PLANS.map((base, i) => ({
    ...base,
    ...pricing[i],
  }));

  const backendCards: SavedCard[] = details?.saved_cards ?? [];
  const localAsSaved: SavedCard[] = localCards.map((c) => ({
    brand: "mastercard",
    last4: c.last4,
  }));
  const savedCards: SavedCard[] = [...backendCards, ...localAsSaved];
  const activeTier = details?.subscription_tier ?? null;

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
      <div className="w-full max-w-7xl">
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
