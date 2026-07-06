"use client";

import { FileText, Globe, X } from "lucide-react";
import type { ReactNode } from "react";

function Crumb({
  icon,
  label,
  active,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`font-dm-mono flex items-center gap-1.5 text-[13px] tracking-[0.06em] uppercase ${
        active ? "font-semibold text-black" : "text-black/35"
      }`}
    >
      {icon}
      {label}
    </span>
  );
}

export function CountPill({ children }: { children: ReactNode }) {
  return (
    <span className="font-dm-mono rounded-md bg-[#F3F3F3] px-2 py-0.5 text-[11px] tracking-wide text-black/55 uppercase">
      {children}
    </span>
  );
}

export function ActionLink({
  label,
  onClick,
  colorClass,
}: {
  label: string;
  onClick: () => void;
  colorClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-dm-mono cursor-pointer text-[13px] font-medium tracking-[0.04em] uppercase transition-opacity hover:opacity-70 ${colorClass}`}
    >
      {label}
    </button>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F0F0F0] py-3.5 last:border-b-0">
      {children}
    </div>
  );
}

export function ManagerShell({
  title,
  level,
  isBusy,
  onClose,
  onCrumb,
  children,
  overlay,
}: {
  title: string;
  level: 0 | 1 | 2;
  isBusy: boolean;
  onClose: () => void;
  onCrumb: (level: 0 | 1) => void;
  children: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center px-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={isBusy ? undefined : onClose}
        disabled={isBusy}
      />

      <section
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="font-dm-mono text-2xl font-bold tracking-[-0.01em] text-black">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isBusy}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-black/50 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-[#EDEDED] px-6 pb-3">
          <button
            type="button"
            onClick={() => onCrumb(0)}
            className="cursor-pointer"
          >
            <Crumb
              icon={<Globe className="h-4 w-4" />}
              label="Website"
              active={level === 0}
            />
          </button>
          <span className="text-black/25">→</span>
          <button
            type="button"
            disabled={level < 1}
            onClick={() => onCrumb(1)}
            className="cursor-pointer disabled:cursor-default"
          >
            <Crumb
              icon={<FileText className="h-4 w-4" />}
              label="Page"
              active={level === 1}
            />
          </button>
          <span className="text-black/25">→</span>
          <Crumb
            icon={<FileText className="h-4 w-4" />}
            label="Form"
            active={level === 2}
          />
        </div>

        <div className="px-6 py-6">{children}</div>

        <div className="flex justify-end border-t border-[#EDEDED] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="font-dm-mono cursor-pointer rounded-lg border border-[#E5E5E5] px-5 py-2 text-sm text-black/70 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>

        {overlay}
      </section>
    </div>
  );
}
