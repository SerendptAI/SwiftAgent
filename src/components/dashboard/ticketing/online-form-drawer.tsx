"use client";

import { Copy, Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { useScrollLock } from "@/hooks/use-scroll-lock";

const DRAWER_TRANSITION_MS = 520;
const EMBED_CODE =
  '<script src="https://swiftagents.org/chat-widget.js"></script> <div id="chat-widget"></div> <style>#chat-widget { position: fixed; bottom:</style>';
const API_KEY = "SDPK-272XXXXXXXXXXXXXXXXXXXX";
const PUBLIC_KEY = "SDPK-272XXXXXXXXXXXXXXXXXXXX";

type OnlineFormStep = "form" | "security";
type OnlineFormInformationErrors = {
  formImage?: string;
  formTitle?: string;
};

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function OnlineFormDrawer({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isMounted, setIsMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [activeStep, setActiveStep] = useState<OnlineFormStep>("form");
  const closeTimeoutRef = useRef<number | null>(null);
  useScrollLock(isMounted);

  const closeDrawer = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveStep("form");
      setIsMounted(false);
      onClose();
      closeTimeoutRef.current = null;
    }, DRAWER_TRANSITION_MS);
  }, [onClose]);

  const completeCreation = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveStep("form");
      setIsMounted(false);
      onClose();
      onSuccess();
      closeTimeoutRef.current = null;
    }, DRAWER_TRANSITION_MS);
  }, [onClose, onSuccess]);

  useEffect(() => {
    if (!open) return;

    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setIsMounted(true);
    setIsClosing(false);
    setActiveStep("form");
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open) return;

    setIsClosing(true);
    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, DRAWER_TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDrawer, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-end" role="presentation">
      <button
        type="button"
        aria-label="Close online form drawer"
        className="development-resources-overlay absolute inset-0 cursor-default bg-black/65"
        style={{
          animation: `${
            isClosing
              ? "development-resources-overlay-out"
              : "development-resources-overlay-in"
          } ${DRAWER_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
        }}
        onClick={closeDrawer}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="online-form-title"
        className="development-resources-sheet relative flex h-[calc(100svh-1rem)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-20px_70px_rgba(0,0,0,0.18)] will-change-transform md:h-[calc(100vh-30px)] md:rounded-t-none"
        style={{
          animation: `${
            isClosing
              ? "development-resources-drawer-out"
              : "development-resources-drawer-in"
          } ${DRAWER_TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 px-4 md:top-8.5 md:px-10">
          <div className="mx-auto w-full max-w-350">
            <button
              type="button"
              onClick={closeDrawer}
              className="font-dm-mono pointer-events-auto flex min-h-10 w-fit max-w-full cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-1 text-xs leading-none tracking-[0.08em] text-black/60 uppercase shadow-sm transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:min-h-0 md:gap-3 md:text-sm md:shadow-none"
            >
              <Icons.leftArrow className="h-auto w-5 shrink-0 stroke-2 text-black md:w-6" />
              <span className="truncate">Back to Forms</span>
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-18 pb-[calc(2rem+env(safe-area-inset-bottom))] md:px-10 md:pt-30 md:pb-16">
          <div className="mx-auto flex w-full max-w-310 flex-col items-center">
            <h2
              id="online-form-title"
              className="font-greed-narrow text-center text-[30px] leading-[0.95] font-medium tracking-[-0.02em] text-black uppercase md:text-[34px]"
            >
              Create New Online Form
            </h2>

            <p className="font-dm-mono mt-6 w-full max-w-290 rounded-xl bg-[#EDEDED] px-4 py-3 text-center text-[11px] leading-[1.45] font-normal tracking-[0.12em] text-black/45 uppercase md:mt-14 md:rounded-2xl md:px-8 md:py-4 md:text-sm md:leading-[1.35] md:tracking-[0.18em]">
              A website form is a form that captures any info sent through any
              form on your website so you don&apos;t need email and backend code
              to have a functioning contact form
            </p>

            <OnlineFormProgress activeStep={activeStep} />

            <div
              className={`mt-8 w-full md:mt-28 ${
                activeStep === "form" ? "max-w-148" : "max-w-270"
              }`}
            >
              {activeStep === "form" ? (
                <OnlineFormInformation
                  onContinue={() => setActiveStep("security")}
                />
              ) : (
                <OnlineFormSecurity onSaveAndExit={completeCreation} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OnlineFormProgress({ activeStep }: { activeStep: OnlineFormStep }) {
  const isSecurityStep = activeStep === "security";

  return (
    <div
      className="mt-8 flex w-full items-end gap-2 overflow-x-auto md:mx-auto md:mt-24 md:w-fit md:overflow-visible"
      aria-label="Online form creation progress"
    >
      <div className="font-dm-mono h-8 shrink-0 border-b-4 border-[#6433CC] px-2 text-xs font-normal tracking-[0.08em] whitespace-nowrap text-black uppercase md:h-9 md:text-sm">
        Form Information
      </div>
      <div
        className={`font-dm-mono h-8 shrink-0 border-b-4 px-2 text-xs font-normal tracking-[0.08em] whitespace-nowrap uppercase md:h-9 md:text-sm ${
          isSecurityStep
            ? "border-[#F5A623] text-black"
            : "border-[#F2E6D6] text-black/20"
        }`}
      >
        Security Info
      </div>
    </div>
  );
}

function OnlineFormInformation({ onContinue }: { onContinue: () => void }) {
  const [formImage, setFormImage] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [errors, setErrors] = useState<OnlineFormInformationErrors>({});

  const handleContinue = () => {
    const nextErrors: OnlineFormInformationErrors = {};

    if (!isValidHttpUrl(formImage.trim())) {
      nextErrors.formImage = "Enter a valid image link";
    }

    if (!formTitle.trim()) {
      nextErrors.formTitle = "Enter a form title";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onContinue();
    }
  };

  return (
    <div className="space-y-5 md:space-y-7">
      <label className="block">
        <span className="font-dm-mono mb-2 flex items-center gap-2 text-base leading-none font-bold tracking-[0.08em] text-black uppercase md:mb-4 md:text-2xl">
          Upload Form Image
          <Info className="h-4 w-4 md:h-5 md:w-5" />
        </span>
        <input
          type="text"
          value={formImage}
          onChange={(event) => setFormImage(event.target.value)}
          placeholder="https://website.com"
          aria-invalid={Boolean(errors.formImage)}
          className={`font-dm-mono h-11 w-full rounded-md border-0 bg-[#EDEDED] px-4 text-sm font-normal tracking-[0.08em] text-black uppercase outline-none placeholder:text-black/35 focus:ring-2 md:h-10 md:text-base ${
            errors.formImage ? "ring-2 ring-[#F25430]" : "focus:ring-[#6433CC]"
          }`}
        />
        {errors.formImage && (
          <p className="font-dm-mono mt-2 text-xs font-normal tracking-[0.08em] text-[#F25430] uppercase">
            {errors.formImage}
          </p>
        )}
      </label>

      <label className="block">
        <span className="font-dm-mono mb-2 flex items-center gap-2 text-base leading-none font-bold tracking-[0.08em] text-black uppercase md:mb-4 md:text-2xl">
          Form Title
          <Info className="h-4 w-4 md:h-5 md:w-5" />
        </span>
        <input
          type="text"
          value={formTitle}
          onChange={(event) => setFormTitle(event.target.value)}
          placeholder="NG BALLERZ FORM"
          aria-invalid={Boolean(errors.formTitle)}
          className={`font-dm-mono h-11 w-full rounded-md border-0 bg-[#EDEDED] px-4 text-sm font-normal tracking-[0.08em] text-black uppercase outline-none placeholder:text-black/35 focus:ring-2 md:h-10 md:text-base ${
            errors.formTitle ? "ring-2 ring-[#F25430]" : "focus:ring-[#6433CC]"
          }`}
        />
        {errors.formTitle && (
          <p className="font-dm-mono mt-2 text-xs font-normal tracking-[0.08em] text-[#F25430] uppercase">
            {errors.formTitle}
          </p>
        )}
      </label>

      <button
        type="button"
        onClick={handleContinue}
        className="font-dm-mono mt-8 h-11 w-full cursor-pointer rounded-lg bg-[#006BE5] text-sm font-normal tracking-[0.08em] text-white uppercase shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#005fca] md:mt-14 md:h-10 md:text-base"
      >
        Continue
      </button>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        void navigator.clipboard?.writeText(value);
      }}
      className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-black/45 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <Copy className="h-4 w-4" />
    </button>
  );
}

function OnlineFormSecurity({ onSaveAndExit }: { onSaveAndExit: () => void }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-8">
        <section className="flex flex-col">
          <h3 className="font-dm-mono mb-3 max-w-75 text-sm leading-[1.25] font-bold tracking-[0.04em] text-black uppercase md:mb-5 md:text-lg md:leading-[1.18]">
            Copy this to your code base
          </h3>
          <div className="font-dm-mono min-h-28 overflow-auto rounded-lg bg-[#F4F1EC] p-4 text-[10px] leading-[1.45] font-normal tracking-[0.1em] whitespace-pre-wrap text-black/40 uppercase md:h-full md:p-6 md:text-xs md:leading-[1.35] md:tracking-[0.12em]">
            {EMBED_CODE}
          </div>
        </section>

        <section className="flex flex-col">
          <h3 className="font-dm-mono mb-3 max-w-125 text-sm leading-[1.25] font-bold tracking-[0.04em] text-black uppercase md:mb-5 md:text-lg md:leading-[1.18]">
            Copy this(you can find this later in swiftagents.org/forms/keys)
          </h3>
          <div className="font-dm-mono flex min-h-28 flex-col justify-center rounded-lg bg-[#F4F1EC] p-4 text-[10px] leading-[1.8] font-normal tracking-[0.1em] text-black/40 uppercase md:h-full md:p-6 md:text-xs md:tracking-[0.12em]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="min-w-0 flex-1 truncate">
                API Key: {API_KEY}
              </span>
              <CopyButton value={API_KEY} label="Copy API key" />
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <span className="min-w-0 flex-1 truncate">
                Public Key: {PUBLIC_KEY}
              </span>
              <CopyButton value={PUBLIC_KEY} label="Copy public key" />
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto mt-8 w-full max-w-148 md:mt-28">
        <button
          type="button"
          onClick={onSaveAndExit}
          className="font-dm-mono h-11 w-full cursor-pointer rounded-lg bg-[#006BE5] text-sm font-normal tracking-[0.08em] text-white uppercase shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#005fca] md:h-10 md:text-base"
        >
          Save and Exit
        </button>
      </div>
    </div>
  );
}
