"use client";

import { ChevronDown, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

import { AddCardModal } from "@/components/dashboard/settings/add-card-modal";
import { CanceledSubscriptionBanner } from "@/components/dashboard/settings/canceled-subscription-banner";
import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { Icons } from "@/components/icons";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails, useCreatePortalSession } from "@/hooks/use-billing";
import { getApiErrorMessage } from "@/lib/api-error";
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
  const [portalError, setPortalError] = useState<string | null>(null);
  const companyId = useActiveCompanyId();
  const { data: details } = useBillingDetails(companyId);
  const portalSession = useCreatePortalSession();
  const { savedCards: localCards, addCard } = useCardStore();

  const backendCards: SavedCard[] = details?.saved_cards ?? [];
  const localAsSaved: SavedCard[] = localCards.map((c) => ({
    brand: "mastercard",
    last4: c.last4,
  }));
  const savedCards: SavedCard[] = [...backendCards, ...localAsSaved];

  const presentPlanName =
    details?.display_name?.toUpperCase() ||
    (details?.tier ? String(details.tier).toUpperCase() : "FREE");

  const subscriptionStatus =
    details?.subscription_status ?? details?.status ?? null;
  const canManageSubscription =
    !!companyId &&
    (subscriptionStatus === "active" || subscriptionStatus === "canceled");

  const handleManageSubscription = async () => {
    if (!companyId) return;
    setPortalError(null);
    try {
      const { portal_url } = await portalSession.mutateAsync(companyId);
      if (portal_url) {
        window.location.href = portal_url;
      }
    } catch (err) {
      setPortalError(
        getApiErrorMessage(err, "Failed to load subscription portal."),
      );
    }
  };

  return (
    <div className="flex min-h-[450px] flex-col gap-6 rounded-xl bg-white p-4 shadow-sm">
      <HelpBanner bgColor="bg-[#F2B035]" textColor="text-white" />

      <CanceledSubscriptionBanner details={details} />

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

        {canManageSubscription && (
          <div className="flex flex-col gap-2 rounded-xl border border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="font-dm-mono text-sm font-semibold tracking-[0.15em] text-gray-500 uppercase">
                Manage Subscription
              </span>
              <button
                onClick={handleManageSubscription}
                disabled={portalSession.isPending}
                className="font-dm-mono flex items-center gap-2 rounded-2xl bg-[#006BE5] px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#0058C0] disabled:opacity-50"
              >
                {portalSession.isPending ? (
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
            {portalError && (
              <p className="font-stolzl text-xs text-red-500">{portalError}</p>
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
