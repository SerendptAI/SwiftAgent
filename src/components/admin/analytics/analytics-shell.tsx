"use client";

import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { DATE_RANGES, DateRange, TabId, TABS } from "@/lib/admin-analytics";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function AnalyticsNavbar() {
  return (
    <header className="flex items-center justify-between border-b-2 border-[rgba(31,31,31,0.1)] bg-white px-10 py-3">
      <div className="flex items-center gap-3">
        <div className="relative size-9 overflow-hidden rounded-[4px] border-2 border-[rgba(31,31,31,0.1)]">
          <Image src="/favicon/favicon.svg" alt="Swift Agents" fill priority />
        </div>
        <span className="font-greed-narrow text-[20px] tracking-[-0.4px] text-[#1f1f1f]">
          SWIFT AGENTS
        </span>
      </div>
      <nav className="flex items-center gap-8">
        <a
          href={`${siteConfig.url}/docs`}
          target="_blank"
          rel="noreferrer"
          className="font-dm-mono text-[14px] text-[#1f1f1f] uppercase transition-opacity hover:opacity-60"
        >
          Docs
        </a>
        <Link
          href="/dashboard/settings"
          className="font-dm-mono text-[14px] text-[#1f1f1f] uppercase transition-opacity hover:opacity-60"
        >
          Support
        </Link>
        <Image
          src="/images/affiliate/avatar-brown.png"
          alt="Your profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      </nav>
    </header>
  );
}

export function AnalyticsTabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Analytics views"
      className="flex gap-4 overflow-x-auto border-b-2 border-[rgba(31,31,31,0.1)] bg-white px-10"
    >
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={cn(
              "font-dm-mono shrink-0 border-b-[3px] px-3 py-2 text-[14px] font-medium whitespace-nowrap uppercase transition-colors",
              isActive
                ? "border-[rgba(100,51,204,0.1)] text-[#6433cc]"
                : "border-[rgba(0,0,0,0.1)] text-[#7e7e7e] hover:text-[#1f1f1f]",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export function AnalyticsControls({
  range,
  onRangeChange,
  onExport,
  exporting,
}: {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  onExport: () => void;
  exporting?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-10 py-3">
      <div className="flex items-center gap-3">
        <span className="font-dm-mono text-[12px] text-[#7e7e7e] uppercase">
          Current View:
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="font-dm-mono rounded-[4px] border-[1.5px] border-[rgba(31,31,31,0.1)] bg-white px-3 py-1.5 text-[12px] text-[#1f1f1f] uppercase transition-colors hover:border-[rgba(31,31,31,0.25)]">
            {range}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={range}
              onValueChange={(value) => onRangeChange(value as DateRange)}
            >
              {DATE_RANGES.map((option) => (
                <DropdownMenuRadioItem
                  key={option}
                  value={option}
                  className="font-dm-mono text-[12px] uppercase"
                >
                  {option}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <button
        onClick={onExport}
        disabled={exporting}
        className="font-dm-mono rounded-[6px] border-2 border-[rgba(31,31,31,0.1)] bg-[#6433cc] px-4 py-2 text-[12px] text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {exporting ? "Exporting…" : "Export Report"}
      </button>
    </div>
  );
}
