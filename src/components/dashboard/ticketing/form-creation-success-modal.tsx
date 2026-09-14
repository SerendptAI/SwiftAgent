"use client";

import Image from "next/image";
import { useEffect } from "react";

import { useScrollLock } from "@/hooks/use-scroll-lock";

interface FormCreationSuccessModalProps {
  open: boolean;
  formIcon: string;
  formName: string;
  onClose: () => void;
}

export function FormCreationSuccessModal({
  open,
  formIcon,
  formName,
  onClose,
}: FormCreationSuccessModalProps) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center px-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close form creation success"
        className="absolute inset-0 cursor-pointer bg-black/45"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-creation-success-title"
        className="relative flex h-[660px] w-full max-w-[560px] flex-col items-center bg-white px-16 pt-16 pb-12 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      >
        <h2
          id="form-creation-success-title"
          className="font-greed text-center text-[34px] leading-none font-medium tracking-[-0.02em] text-black"
        >
          Your Form Is Live
        </h2>

        <button
          type="button"
          className="mt-8 flex h-10 max-w-full cursor-pointer items-center gap-2 rounded-xl border border-[#EDEDED] bg-white px-3 text-left shadow-sm"
        >
          <Image
            src={formIcon}
            alt=""
            width={23}
            height={23}
            className="h-[23px] w-[23px] shrink-0"
          />
          <span className="min-w-0 truncate text-base font-normal tracking-[0.18em] text-black">
            {formName}
          </span>
          <span className="h-0 w-0 shrink-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-black/30" />
        </button>

        <div className="mt-20 flex flex-1 items-start justify-center">
          <Image
            src="/images/form-creation-success.svg"
            alt=""
            width={178}
            height={228}
            className="h-[228px] w-[178px]"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="h-10 w-full cursor-pointer rounded-lg bg-[#006BE5] text-base font-normal tracking-[0.08em] text-white shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#005fca]"
        >
          Finish
        </button>
      </section>
    </div>
  );
}
