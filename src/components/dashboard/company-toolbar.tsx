"use client";

import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Company {
  id: string;
  name: string;
  initial?: string;
}

const COMPANIES: Company[] = [
  { id: "1", name: "Serendpt AI", initial: "S" },
  { id: "2", name: "I-FITNESS GYM", initial: "I" },
  { id: "3", name: "TechVentures Inc", initial: "T" },
];

interface CompanyToolbarProps {
  /** Extra action buttons to render on the right side */
  actions?: React.ReactNode;
}

export function CompanyToolbar({ actions }: CompanyToolbarProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company>(COMPANIES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="mb-4 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
      {/* Company Selector Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100"
        >
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
          {selectedCompany.name}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1 shadow-xl duration-200">
            <div className="px-3 py-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Switch Company
            </div>
            {COMPANIES.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  setSelectedCompany(company);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6433CC]/10 text-xs font-bold text-[#6433CC]">
                  {company.initial}
                </div>
                <span className="flex-1 text-left font-medium">
                  {company.name}
                </span>
                {selectedCompany.id === company.id && (
                  <Check className="h-4 w-4 text-[#6433CC]" />
                )}
              </button>
            ))}
            <div className="mx-3 my-1 border-t border-gray-100" />
            <button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#6433CC] transition-colors hover:bg-gray-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-[#6433CC]/30">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-medium">Add new company</span>
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
