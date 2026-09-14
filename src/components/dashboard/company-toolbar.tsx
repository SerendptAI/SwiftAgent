"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import {
  useActiveCompanyId,
  useSetActiveCompanyId,
} from "@/hooks/use-active-company";
import { useBillingDetails, useBillingPlans } from "@/hooks/use-billing";
import { useCompaniesQuery } from "@/hooks/use-company";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { FREE_TIER } from "@/services/billing";

import { UpgradePlanModal } from "./upgrade-plan-modal";

/**
 * Safety net only — used when the backend's plans payload doesn't yet expose
 * `companies_limit`. Numbers mirror the bullets in messages/<locale>/pricing.json.
 */
const FALLBACK_COMPANY_LIMITS: Record<string, number> = {
  [FREE_TIER]: 1,
  basic: 1,
  pro: 3,
  enterprise: Infinity,
};

interface Company {
  id: string;
  name: string;
  initial?: string;
  logoUrl?: string;
}

interface CompanyToolbarProps {
  /** Extra action buttons to render on the right side */
  actions?: React.ReactNode;
}

export function CompanyToolbar({ actions }: CompanyToolbarProps) {
  const { data: rawCompanies, isLoading } = useCompaniesQuery();
  const activeCompanyId = useActiveCompanyId();
  const setActiveCompanyId = useSetActiveCompanyId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  const companies: Company[] = (rawCompanies ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    initial: c.name.charAt(0).toUpperCase(),
    logoUrl: c.logo_url,
  }));

  const selectedCompany =
    companies.find((c) => c.id === activeCompanyId) ?? companies[0] ?? null;

  const [isOpen, setIsOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useScrollLock(isOpen);

  const { data: billingDetails } = useBillingDetails(activeCompanyId);
  const { data: backendPlans } = useBillingPlans();

  function getCompanyLimit(): number {
    const tier = billingDetails?.tier ?? FREE_TIER;
    const backendLimit = backendPlans?.[tier]?.companies_limit;
    // Backend `null` = unlimited; a number = explicit cap; missing = fallback.
    if (backendLimit === null) return Infinity;
    if (typeof backendLimit === "number") return backendLimit;
    return FALLBACK_COMPANY_LIMITS[tier] ?? 1;
  }

  function handleAddCompanyClick() {
    setIsOpen(false);
    // Only block when we actually have billing data; otherwise let the backend
    // enforce so a momentary load doesn't trap users.
    if (billingDetails && companies.length >= getCompanyLimit()) {
      setShowUpgradeModal(true);
    } else {
      router.push(`/${locale}/onboarding?new_company=1`);
    }
  }

  function handleSwitch(companyId: string) {
    if (companyId !== activeCompanyId) {
      setActiveCompanyId(companyId);
      // Every company-scoped query bakes the id into its key, so refetching
      // active queries pulls fresh data for the newly selected company.
      queryClient.invalidateQueries();
    }
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[20px] bg-white p-2 shadow-sm md:rounded-3xl">
      <div ref={dropdownRef} className="relative min-w-0 flex-1 sm:flex-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading || companies.length === 0}
          className="flex max-w-full items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 transition-colors hover:bg-gray-100 disabled:opacity-60"
        >
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
          {isLoading ? (
            <span className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          ) : (
            <span className="min-w-0 truncate">
              {selectedCompany?.name ?? "No company"}
            </span>
          )}
        </button>

        {isOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] cursor-default bg-black/30 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={() => setIsOpen(false)}
          />
        )}

        {isOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 z-[70] mt-2 w-[min(calc(100vw-2rem),20rem)] rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] duration-200">
            {companies.map((company) => {
              const isSelected = selectedCompany?.id === company.id;
              return (
                <button
                  key={company.id}
                  onClick={() => handleSwitch(company.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm text-gray-900 transition-colors hover:bg-gray-50"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      isSelected ? "bg-[#6433CC]" : "bg-transparent"
                    }`}
                  />
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-[#6433CC]">
                        {company.initial}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left text-sm font-bold tracking-wide text-gray-900">
                    {company.name}
                  </span>
                </button>
              );
            })}
            <button
              onClick={handleAddCompanyClick}
              className="mt-2 ml-5 flex w-[calc(100%-1.25rem)] items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icons.addnewCompany className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold tracking-wide">
                Add New Company
              </span>
            </button>
          </div>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}

      <UpgradePlanModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
