"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { Icons } from "@/components/icons";

interface DashboardSearchToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchPlaceholder: string;
}

export function DashboardSearchToolbar({
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder,
}: DashboardSearchToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    const id = window.setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [isSearchOpen]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    onSearchQueryChange("");
  };

  return (
    <>
      <div className="relative hidden w-full items-center gap-6 lg:flex">
        <div
          aria-hidden={isSearchOpen}
          className={`w-[calc(100%-5rem)] transition-opacity duration-500 ease-out ${
            isSearchOpen ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <CompanyToolbar />
        </div>
        <div className="mb-4 h-14 w-14" aria-hidden />
        <div
          role={isSearchOpen ? undefined : "button"}
          tabIndex={isSearchOpen ? undefined : 0}
          aria-label={isSearchOpen ? undefined : "Open search"}
          onClick={() => {
            if (!isSearchOpen) setIsSearchOpen(true);
          }}
          onKeyDown={(e) => {
            if (!isSearchOpen && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setIsSearchOpen(true);
            }
          }}
          className={`absolute top-[calc(50%-8px)] right-0 flex h-14 -translate-y-1/2 items-center overflow-hidden transition-all duration-500 ease-out ${
            isSearchOpen
              ? "w-full cursor-default rounded-3xl border border-[#EDEDED] bg-white px-4 shadow-sm"
              : "w-14 cursor-pointer justify-center rounded-3xl border border-transparent bg-[#006BE5] hover:bg-[#1E88E5]"
          }`}
        >
          <div
            className={`flex shrink-0 items-center justify-center transition-all duration-500 ease-out ${
              isSearchOpen
                ? "h-9 w-9 rounded-full bg-[#006BE5] p-1.5"
                : "h-7 w-7"
            }`}
          >
            <Icons.SearchWhite className="h-full w-full text-white" />
          </div>

          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSearch();
            }}
            placeholder={searchPlaceholder}
            tabIndex={isSearchOpen ? 0 : -1}
            aria-hidden={!isSearchOpen}
            className={`min-w-0 bg-transparent text-sm tracking-wider text-black transition-opacity duration-500 ease-out placeholder:text-black/40 focus:outline-none ${
              isSearchOpen
                ? "ml-3 flex-1 opacity-100 delay-200"
                : "w-0 opacity-0"
            }`}
          />

          <button
            type="button"
            aria-label="Close search"
            onClick={(e) => {
              e.stopPropagation();
              closeSearch();
            }}
            tabIndex={isSearchOpen ? 0 : -1}
            aria-hidden={!isSearchOpen}
            className={`flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-black/60 transition-all duration-500 ease-out hover:bg-black/5 hover:text-black ${
              isSearchOpen
                ? "ml-1 w-8 opacity-100 delay-200"
                : "pointer-events-none w-0 opacity-0"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-stretch gap-6 sm:items-center lg:hidden">
        <div className="min-w-0 flex-1">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex shrink-0 items-center self-stretch">
          <button
            type="button"
            aria-label="Open search"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-3xl bg-[#006BE5] text-white transition-colors hover:bg-[#1E88E5]"
          >
            <Icons.SearchWhite className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
}
