"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import {
  useActiveCompanyId,
  useSetActiveCompanyId,
} from "@/hooks/use-active-company";
import { useCompaniesQuery } from "@/hooks/use-company";

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

  const companies: Company[] = (rawCompanies ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    initial: c.name.charAt(0).toUpperCase(),
    logoUrl: c.logo_url,
  }));

  const selectedCompany =
    companies.find((c) => c.id === activeCompanyId) ?? companies[0] ?? null;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleSwitch(companyId: string) {
    if (companyId !== activeCompanyId) {
      setActiveCompanyId(companyId);
      // Every company-scoped query bakes the id into its key, so refetching
      // active queries pulls fresh data for the newly selected company.
      queryClient.invalidateQueries();
    }
    setIsOpen(false);
  }

  // Close dropdown when clicking outside
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
    <div className="mb-4 flex items-center justify-between rounded-3xl bg-white p-2 shadow-sm">
      {/* Company Selector Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading || companies.length === 0}
          className="font-dm-mono flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100 disabled:opacity-60"
        >
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
          {isLoading ? (
            <span className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          ) : (
            (selectedCompany?.name ?? "No company")
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 font-dm-mono absolute left-0 z-50 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] duration-200">
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
                  <span className="flex-1 text-left text-sm font-bold tracking-wide text-gray-900 uppercase">
                    {company.name}
                  </span>
                </button>
              );
            })}
            <button className="mt-2 ml-5 flex w-[calc(100%-1.25rem)] items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition-colors hover:bg-gray-50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icons.addnewCompany className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">
                Add New Company
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-3">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6433CC] text-white shadow-lg transition-colors hover:bg-purple-700">
          <Plus className="h-6 w-6" />
        </button>
        {actions}
      </div>
    </div>
  );
}
