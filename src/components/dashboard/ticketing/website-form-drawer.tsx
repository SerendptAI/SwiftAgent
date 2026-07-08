"use client";

import { Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CopyButton } from "@/components/dashboard/ticketing/copy-button";
import { Icons } from "@/components/icons";
import { useCreateWebsiteForm, useUpdateForm } from "@/hooks/use-forms";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { isValidEmail, isValidHttpUrl } from "@/lib/validation";
import type { Form } from "@/services/forms";
import { getFormEmbedCode } from "@/services/forms";

const DRAWER_TRANSITION_MS = 520;

type WebsiteFormStep = "website" | "security";
type WebsiteInformationErrors = {
  websiteLink?: string;
  alertEmail?: string;
};

export function WebsiteFormDrawer({
  open,
  onClose,
  onSuccess,
  mode = "create",
  editForm,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (form: Form) => void;
  mode?: "create" | "edit";
  editForm?: Form;
}) {
  const isEdit = mode === "edit";
  const [isMounted, setIsMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [activeStep, setActiveStep] = useState<WebsiteFormStep>("website");
  const [websiteLink, setWebsiteLink] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [errors, setErrors] = useState<WebsiteInformationErrors>({});
  const [createdForm, setCreatedForm] = useState<Form | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const createForm = useCreateWebsiteForm();
  const updateForm = useUpdateForm();
  const isPending = isEdit ? updateForm.isPending : createForm.isPending;
  const isError = isEdit ? updateForm.isError : createForm.isError;
  useScrollLock(isMounted);

  const closeDrawer = useCallback(() => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveStep("website");
      setWebsiteLink("");
      setAlertEmail("");
      setErrors({});
      setCreatedForm(null);
      setIsMounted(false);
      onClose();
      closeTimeoutRef.current = null;
    }, DRAWER_TRANSITION_MS);
  }, [onClose]);

  const completeCreation = useCallback(
    (form: Form) => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
      setIsClosing(true);
      closeTimeoutRef.current = window.setTimeout(() => {
        setActiveStep("website");
        setWebsiteLink("");
        setAlertEmail("");
        setErrors({});
        setCreatedForm(null);
        setIsMounted(false);
        onClose();
        onSuccess(form);
        closeTimeoutRef.current = null;
      }, DRAWER_TRANSITION_MS);
    },
    [onClose, onSuccess],
  );

  const handleContinue = () => {
    const nextErrors: WebsiteInformationErrors = {};

    if (!isValidHttpUrl(websiteLink.trim())) {
      nextErrors.websiteLink = "Enter a valid website link";
    }
    if (!isValidEmail(alertEmail.trim())) {
      nextErrors.alertEmail = "Enter a valid email address";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isEdit && editForm) {
      updateForm.mutate(
        {
          formId: editForm.id,
          payload: {
            website_link: websiteLink.trim(),
            alert_email: alertEmail.trim(),
          },
        },
        { onSuccess: (form) => completeCreation(form) },
      );
    } else {
      createForm.mutate(
        { website_link: websiteLink.trim(), alert_email: alertEmail.trim() },
        {
          onSuccess: (form) => {
            setCreatedForm(form);
            setActiveStep("security");
          },
        },
      );
    }
  };

  useEffect(() => {
    if (!open) return;
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMounted(true);
    setIsClosing(false);
    setActiveStep("website");
    setWebsiteLink(isEdit ? (editForm?.website_link ?? "") : "");
    setAlertEmail(isEdit ? (editForm?.alert_email ?? "") : "");
    setErrors({});
    setCreatedForm(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (open) return;
    setIsClosing(true);
    const timeout = window.setTimeout(
      () => setIsMounted(false),
      DRAWER_TRANSITION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!isMounted) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
              id="website-form-title"
              className="font-greed-narrow text-center text-[30px] leading-[0.95] font-medium tracking-[-0.02em] text-black uppercase md:text-[34px]"
            >
              {isEdit ? "Edit Website Form" : "Create New Website Form"}
            </h2>

            <p className="font-dm-mono mt-6 w-full max-w-290 rounded-xl bg-[#EDEDED] px-4 py-3 text-center text-[11px] leading-[1.45] font-normal tracking-[0.12em] text-black/45 uppercase md:mt-14 md:rounded-2xl md:px-8 md:py-4 md:text-sm md:leading-[1.35] md:tracking-[0.18em]">
              A website form is a form that captures any info sent through any
              form on your website so you don&apos;t need email and backend code
              to have a functioning contact form
            </p>

            {!isEdit && <WebsiteFormProgress activeStep={activeStep} />}

            <div
              className={`mt-8 w-full md:mt-28 ${
                activeStep === "website" ? "max-w-148" : "max-w-270"
              }`}
            >
              {activeStep === "website" ? (
                <WebsiteInformationForm
                  websiteLink={websiteLink}
                  alertEmail={alertEmail}
                  errors={errors}
                  isLoading={isPending}
                  isEdit={isEdit}
                  apiError={
                    isError
                      ? `Failed to ${isEdit ? "update" : "create"} form. Please try again.`
                      : undefined
                  }
                  onWebsiteLinkChange={setWebsiteLink}
                  onAlertEmailChange={setAlertEmail}
                  onContinue={handleContinue}
                />
              ) : (
                <SecurityInformationForm
                  formId={createdForm?.id ?? ""}
                  onSaveAndExit={() => {
                    if (createdForm) completeCreation(createdForm);
                  }}
                />
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
      className="mt-8 flex w-full items-end gap-2 overflow-x-auto md:mx-auto md:mt-24 md:w-fit md:overflow-visible"
      aria-label="Website form creation progress"
    >
      <div className="font-dm-mono h-8 shrink-0 border-b-4 border-[#6433CC] px-2 text-xs font-normal tracking-[0.08em] whitespace-nowrap text-black uppercase md:h-9 md:text-sm">
        Website Information
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

function WebsiteInformationForm({
  websiteLink,
  alertEmail,
  errors,
  isLoading,
  isEdit,
  apiError,
  onWebsiteLinkChange,
  onAlertEmailChange,
  onContinue,
}: {
  websiteLink: string;
  alertEmail: string;
  errors: WebsiteInformationErrors;
  isLoading: boolean;
  isEdit?: boolean;
  apiError?: string;
  onWebsiteLinkChange: (value: string) => void;
  onAlertEmailChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-5 md:space-y-7">
      <label className="block">
        <span className="font-dm-mono mb-2 flex items-center gap-2 text-base leading-none font-bold tracking-[0.08em] text-black uppercase md:mb-4 md:text-2xl">
          Website Link
          <Info className="h-4 w-4 md:h-5 md:w-5" />
        </span>
        <input
          type="url"
          value={websiteLink}
          onChange={(e) => onWebsiteLinkChange(e.target.value)}
          placeholder="https://website.com/contact-us"
          aria-invalid={Boolean(errors.websiteLink)}
          className={`font-dm-mono h-11 w-full rounded-md border-0 bg-[#EDEDED] px-4 text-sm font-normal tracking-[0.08em] text-black uppercase outline-none placeholder:text-black/35 focus:ring-2 md:h-10 md:text-base ${
            errors.websiteLink
              ? "ring-2 ring-[#F25430]"
              : "focus:ring-[#6433CC]"
          }`}
        />
        {errors.websiteLink ? (
          <p className="font-dm-mono mt-2 text-xs font-normal tracking-[0.08em] text-[#F25430] uppercase">
            {errors.websiteLink}
          </p>
        ) : (
          <p className="font-dm-mono mt-2 text-xs font-normal tracking-[0.04em] text-black/40">
            Include the page path (e.g. /contact-us) to group this form under
            that page.
          </p>
        )}
      </label>

      <label className="block">
        <span className="font-dm-mono mb-2 flex items-center gap-2 text-base leading-none font-bold tracking-[0.08em] text-black uppercase md:mb-4 md:text-2xl">
          Alert Email
          <Info className="h-4 w-4 md:h-5 md:w-5" />
        </span>
        <input
          type="email"
          value={alertEmail}
          onChange={(e) => onAlertEmailChange(e.target.value)}
          placeholder="johndoe@zvask.com"
          aria-invalid={Boolean(errors.alertEmail)}
          className={`font-dm-mono h-11 w-full rounded-md border-0 bg-[#EDEDED] px-4 text-sm font-normal tracking-[0.08em] text-black uppercase outline-none placeholder:text-black/35 focus:ring-2 md:h-10 md:text-base ${
            errors.alertEmail ? "ring-2 ring-[#F25430]" : "focus:ring-[#6433CC]"
          }`}
        />
        {errors.alertEmail && (
          <p className="font-dm-mono mt-2 text-xs font-normal tracking-[0.08em] text-[#F25430] uppercase">
            {errors.alertEmail}
          </p>
        )}
      </label>

      {apiError && (
        <p className="font-dm-mono text-xs font-normal tracking-[0.08em] text-[#F25430] uppercase">
          {apiError}
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={isLoading}
        className="font-dm-mono mt-8 h-11 w-full cursor-pointer rounded-lg bg-[#006BE5] text-sm font-normal tracking-[0.08em] text-white uppercase shadow-[-3px_5px_0px_0px_#000000] transition-colors hover:bg-[#005fca] disabled:cursor-not-allowed disabled:opacity-60 md:mt-14 md:h-10 md:text-base"
      >
        {isLoading
          ? isEdit
            ? "Saving..."
            : "Creating..."
          : isEdit
            ? "Save Changes"
            : "Continue"}
      </button>
    </div>
  );
}

function SecurityInformationForm({
  formId,
  onSaveAndExit,
}: {
  formId: string;
  onSaveAndExit: () => void;
}) {
  const embedCode = getFormEmbedCode(formId);

  return (
    <div className="flex flex-col justify-center">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-8">
        <section className="flex flex-col">
          <h3 className="font-dm-mono mb-3 max-w-75 text-sm leading-[1.25] font-bold tracking-[0.04em] text-black uppercase md:mb-5 md:text-lg md:leading-[1.18]">
            Copy this to your code base
          </h3>
          <div className="font-dm-mono min-h-28 overflow-auto rounded-lg bg-[#F4F1EC] p-4 text-[10px] leading-[1.45] font-normal tracking-[0.1em] whitespace-pre-wrap text-black/40 uppercase md:h-full md:p-6 md:text-xs md:leading-[1.35] md:tracking-[0.12em]">
            {embedCode}
          </div>
        </section>

        <section className="flex flex-col">
          <h3 className="font-dm-mono mb-3 max-w-125 text-sm leading-[1.25] font-bold tracking-[0.04em] text-black uppercase md:mb-5 md:text-lg md:leading-[1.18]">
            Copy this (you can find this later in swiftagents.org/forms/keys)
          </h3>
          <div className="font-dm-mono flex min-h-28 flex-col justify-center rounded-lg bg-[#F4F1EC] p-4 text-[10px] leading-[1.8] font-normal tracking-[0.1em] text-black/40 uppercase md:h-full md:p-6 md:text-xs md:tracking-[0.12em]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="min-w-0 flex-1 truncate">Form ID: {formId}</span>
              <CopyButton value={formId} label="Copy form ID" />
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
