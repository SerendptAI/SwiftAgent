"use client";

import { FileText, Globe, X } from "lucide-react";
import type { ReactNode } from "react";

export function PixelTrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 85.04 89.54" fill="currentColor" className={className}>
      <path d="M71.6163 22.3838V71.6162H76.1106V22.3838H85.0406V17.9187H80.5756V13.4244H62.6569V4.465H58.1919V13.4244H26.8488V4.465H22.3838V13.4244H4.49438V17.9187H0V22.3838H8.95937V71.6162H13.4244V22.3838H71.6163Z" />
      <path d="M71.6163 71.6162H67.1513V85.0406H71.6163V71.6162Z" />
      <path d="M67.1513 85.0406H17.9188V89.535H67.1513V85.0406Z" />
      <path d="M62.6569 31.3431H58.1919V67.1513H62.6569V31.3431Z" />
      <path d="M58.1919 67.1513H53.7269V76.0813H58.1919V67.1513Z" />
      <path d="M44.7675 31.3431H40.3025V76.0812H44.7675V31.3431Z" />
      <path d="M58.1919 0H26.8488V4.465H58.1919V0Z" />
      <path d="M31.3431 67.1513H26.8488V76.0813H31.3431V67.1513Z" />
      <path d="M26.8487 31.3431H22.3838V67.1513H26.8487V31.3431Z" />
      <path d="M17.9188 71.6162H13.4244V85.0406H17.9188V71.6162Z" />
    </svg>
  );
}

export function FormCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      className={className}
    >
      <path
        d="M11.2354 5.26167C11.2354 5.26167 11.6104 5.63667 11.9854 6.38667C11.9854 6.38667 13.1765 4.51167 14.2354 4.13667"
        strokeLinejoin="round"
      />
      <path
        d="M7.49618 1.516C5.62233 1.43667 4.17464 1.65254 4.17464 1.65254C3.2605 1.7179 1.50864 2.23039 1.50865 5.2234C1.50867 8.19097 1.48927 11.8495 1.50865 13.3079C1.50865 14.199 2.06037 16.2775 3.96999 16.3889C6.29112 16.5243 10.4721 16.5531 12.3904 16.3889C12.9039 16.3599 14.6135 15.9568 14.8299 14.0967C15.0541 12.1697 15.0095 10.8305 15.0095 10.5118"
        strokeLinejoin="round"
      />
      <path d="M16.4994 5.26166C16.4994 7.33272 14.8189 9.01169 12.7458 9.01169C10.6727 9.01169 8.99219 7.33272 8.99219 5.26166C8.99219 3.19059 10.6727 1.51166 12.7458 1.51166C14.8189 1.51166 16.4994 3.19059 16.4994 5.26166Z" />
      <path d="M5.2354 9.7617H8.23538" />
      <path d="M5.23438 12.7617H11.2344" />
    </svg>
  );
}

export function PathChip({ children }: { children: ReactNode }) {
  return (
    <span className="flex max-w-full min-w-0 items-center gap-[5px] rounded-[15px] bg-[#F6F6F6] px-2 py-[7px]">
      <Globe className="h-[18px] w-[18px] shrink-0 text-[#7E7E7E]" />
      <span className="font-dm-mono min-w-0 truncate text-[11px] text-[#7E7E7E] uppercase">
        {children}
      </span>
    </span>
  );
}

export function CountPill({ children }: { children: ReactNode }) {
  return (
    <span className="font-dm-mono rounded-[10px] bg-[#F6F6F6] px-2 py-0.5 text-[11px] whitespace-nowrap text-[#7E7E7E] uppercase">
      {children}
    </span>
  );
}

export function ActionLink({
  label,
  onClick,
  colorClass,
  uppercase = true,
}: {
  label: string;
  onClick: () => void;
  colorClass: string;
  uppercase?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-dm-mono cursor-pointer text-[16px] font-medium whitespace-nowrap transition-opacity hover:opacity-70 ${
        uppercase ? "uppercase" : ""
      } ${colorClass}`}
    >
      {label}
    </button>
  );
}

export function SolidActionButton({
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
      className={`font-dm-mono h-7 cursor-pointer rounded-[6px] px-3 text-[11px] font-medium whitespace-nowrap text-white uppercase transition-opacity hover:opacity-85 ${colorClass}`}
    >
      {label}
    </button>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[52px] items-center justify-between gap-3 border-b border-[#EDEDED] px-1">
      {children}
    </div>
  );
}

export function SectionIntro({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-dm-mono text-[16px] font-medium text-[#7E7E7E] uppercase">
        {title}
      </p>
      <p className="font-stolzl text-[14px] font-normal text-[#7E7E7E]">
        {sub}
      </p>
    </div>
  );
}

export function HintText({ children }: { children: ReactNode }) {
  return (
    <p className="font-stolzl text-[12px] font-normal text-[#7E7E7E]/60">
      {children}
    </p>
  );
}

export function CancelButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="font-dm-mono flex h-9 w-20 cursor-pointer items-center justify-center rounded-[8px] border border-[#EDEDED] text-[13px] text-[#7E7E7E] uppercase transition-colors hover:bg-gray-50 disabled:opacity-60"
    >
      Cancel
    </button>
  );
}

function Crumb({
  icon,
  label,
  reached,
}: {
  icon: ReactNode;
  label: string;
  reached: boolean;
}) {
  return (
    <span
      className={`font-stolzl flex items-center gap-2 text-[14px] font-normal uppercase ${
        reached ? "text-black" : "text-[#7E7E7E]"
      }`}
    >
      {icon}
      {label}
    </span>
  );
}

export function ManagerShell({
  title,
  level,
  path,
  isBusy,
  onClose,
  onCrumb,
  children,
  footer,
}: {
  title: string;
  level: 0 | 1 | 2;
  path?: string;
  isBusy: boolean;
  onClose: () => void;
  onCrumb: (level: 0 | 1) => void;
  children: ReactNode;
  /** Omit for the default Cancel footer; pass null to hide the footer. */
  footer?: ReactNode | null;
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
        className="scrollbar-none relative flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-y-auto rounded-[21px] bg-white py-3 shadow-[0px_24px_48px_0px_rgba(0,0,0,0.2)]"
      >
        <div className="mx-3 flex h-[51px] shrink-0 items-center justify-between rounded-[17px] bg-[#F3F3F3] px-[21px]">
          <h2 className="font-greed text-[30px] leading-none font-medium text-black">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isBusy}
            className="flex h-5 w-5 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-60 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[60px] shrink-0 items-end border-b border-[#EDEDED]">
          <div className="flex w-full items-center gap-2 px-5 pb-4">
            <button
              type="button"
              onClick={() => onCrumb(0)}
              className="cursor-pointer"
            >
              <Crumb
                icon={<Globe className="h-[18px] w-[18px]" />}
                label="Website"
                reached
              />
            </button>
            <span className="font-dm-mono text-[14px] text-[#7E7E7E]">→</span>
            <button
              type="button"
              disabled={level < 1}
              onClick={() => onCrumb(1)}
              className="cursor-pointer disabled:cursor-default"
            >
              <Crumb
                icon={<FileText className="h-[18px] w-[18px]" />}
                label="Page"
                reached={level >= 1}
              />
            </button>
            <span className="font-dm-mono text-[14px] text-[#7E7E7E]">→</span>
            <Crumb
              icon={<FormCheckIcon className="h-[18px] w-[18px]" />}
              label="Form"
              reached={level >= 2}
            />
          </div>
        </div>

        {path && (
          <div className="flex h-[50px] shrink-0 items-center border-b border-[#EDEDED] px-5">
            <PathChip>{path}</PathChip>
          </div>
        )}

        {children}

        {footer !== null && (
          <div className="flex shrink-0 items-center justify-end border-t border-[#EDEDED] px-5 py-4">
            {footer ?? <CancelButton onClick={onClose} disabled={isBusy} />}
          </div>
        )}
      </section>
    </div>
  );
}
