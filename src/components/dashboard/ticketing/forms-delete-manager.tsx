"use client";

import { ChevronRight, FileText, Globe } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Form, Submission } from "@/services/forms";
import { getFormDisplayName, getSubmissionDisplayName } from "@/services/forms";

import {
  derivePageForms,
  derivePages,
  deriveWebsites,
  formatDate,
  groupSubmissionsByForm,
  hostLabel,
} from "./forms-hierarchy";
import { ActionLink, CountPill, ManagerShell, Row } from "./forms-manager-ui";

type Step =
  | { name: "websites" }
  | { name: "pages"; origin: string }
  | { name: "forms"; origin: string; path: string }
  | { name: "entries"; origin: string; path: string; formId: string };

type Pending =
  | { kind: "website"; label: string; origin: string }
  | { kind: "page"; label: string; origin: string; path: string }
  | { kind: "forms"; label: string; formIds: string[] }
  | { kind: "submissions"; label: string; submissionIds: string[] };

const LEVEL: Record<Step["name"], 0 | 1 | 2> = {
  websites: 0,
  pages: 1,
  forms: 2,
  entries: 2,
};

const DELETE_COLOR = "text-[#F25430]";

function ConfirmDialog({
  label,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  label: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 px-6">
      <div className="w-full max-w-[420px] rounded-2xl bg-white px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <h3 className="font-dm-mono text-2xl font-bold tracking-[-0.01em] text-black">
          Delete?
        </h3>
        <p className="font-dm-mono mt-2 text-sm text-black/60">{label}</p>
        <p className="font-dm-mono mt-3 text-[13px] text-[#F25430]">
          Are you sure you want to delete this? This action is permanent.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="font-dm-mono cursor-pointer rounded-lg border border-[#E5E5E5] px-5 py-2 text-sm text-black/70 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="font-dm-mono cursor-pointer rounded-lg bg-[#F25430] px-6 py-2 text-sm font-medium text-white uppercase transition-colors hover:bg-[#d94526] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessDialog() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E9F9EE]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-[#1DB954]"
          >
            <path
              d="M5 12.5l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3 className="font-dm-mono text-xl font-bold tracking-[-0.01em] text-black">
          Deletion Successful
        </h3>
        <p className="font-dm-mono text-[12px] tracking-[0.1em] text-black/40 uppercase">
          Closing automatically...
        </p>
      </div>
    </div>
  );
}

interface FormsDeleteManagerProps {
  open: boolean;
  forms: Form[];
  submissions: Submission[];
  isDeleting: boolean;
  onClose: () => void;
  onDeleteForms: (formIds: string[]) => Promise<void>;
  onDeleteSubmissions: (submissionIds: string[]) => Promise<void>;
  onDeleteWebsite: (origin: string) => Promise<void>;
  onDeletePage: (origin: string, path: string) => Promise<void>;
}

export function FormsDeleteManager({
  open,
  forms,
  submissions,
  isDeleting,
  onClose,
  onDeleteForms,
  onDeleteSubmissions,
  onDeleteWebsite,
  onDeletePage,
}: FormsDeleteManagerProps) {
  const [step, setStep] = useState<Step>({ name: "websites" });
  const [pending, setPending] = useState<Pending | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useScrollLock(open);

  useEffect(() => {
    if (open) {
      setStep({ name: "websites" });
      setPending(null);
      setShowSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || isDeleting) return;
      if (pending) setPending(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isDeleting, pending, onClose]);

  useEffect(() => {
    if (!showSuccess) return;
    const id = window.setTimeout(onClose, 1600);
    return () => window.clearTimeout(id);
  }, [showSuccess, onClose]);

  const submissionsByForm = useMemo(
    () => groupSubmissionsByForm(submissions),
    [submissions],
  );
  const websites = useMemo(
    () => deriveWebsites(forms, submissionsByForm),
    [forms, submissionsByForm],
  );
  const pages = useMemo(
    () =>
      step.name === "websites"
        ? []
        : derivePages(forms, submissionsByForm, step.origin),
    [forms, submissionsByForm, step],
  );
  const pageForms = useMemo(
    () =>
      step.name === "forms" || step.name === "entries"
        ? derivePageForms(forms, step.origin, step.path)
        : [],
    [forms, step],
  );

  if (!open) return null;

  const handleCrumb = (target: 0 | 1) => {
    if (target === 0) setStep({ name: "websites" });
    else if (target === 1 && step.name !== "websites")
      setStep({ name: "pages", origin: step.origin });
  };

  const confirmPending = async () => {
    if (!pending) return;
    if (pending.kind === "submissions") {
      await onDeleteSubmissions(pending.submissionIds);
    } else if (pending.kind === "website") {
      await onDeleteWebsite(pending.origin);
    } else if (pending.kind === "page") {
      await onDeletePage(pending.origin, pending.path);
    } else {
      await onDeleteForms(pending.formIds);
    }
    setPending(null);
    setShowSuccess(true);
  };

  const body = (() => {
    if (step.name === "websites") {
      return (
        <>
          <p className="font-dm-mono text-sm font-semibold tracking-[0.08em] text-black uppercase">
            Select a website
          </p>
          <p className="font-dm-mono mt-1 text-[13px] text-black/50">
            Choose the website whose forms you want to manage.
          </p>
          <div className="mt-5">
            {websites.length === 0 ? (
              <p className="font-dm-mono py-6 text-center text-[13px] text-black/40">
                No website forms to manage.
              </p>
            ) : (
              websites.map((site) => (
                <Row key={site.origin}>
                  <button
                    type="button"
                    onClick={() =>
                      setStep({ name: "pages", origin: site.origin })
                    }
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                  >
                    <Globe className="h-4 w-4 shrink-0 text-black/60" />
                    <span className="font-dm-mono min-w-0 truncate text-[15px] tracking-[0.02em] text-black lowercase">
                      {site.origin}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <ActionLink
                      label="Delete all"
                      colorClass={DELETE_COLOR}
                      onClick={() =>
                        setPending({
                          kind: "website",
                          label: `All forms on ${hostLabel(site.origin)}`,
                          origin: site.origin,
                        })
                      }
                    />
                    <CountPill>
                      {site.forms.length}{" "}
                      {site.forms.length === 1 ? "form" : "forms"}
                    </CountPill>
                    <ChevronRight className="h-3.5 w-3.5 text-black/40" />
                  </div>
                </Row>
              ))
            )}
          </div>
          <p className="font-dm-mono mt-4 text-[13px] text-black/40">
            Click a website to view its pages, or &apos;Delete all&apos; to
            remove everything.
          </p>
        </>
      );
    }

    if (step.name === "pages") {
      return (
        <>
          <p className="font-dm-mono text-sm font-semibold tracking-[0.08em] text-black uppercase">
            Select a page
          </p>
          <p className="font-dm-mono mt-1 text-[13px] text-black/50">
            Pages that have forms on {step.origin}
          </p>
          <div className="mt-5">
            {pages.map((page) => (
              <Row key={page.path}>
                <button
                  type="button"
                  onClick={() =>
                    setStep({
                      name: "forms",
                      origin: step.origin,
                      path: page.path,
                    })
                  }
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                >
                  <FileText className="h-4 w-4 shrink-0 text-black/60" />
                  <span className="font-dm-mono min-w-0 truncate text-[15px] tracking-[0.02em] text-black lowercase">
                    {page.path}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-3">
                  <ActionLink
                    label="Delete all"
                    colorClass={DELETE_COLOR}
                    onClick={() =>
                      setPending({
                        kind: "page",
                        label: `All forms on ${page.path}`,
                        origin: step.origin,
                        path: page.path,
                      })
                    }
                  />
                  <CountPill>
                    {page.entryCount}{" "}
                    {page.entryCount === 1 ? "entry" : "entries"}
                  </CountPill>
                  <ChevronRight className="h-3.5 w-3.5 text-black/40" />
                </div>
              </Row>
            ))}
          </div>
          <p className="font-dm-mono mt-4 text-[13px] text-black/40">
            Click a page to see its forms, or delete the entire page&apos;s
            forms.
          </p>
        </>
      );
    }

    if (step.name === "forms") {
      return (
        <>
          <p className="font-dm-mono text-sm font-semibold tracking-[0.08em] text-black uppercase">
            Forms on this page
          </p>
          <p className="font-dm-mono mt-1 text-[13px] text-black/50">
            Select a form to manage its entries, or delete the entire form.
          </p>
          <div className="mt-5">
            {pageForms.map((form) => {
              const formSubs = submissionsByForm.get(form.id) ?? [];
              const last = formSubs
                .map((s) => s.submitted_at)
                .sort()
                .at(-1);
              return (
                <Row key={form.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setStep({
                        name: "entries",
                        origin: step.origin,
                        path: step.path,
                        formId: form.id,
                      })
                    }
                    className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-1 text-left"
                  >
                    <span className="font-dm-mono truncate text-[15px] font-medium text-black">
                      {getFormDisplayName(form)}
                    </span>
                    <span className="font-dm-mono text-[12px] text-black/45">
                      Entries: {formSubs.length}{" "}
                      {formSubs.length === 1 ? "submission" : "submissions"} ·
                      Last submission: {formatDate(last)}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <ActionLink
                      label="Delete all"
                      colorClass={DELETE_COLOR}
                      onClick={() =>
                        setPending({
                          kind: "forms",
                          label: `${getFormDisplayName(form)} on ${step.path}`,
                          formIds: [form.id],
                        })
                      }
                    />
                    <ChevronRight className="h-3.5 w-3.5 text-black/40" />
                  </div>
                </Row>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() =>
              setPending({
                kind: "page",
                label: `All forms on ${step.path}`,
                origin: step.origin,
                path: step.path,
              })
            }
            className="font-dm-mono mt-4 cursor-pointer text-[13px] font-medium tracking-[0.04em] text-[#F25430] uppercase transition-opacity hover:opacity-70"
          >
            Delete all forms on {step.path}
          </button>
        </>
      );
    }

    const form = pageForms.find((f) => f.id === step.formId);
    const entries = submissionsByForm.get(step.formId) ?? [];
    return (
      <>
        <p className="font-dm-mono text-sm font-semibold tracking-[0.08em] text-black uppercase">
          Entries
        </p>
        <p className="font-dm-mono mt-1 text-[13px] text-black/50 lowercase">
          {hostLabel(step.origin)}
          {step.path === "/" ? "" : step.path}/
          {form ? getFormDisplayName(form) : ""}
        </p>
        <div className="mt-5">
          {entries.length === 0 ? (
            <p className="font-dm-mono py-6 text-center text-[13px] text-black/40">
              No entries for this form.
            </p>
          ) : (
            entries.map((entry) => (
              <Row key={entry.id}>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6433CC] font-sans text-[13px] font-bold text-white">
                    {getSubmissionDisplayName(entry).charAt(0).toUpperCase()}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="font-dm-mono truncate text-[14px] font-medium text-black">
                      {getSubmissionDisplayName(entry)}
                    </span>
                    <span className="font-dm-mono text-[12px] text-black/45">
                      {formatDate(entry.submitted_at)}
                    </span>
                  </div>
                </div>
                <ActionLink
                  label="Delete"
                  colorClass={DELETE_COLOR}
                  onClick={() =>
                    setPending({
                      kind: "submissions",
                      label: `Entry from ${getSubmissionDisplayName(entry)}`,
                      submissionIds: [entry.id],
                    })
                  }
                />
              </Row>
            ))
          )}
        </div>
        {entries.length > 0 ? (
          <button
            type="button"
            onClick={() =>
              setPending({
                kind: "submissions",
                label: `All entries for ${form ? getFormDisplayName(form) : "this form"}`,
                submissionIds: entries.map((e) => e.id),
              })
            }
            className="font-dm-mono mt-4 cursor-pointer text-[13px] font-medium tracking-[0.04em] text-[#F25430] uppercase transition-opacity hover:opacity-70"
          >
            Delete all entries
          </button>
        ) : null}
      </>
    );
  })();

  return (
    <ManagerShell
      title="Delete"
      level={LEVEL[step.name]}
      isBusy={isDeleting || showSuccess}
      onClose={onClose}
      onCrumb={handleCrumb}
      overlay={
        showSuccess ? (
          <SuccessDialog />
        ) : pending ? (
          <ConfirmDialog
            label={pending.label}
            isDeleting={isDeleting}
            onCancel={() => setPending(null)}
            onConfirm={confirmPending}
          />
        ) : undefined
      }
    >
      {body}
    </ManagerShell>
  );
}
