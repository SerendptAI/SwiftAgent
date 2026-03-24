"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icons } from "@/components/icons";
import { useCurrentUser } from "@/hooks/use-auth";
import { useChats } from "@/hooks/use-conversations";

// ── Section definitions ─────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  text: string;
  highlight: string;
}

interface SectionResult {
  name: string;
  results: SearchResult[];
}

// Static searchable content per section (labels, plan names, field names, etc.)
const STATIC_CONTENT: Record<string, string[]> = {
  Home: [
    "Visitors",
    "Total Chats",
    "Total Calls",
    "Documents Uploaded",
    "Total Scrapes",
    "Resources",
    "Widget",
    "Embed Code",
    "Company Toolbar",
  ],
  Billing: [
    "Yellow Pill",
    "Purple Pill",
    "Orange Pill",
    "Saved Cards",
    "Per Agent Month",
    "Voice Support",
    "Document Upload",
    "Language",
    "Basic Analytics",
    "Advanced Analytics",
    "Escalation Routing",
    "SLA Guarantees",
    "Premium Compute",
  ],
  Settings: [
    "Personal Email Address",
    "Personal Phone Number",
    "Profile",
    "Integrations",
    "Billings",
    "Notifications",
    "Company Information",
    "Company Identity",
    "Knowledge Sources",
    "Answer Boundaries",
    "Voice Conversation",
  ],
};

function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return `${before}<mark class="bg-transparent text-[#F25430] font-semibold">${match}</mark>${after}`;
}

function truncateAroundMatch(text: string, query: string, maxLen = 60): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, maxLen);
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + query.length + 40);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = ".." + snippet;
  if (end < text.length) snippet = snippet + "..";
  return snippet;
}

// ── Component ───────────────────────────────────────────────────────────────

export function DashboardSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: user } = useCurrentUser();
  const { data: chats } = useChats();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Build search results
  const sections: SectionResult[] = (() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();

    const results: SectionResult[] = [];

    // Home
    const homeResults: SearchResult[] = [];
    for (const item of STATIC_CONTENT.Home) {
      if (item.toLowerCase().includes(q)) {
        homeResults.push({
          id: `home-${item}`,
          text: item,
          highlight: highlightMatch(item, query),
        });
      }
    }
    results.push({ name: "Home", results: homeResults });

    // Ticketing - search through chat sessions
    const ticketResults: SearchResult[] = [];
    if (chats) {
      for (const chat of chats) {
        const sessionLabel = `VIGSHST-${chat.session_id.slice(0, 7).toUpperCase()}`;
        const searchText = `${sessionLabel}: ${chat.message_count} messages`;
        if (
          searchText.toLowerCase().includes(q) ||
          chat.session_id.toLowerCase().includes(q)
        ) {
          ticketResults.push({
            id: `ticket-${chat.id}`,
            text: searchText,
            highlight: highlightMatch(
              truncateAroundMatch(searchText, query),
              query,
            ),
          });
        }
      }
    }
    results.push({ name: "Ticketing", results: ticketResults });

    // Billing
    const billingResults: SearchResult[] = [];
    for (const item of STATIC_CONTENT.Billing) {
      if (item.toLowerCase().includes(q)) {
        billingResults.push({
          id: `billing-${item}`,
          text: item,
          highlight: highlightMatch(item, query),
        });
      }
    }
    results.push({ name: "Billing", results: billingResults });

    // Settings
    const settingsResults: SearchResult[] = [];
    for (const item of STATIC_CONTENT.Settings) {
      if (item.toLowerCase().includes(q)) {
        settingsResults.push({
          id: `settings-${item}`,
          text: item,
          highlight: highlightMatch(item, query),
        });
      }
    }
    // Also search user profile data
    if (user?.email && user.email.toLowerCase().includes(q)) {
      settingsResults.push({
        id: "settings-email",
        text: user.email,
        highlight: highlightMatch(user.email, query),
      });
    }
    if (user?.name && user.name.toLowerCase().includes(q)) {
      settingsResults.push({
        id: "settings-name",
        text: user.name,
        highlight: highlightMatch(user.name, query),
      });
    }
    results.push({ name: "Settings", results: settingsResults });

    return results;
  })();

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search input */}
      <div
        className="font-dm-mono relative w-full"
        style={isOpen && query.trim() ? { zIndex: 9999 } : undefined}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="SEARCH YOUR DASHBOARD"
          className="focus:ring-primary/20 h-10 w-full rounded-full bg-[#EDEDED] px-4 pr-10 text-[16px] outline-none placeholder:text-[16px] focus:ring-2"
        />
        {isOpen && query.trim() ? (
          <button
            onClick={handleClear}
            className="absolute -top-0.5 right-0 m-1 flex h-[90%] w-12 items-center justify-center rounded-full bg-white"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : (
          <Icons.Search className="text-muted-foreground absolute -top-0.5 right-0 m-1 h-[90%] w-12 rounded-full bg-white p-2" />
        )}
      </div>

      {/* Backdrop + Search results dropdown (portalled to body) */}
      {isOpen &&
        query.trim() &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
              className="fixed inset-0 bg-black/80"
              style={{ zIndex: 9998 }}
              onClick={() => setIsOpen(false)}
            />
            <div
              className="fixed max-h-[70vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-lg"
              style={{
                zIndex: 9999,
                top:
                  (containerRef.current?.getBoundingClientRect().bottom ?? 0) +
                  8,
                left: containerRef.current?.getBoundingClientRect().left ?? 0,
                width:
                  containerRef.current?.getBoundingClientRect().width ?? "auto",
              }}
            >
              {sections.map((section) => (
                <div
                  key={section.name}
                  className="my-2 rounded-md border-b border-gray-100 bg-[#F3F3F3] p-4 first:pt-0 last:border-b-0 last:pb-0"
                >
                  {/* Section header */}
                  <div className="mb-3 flex items-baseline gap-3">
                    <h3 className="font-greed-narrow text-2xl font-bold text-black">
                      {section.name}
                    </h3>
                    <span className="font-dm-mono text-xs font-semibold tracking-wider text-black uppercase">
                      &ldquo;{query.trim()}&rdquo;
                    </span>
                    <span className="font-dm-mono text-xs tracking-wider text-gray-400 uppercase">
                      {section.results.length} RESULT
                      {section.results.length !== 1 ? "S" : ""}
                    </span>
                    {section.results.length > 0 && (
                      <span className="ml-auto cursor-pointer rounded-full border border-gray-200 px-3 py-0.5 text-xs font-semibold tracking-wider text-gray-500 uppercase hover:bg-gray-50">
                        SEE ALL
                      </span>
                    )}
                  </div>

                  {/* Results or empty state */}
                  {section.results.length === 0 ? (
                    <div className="flex items-center gap-3 py-2 text-sm text-gray-400">
                      <Icons.notfoundsearch className="h-8 w-8 shrink-0" />
                      <span className="font-dm-mono text-xs tracking-wider uppercase">
                        NO MATCHING INFO FOUND
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {section.results.slice(0, 3).map((result) => (
                        <div
                          key={result.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
                        >
                          <span
                            className="font-dm-mono text-sm text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: result.highlight,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
