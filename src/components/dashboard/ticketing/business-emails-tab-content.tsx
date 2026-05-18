"use client";

import { CheckSquare, Hourglass, Settings } from "lucide-react";
import Image from "next/image";

interface BusinessEmailsEmptyStateProps {
  lines: string[];
  variant: "list" | "detail";
}

function EmptyStateCenter({ lines }: { lines: string[] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/email-mailbox-open.svg"
          alt=""
          width={66}
          height={66}
          className="aspect-[66/66] w-full max-w-[66px]"
        />
        <p className="font-dm-mono text-center text-sm leading-[1.39] font-normal tracking-[0.1em] text-black/60 uppercase">
          {lines.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

function EmptyStateTopControls({ variant }: { variant: "list" | "detail" }) {
  if (variant === "list") {
    return (
      <div className="absolute top-9 left-10 z-10">
        <h2 className="font-dm-mono text-2xl font-bold tracking-[-0.02em] text-black uppercase">
          Inbox
        </h2>
      </div>
    );
  }

  return (
    <div className="absolute top-7 right-8 left-8 z-10 flex items-center justify-between gap-6">
      <div className="flex min-w-0 items-center gap-8">
        <button
          type="button"
          className="font-stolzl flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-[#808080] px-5 text-base font-normal text-white"
        >
          <Hourglass className="h-5 w-5 shrink-0" />
          <span>Unread</span>
        </button>
        <button
          type="button"
          className="font-stolzl flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-[#F6F6F6] px-5 text-base font-normal text-black"
        >
          <CheckSquare className="h-5 w-5 shrink-0" />
          <span>Read</span>
        </button>
      </div>
      <button
        type="button"
        aria-label="Business email settings"
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl text-black transition-colors hover:bg-[#F6F6F6]"
      >
        <Settings className="h-7 w-7" />
      </button>
    </div>
  );
}

function BusinessEmailsEmptyState({
  lines,
  variant,
}: BusinessEmailsEmptyStateProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-sm">
      <EmptyStateTopControls variant={variant} />
      <EmptyStateCenter lines={lines} />
    </div>
  );
}

export function BusinessEmailsTabContent() {
  return (
    <div className="grid min-w-0 flex-1 grid-cols-12 gap-8">
      <div className="col-span-7 min-w-0">
        <BusinessEmailsEmptyState
          variant="list"
          lines={["SELECT A MESSAGE", "TO VIEW IT"]}
        />
      </div>
      <div className="col-span-5 min-w-0">
        <BusinessEmailsEmptyState
          variant="detail"
          lines={["NOTHING HERE FOR", "NOW"]}
        />
      </div>
    </div>
  );
}
