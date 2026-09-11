"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icons } from "@/components/icons";
import { useCurrentUser } from "@/hooks/use-auth";
import { useAllChatDetails, useChats } from "@/hooks/use-conversations";
import { useRouter } from "@/i18n/navigation";
import { resolveAvatarUrl } from "@/lib/avatar";

interface SearchResult {
  id: string;
  text: string;
  highlight: string;
  route?: string;
  avatar?: string;
}

interface SectionResult {
  name: string;
  results: SearchResult[];
}

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
    "Company",
    "Billing",
    "Security",
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

export function DashboardSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: chats } = useChats();
  const chatDetails = useAllChatDetails();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setFocusedSection(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const sections: SectionResult[] = (() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();

    const results: SectionResult[] = [];

    const homeResults: SearchResult[] = [];
    for (const item of STATIC_CONTENT.Home) {
      if (item.toLowerCase().includes(q)) {
        homeResults.push({
          id: `home-${item}`,
          text: item,
          highlight: highlightMatch(item, query),
          route: "/dashboard",
        });
      }
    }
    results.push({ name: "Home", results: homeResults });

    const ticketResults: SearchResult[] = [];
    if (chats) {
      for (let ci = 0; ci < chats.length; ci++) {
        const chat = chats[ci];
        const sessionLabel = `VIGSHST-${chat.session_id.slice(0, 7).toUpperCase()}`;
        const detail = chatDetails[ci]?.data;
        const messages = detail?.messages ?? [];

        const matchedMessage = messages.find((m) =>
          m.content.toLowerCase().includes(q),
        );

        const sessionMatch =
          sessionLabel.toLowerCase().includes(q) ||
          chat.session_id.toLowerCase().includes(q);

        if (matchedMessage) {
          const snippet = truncateAroundMatch(matchedMessage.content, query);
          ticketResults.push({
            id: `ticket-${chat.id}`,
            text: matchedMessage.content,
            highlight: `<span class="text-gray-400">${sessionLabel}:</span> ${highlightMatch(snippet, query)}`,
            route: `/dashboard/ticketing?chat=${chat.id}`,
            avatar: resolveAvatarUrl(chat.avatar),
          });
        } else if (sessionMatch) {
          const searchText = `${sessionLabel}: ${chat.message_count} messages`;
          ticketResults.push({
            id: `ticket-${chat.id}`,
            text: searchText,
            highlight: highlightMatch(
              truncateAroundMatch(searchText, query),
              query,
            ),
            route: `/dashboard/ticketing?chat=${chat.id}`,
            avatar: resolveAvatarUrl(chat.avatar),
          });
        }
      }
    }
    results.push({ name: "Ticketing", results: ticketResults });

    const billingResults: SearchResult[] = [];
    for (const item of STATIC_CONTENT.Billing) {
      if (item.toLowerCase().includes(q)) {
        billingResults.push({
          id: `billing-${item}`,
          text: item,
          highlight: highlightMatch(item, query),
          route: "/dashboard/billing",
        });
      }
    }
    results.push({ name: "Billing", results: billingResults });

    const settingsResults: SearchResult[] = [];
    const SETTINGS_ROUTES: Record<string, string> = {
      "Personal Email Address": "/dashboard/settings",
      "Personal Phone Number": "/dashboard/settings",
      Profile: "/dashboard/settings",
      Company: "/dashboard/settings/company",
      Billing: "/dashboard/settings/billing",
      Security: "/dashboard/settings/security",
      "Company Information": "/dashboard/settings/company",
      "Company Identity": "/dashboard/settings/company",
      "Knowledge Sources": "/dashboard/settings/company",
      "Answer Boundaries": "/dashboard/settings/company",
      "Voice Conversation": "/dashboard/settings/company",
    };
    for (const item of STATIC_CONTENT.Settings) {
      if (item.toLowerCase().includes(q)) {
        settingsResults.push({
          id: `settings-${item}`,
          text: item,
          highlight: highlightMatch(item, query),
          route: SETTINGS_ROUTES[item] || "/dashboard/settings",
        });
      }
    }
    if (user?.email && user.email.toLowerCase().includes(q)) {
      settingsResults.push({
        id: "settings-email",
        text: user.email,
        highlight: highlightMatch(user.email, query),
        route: "/dashboard/settings",
      });
    }
    if (user?.name && user.name.toLowerCase().includes(q)) {
      settingsResults.push({
        id: "settings-name",
        text: user.name,
        highlight: highlightMatch(user.name, query),
        route: "/dashboard/settings",
      });
    }
    results.push({ name: "Settings", results: settingsResults });

    return results;
  })();

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setFocusedSection(null);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-full">
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
            setFocusedSection(null);
            if (e.target.value.trim()) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="SEARCH YOUR DASHBOARD"
          className="focus:ring-primary/20 h-11 w-full rounded-full bg-[#EDEDED] px-4 pr-10 text-[16px] outline-none placeholder:text-[13px] focus:ring-2 sm:placeholder:text-[16px] md:h-10"
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

      {isOpen &&
        query.trim() &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <style>{`
              @keyframes searchFadeIn {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes searchSlideIn {
                from { opacity: 0; transform: translateX(-6px); }
                to { opacity: 1; transform: translateX(0); }
              }
            `}</style>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
              className="fixed inset-0 bg-black/80"
              style={{ zIndex: 9998 }}
              onClick={() => setIsOpen(false)}
            />
            <div
              ref={dropdownRef}
              className="fixed max-h-[70vh] overflow-y-auto rounded-2xl bg-white p-3 shadow-lg sm:p-4 [&_.search-result]:animate-[searchSlideIn_0.2s_ease-out_both] [&_.search-section]:animate-[searchFadeIn_0.25s_ease-out] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
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
              {sections
                .filter((s) => !focusedSection || s.name === focusedSection)
                .map((section) => {
                  const isFocused = focusedSection === section.name;
                  const displayResults = isFocused
                    ? section.results
                    : section.results.slice(0, 3);

                  return (
                    <div
                      key={`${section.name}-${isFocused}`}
                      className="search-section my-2 rounded-md border-b border-gray-100 bg-[#F3F3F3] p-4 first:pt-0 last:border-b-0 last:pb-0"
                    >
                      <div className="mb-3 flex flex-wrap items-baseline gap-2 sm:gap-3">
                        <h3 className="font-greed text-xl font-bold text-black sm:text-2xl">
                          {section.name}
                        </h3>
                        <span className="font-dm-mono max-w-full truncate text-xs font-semibold tracking-wider text-black uppercase">
                          &ldquo;{query.trim()}&rdquo;
                        </span>
                        <span className="font-dm-mono text-xs tracking-wider text-gray-400 uppercase">
                          {section.results.length} RESULT
                          {section.results.length !== 1 ? "S" : ""}
                        </span>
                        {section.results.length > 0 && !isFocused && (
                          <button
                            onClick={() => setFocusedSection(section.name)}
                            className="ml-auto cursor-pointer rounded-full border border-gray-200 px-3 py-0.5 text-xs font-semibold tracking-wider text-gray-500 uppercase hover:bg-gray-50"
                          >
                            SEE ALL
                          </button>
                        )}
                        {isFocused && (
                          <button
                            onClick={() => setFocusedSection(null)}
                            className="ml-auto cursor-pointer rounded-full border border-gray-200 px-3 py-0.5 text-xs font-semibold tracking-wider text-gray-500 uppercase hover:bg-gray-50"
                          >
                            BACK
                          </button>
                        )}
                      </div>

                      {section.results.length === 0 ? (
                        <div className="flex items-center gap-3 py-2 text-sm text-gray-400">
                          <Icons.notfoundsearch className="h-8 w-8 shrink-0" />
                          <span className="font-dm-mono text-xs tracking-wider uppercase">
                            NO MATCHING INFO FOUND
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {displayResults.map((result, i) => (
                            <button
                              key={result.id}
                              type="button"
                              className="search-result flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-gray-50"
                              style={{ animationDelay: `${i * 30}ms` }}
                              onClick={() => {
                                if (result.route) {
                                  router.push(result.route);
                                  handleClear();
                                }
                              }}
                            >
                              {section.name === "Ticketing" &&
                                result.avatar && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={result.avatar}
                                    alt=""
                                    className="h-8 w-8 shrink-0 rounded"
                                  />
                                )}
                              <span
                                className="font-dm-mono text-sm text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: result.highlight,
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
