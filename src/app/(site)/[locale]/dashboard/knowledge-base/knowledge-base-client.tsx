"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CompanyToolbar } from "@/components/dashboard/company-toolbar";
import { KnowledgeChatPreview } from "@/components/dashboard/knowledge/knowledge-chat-preview";
import { KnowledgeEntryList } from "@/components/dashboard/knowledge/knowledge-entry-list";
import { Icons } from "@/components/icons";

export function KnowledgeBaseClient() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    const id = window.setTimeout(() => searchInputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [isSearchOpen]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-4 lg:h-full lg:min-h-0 lg:gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 flex-1">
          <CompanyToolbar />
        </div>
        <div className="mb-4 flex shrink-0 items-center gap-3 self-stretch">
          {isSearchOpen && (
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") closeSearch();
              }}
              placeholder="Search knowledge base entries"
              className="h-12 min-w-0 flex-1 rounded-2xl border border-[#EDEDED] bg-white px-4 text-sm text-black outline-none placeholder:text-black/40 sm:h-14 sm:w-64"
            />
          )}
          <button
            type="button"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            onClick={() =>
              isSearchOpen ? closeSearch() : setIsSearchOpen(true)
            }
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-[#006BE5] text-white transition-colors hover:bg-[#1E88E5] sm:h-14 sm:w-14"
          >
            {isSearchOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Icons.SearchWhite className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-8">
        <KnowledgeEntryList searchQuery={searchQuery} />
        <KnowledgeChatPreview />
      </div>
    </div>
  );
}
