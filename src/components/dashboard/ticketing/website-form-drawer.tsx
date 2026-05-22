"use client";

import { Copy, Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";

const DRAWER_TRANSITION_MS = 520;
const EMBED_CODE =
  '<script src="https://swiftagents.org/chat-widget.js"></script> <div id="chat-widget"></div> <style>#chat-widget { position: fixed; bottom:</style>';
const API_KEY = "SDPK-272XXXXXXXXXXXXXXXXXXXX";
const PUBLIC_KEY = "SDPK-272XXXXXXXXXXXXXXXXXXXX";

type WebsiteFormStep = "website" | "security";
type WebsiteInformationErrors = {
  websiteLink?: string;
  alertEmail?: string;
};

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function WebsiteFormDrawer({
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
  const [activeStep, setActiveStep] = useState<WebsiteFormStep>("website");
  const closeTimeoutRef = useRef<number | null>(null);

  const closeDrawer = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveStep("website");
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
      setActiveStep("website");
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
    setActiveStep("website");
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

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDrawer, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-end" role="presentation">
      <button
        type="button"
        aria-label="Close website form drawer"
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
        aria-labelledby="website-form-title"
        className="development-resources-sheet relative flex h-[calc(100vh-30px)] w-full flex-col overflow-hidden bg-white shadow-[0_-20px_70px_rgba(0,0,0,0.18)] will-change-transform"
        style={{
          animation: `${
            isClosing
              ? "development-resources-drawer-out"
              : "development-resources-drawer-in"
          } ${DRAWER_TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-8.5 z-10 px-6 md:px-10">
          <div className="mx-auto w-full max-w-350">
            <button
              type="button"
              onClick={closeDrawer}
              className="font-dm-mono pointer-events-auto flex w-fit cursor-pointer items-center gap-3 rounded-full bg-white px-3 py-1 text-xs leading-none tracking-[0.08em] text-black/50 uppercase transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:text-sm"
            >
              <Icons.leftArrow className="h-auto w-6 stroke-2 text-black" />
              Back to Forms
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-30 pb-16 md:px-10">
          <div className="mx-auto flex w-full max-w-310 flex-col items-center">
            <h2
              id="website-form-title"
              className="font-greed-narrow text-center text-[34px] leading-[0.95] font-medium tracking-[-0.02em] text-black uppercase"
            >
              Create New Website Form
            </h2>

            <p className="font-dm-mono mt-14 w-full max-w-290 rounded-2xl bg-[#EDEDED] px-8 py-4 text-center text-sm leading-[1.35] font-normal tracking-[0.18em] text-black/45 uppercase">
              A website form is a form that captures any info sent through any
              form on your website so you don&apos;t need email and backend code
              to have a functioning contact form
            </p>

            <WebsiteFormProgress activeStep={activeStep} />

            <div
              className={`mt-28 w-full ${
                activeStep === "website" ? "max-w-148" : "max-w-270"
              }`}
            >
              {activeStep === "website" ? (
                <WebsiteInformationForm
                  onContinue={() => setActiveStep("security")}
                />
              ) : (
                <SecurityInformationForm onSaveAndExit={completeCreation} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WebsiteFormProgress({ activeStep }: { activeStep: WebsiteFormStep }) {
  const isSecurityStep = activeStep === "security";

  return (
    <div
      className="mt-24 flex items-end gap-2"
      aria-label="Website form creation progress"
    >
      <div className="font-dm-mono h-9 border-b-4 border-[#6433CC] px-2 text-sm font-normal tracking-[0.08em] text-black uppercase">
        Website Information
      </div>
      <div
        className={`font-dm-mono h-9 border-b-4 px-2 text-sm font-normal tracking-[0.08em] uppercase ${
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

function WebsiteInformationForm({ onContinue }: { onContinue: () => void }) {
  const [websiteLink, setWebsiteLink] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [errors, setErrors] = useState<WebsiteInformationErrors>({});

  const handleContinue = () => {
    const nextErrors: WebsiteInformationErrors = {};

    if (!isValidHttpUrl(websiteLink.trim())) {
      nextErrors.websiteLink = "Enter a valid website link";
    }

    if (!isValidEmail(alertEmail.trim())) {
      nextErrors.alertEmail = "Enter a valid email address";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onContinue();
    }
  };

  return (
    <div className="space-y-7">
      <label className="block">
        <span className="font-dm-mono mb-4 flex items-center gap-2 text-2xl leading-none font-bold tracking-[0.08em] text-black uppercase">
          Website Link
          <Info className="h-5 w-5" />
        </span>
        <input
          type="url"
          value={websiteLink}
          onChange={(event) => setWebsiteLink(event.target.value)}
          placeholder="https://website.com"
          aria-invalid={Boolean(errors.websiteLink)}
          className={`font-dm-mono h-10 w-full rounded-md border-0 bg-[#EDEDED] px-4 text-base font-normal tracking-[0.08em] text-black uppercase outline-none placeholder:text-black/35 focus:ring-2 ${
            errors.websiteLink
              ? "ring-2 ring-[#F25430]"
              : "focus:ring-[#6433CC]"
          }`}
        />
        {errors.websiteLink && (
          <p className="font-dm-mono mt-2 text-xs font-normal tracking-[0.08em] text-[#F25430] uppercase">
            {errors.websiteLink}
          </p>
        )}
      </label>

      <label className="block">
        <span className="font-dm-mono mb-4 flex items-center gap-2 text-2xl leading-none font-bold tracking-[0.08em] text-black uppercase">
          Alert Email
          <Info className="h-5 w-5" />
        </span>
        <input
          type="email"
          value={alertEmail}
          onChange={(event) => setAlertEmail(event.target.value)}
          placeholder="johndoe@zvask.com"
          aria-invalid={Boolean(errors.alertEmail)}
          className={`font-dm-mono h-10 w-full rounded-md border-0 bg-[#EDEDED] px-4 text-base font-normal tracking-[0.08em] text-black uppercase outline-none placeholder:text-black/35 focus:ring-2 ${
            errors.alertEmail ? "ring-2 ring-[#F25430]" : "focus:ring-[#6433CC]"
          }`}
        />
        {errors.alertEmail && (
          <p className="font-dm-mono mt-2 text-xs font-normal tracking-[0.08em] text-[#F25430] uppercase">
            {errors.alertEmail}
          </p>
        )}
      </label>

      <button
        type="button"
        onClick={handleContinue}
        className="font-dm-mono mt-14 h-10 w-full cursor-pointer rounded-lg bg-[#006BE5] text-base font-normal tracking-[0.08em] text-white uppercase shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#005fca]"
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

function SecurityInformationForm({
  onSaveAndExit,
}: {
  onSaveAndExit: () => void;
}) {
  return (
    <div className="flex flex-col justify-center">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="flex flex-col">
          <h3 className="font-dm-mono mb-5 max-w-75 text-lg leading-[1.18] font-bold tracking-[0.04em] text-black uppercase">
            Copy this to your code base
          </h3>
          <div className="font-dm-mono h-full overflow-hidden rounded-lg bg-[#F4F1EC] p-6 text-xs leading-[1.35] font-normal tracking-[0.12em] whitespace-pre-wrap text-black/40 uppercase">
            {EMBED_CODE}
          </div>
        </section>

        <section className="flex flex-col">
          <h3 className="font-dm-mono mb-5 max-w-125 text-lg leading-[1.18] font-bold tracking-[0.04em] text-black uppercase">
            Copy this(you can find this later in swiftagents.org/forms/keys)
          </h3>
          <div className="font-dm-mono flex h-full flex-col justify-center rounded-lg bg-[#F4F1EC] p-6 text-xs leading-[1.8] font-normal tracking-[0.12em] text-black/40 uppercase">
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

      <div className="mx-auto mt-28 w-full max-w-148">
        <button
          type="button"
          onClick={onSaveAndExit}
          className="font-dm-mono h-10 w-full cursor-pointer rounded-lg bg-[#006BE5] text-base font-normal tracking-[0.08em] text-white uppercase shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#005fca]"
        >
          Save and Exit
        </button>
      </div>
    </div>
  );
}
