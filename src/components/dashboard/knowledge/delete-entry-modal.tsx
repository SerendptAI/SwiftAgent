"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { PixelTrashIcon } from "@/components/dashboard/ticketing/forms-manager-ui";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface DeleteEntryModalProps {
  entryText: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteEntryModal({
  entryText,
  onConfirm,
  onClose,
}: DeleteEntryModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useScrollLock(true);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center px-6"
      role="presentation"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-entry-title"
        className="relative flex w-full max-w-120 flex-col rounded-[21px] bg-white p-3 shadow-[0px_24px_48px_0px_rgba(0,0,0,0.2)]"
      >
        <div className="flex h-13 shrink-0 items-center justify-between rounded-[17px] bg-[#F3F3F3] px-5">
          <h2 className="font-greed text-[26px] leading-none font-medium text-black">
            Delete?
          </h2>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-5 w-5 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center px-6 pt-10 pb-6">
          <PixelTrashIcon className="size-12 text-black md:size-16" />

          <h3
            id="delete-entry-title"
            className="font-greed mt-7 max-w-xs text-center text-2xl leading-[1.05] font-medium text-black md:text-3xl"
          >
            Are you sure you want to delete this entry?
          </h3>

          <div className="mt-5 w-full rounded-[10px] bg-[#EDEDED] px-4 py-3">
            <p className="w-full text-center text-sm text-black/70">
              {entryText}
            </p>
          </div>

          <div className="mt-8 grid w-full grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-[#EDEDED] text-sm font-medium text-[#7E7E7E] shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-gray-50 hover:shadow-[-2px_2px_0px_0px_#000000] md:text-base"
            >
              Cancel
            </button>
            <button
              ref={confirmRef}
              type="button"
              onClick={onConfirm}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#F25430] text-sm font-medium text-white shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-[#d94526] hover:shadow-[-2px_2px_0px_0px_#000000] md:text-base"
            >
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
