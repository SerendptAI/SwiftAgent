"use client";

import Image from "next/image";
import { useEffect } from "react";

import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Form } from "@/services/forms";

const FORM_TYPE_ICON: Record<string, string> = {
  website: "/images/icons/internet-www.svg",
  online: "/images/icons/sticky-notepad.svg",
};

function getFormDisplayName(form: Form): string {
  return form.form_title ?? form.website_link ?? form.id;
}

interface FormDeleteModalProps {
  open: boolean;
  form: Form | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function FormDeleteModal({
  open,
  form,
  isDeleting,
  onClose,
  onConfirm,
}: FormDeleteModalProps) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, isDeleting]);

  if (!open || !form) return null;

  const icon = FORM_TYPE_ICON[form.type] ?? FORM_TYPE_ICON.website;
  const displayName = getFormDisplayName(form);

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center px-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close delete confirmation"
        className="absolute inset-0 cursor-pointer bg-black/45"
        onClick={isDeleting ? undefined : onClose}
        disabled={isDeleting}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-delete-title"
        className="relative flex w-full max-w-[480px] flex-col items-center bg-white px-10 pt-12 pb-10 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      >
        <h2
          id="form-delete-title"
          className="font-greed-narrow text-center text-[34px] leading-none font-medium tracking-[-0.02em] text-black uppercase"
        >
          Delete Form?
        </h2>

        <div className="mt-8 flex h-10 max-w-full items-center gap-2 rounded-xl border border-[#EDEDED] bg-white px-3 shadow-sm">
          <Image
            src={icon}
            alt=""
            width={23}
            height={23}
            className="h-[23px] w-[23px] shrink-0"
          />
          <span className="font-dm-mono min-w-0 truncate text-base font-normal tracking-[0.18em] text-black uppercase">
            {displayName}
          </span>
        </div>

        <p className="font-dm-mono mt-8 w-full max-w-[340px] text-center text-sm leading-[1.7] tracking-[0.06em] text-black/50 uppercase">
          This action is permanent and cannot be undone. All submissions for
          this form will also be deleted.
        </p>

        <div className="mt-10 grid w-full grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="font-dm-mono h-10 cursor-pointer rounded-lg bg-[#EDEDED] text-base font-normal tracking-[0.08em] text-black uppercase shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#e0e0e0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="font-dm-mono h-10 cursor-pointer rounded-lg bg-[#6433CC] text-base font-normal tracking-[0.08em] text-white uppercase shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#572bb5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
