"use client";

import { ChevronRight, FileText, Globe, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Form, Submission } from "@/services/forms";
import { getFormDisplayName, getSubmissionDisplayName } from "@/services/forms";

type Step =
  | { name: "websites" }
  | { name: "pages"; origin: string }
  | { name: "forms"; origin: string; path: string }
  | { name: "entries"; origin: string; path: string; formId: string };

type Pending =
  | { kind: "website"; label: string; formIds: string[] }
  | { kind: "page"; label: string; formIds: string[] }
  | { kind: "form"; label: string; formIds: string[] }
  | { kind: "entry"; label: string; submissionIds: string[] }
  | { kind: "allEntries"; label: string; submissionIds: string[] };

const CRUMB_LEVEL: Record<Step["name"], number> = {
  websites: 0,
  pages: 1,
  forms: 2,
  entries: 2,
};

function urlParts(link?: string): { origin: string; path: string } | null {
  if (!link) return null;
  try {
    const url = new URL(link.includes("://") ? link : `https://${link}`);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return { origin: url.origin, path };
  } catch {
    return null;
  }
}

function hostLabel(origin: string): string {
  return origin.replace(/^https?:\/\//, "");
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
}

interface WebsiteGroup {
  origin: string;
  forms: Form[];
  entryCount: number;
}

interface PageGroup {
  path: string;
  forms: Form[];
  entryCount: number;
}

function CountPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-dm-mono rounded-md bg-[#F3F3F3] px-2 py-0.5 text-[11px] tracking-wide text-black/55 uppercase">
      {children}
    </span>
  );
}

function DeleteAllLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-dm-mono cursor-pointer text-[13px] font-medium tracking-[0.04em] text-[#F25430] uppercase transition-opacity hover:opacity-70"
    >
      Delete all
    </button>
  );
}

function Crumb({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
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

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F0F0F0] py-3.5 last:border-b-0">
      {children}
    </div>
  );
}

function ConfirmDialog({
  pending,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  pending: Pending;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 px-6">
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col items-center gap-2 border-b border-dashed border-[#E5E5E5] bg-[#FAFAFA] px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDEEE9]">
            <X className="h-5 w-5 text-[#F25430]" />
          </span>
        </div>
        <div className="px-6 py-6">
          <h3 className="font-dm-mono text-2xl font-bold tracking-[-0.01em] text-black">
            Are you sure?
          </h3>
          <p className="font-dm-mono mt-2 text-sm text-black/60">
            {pending.label}
          </p>
          <p className="font-dm-mono mt-3 text-[13px] text-[#F25430]">
            This action is permanent and cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t border-[#EDEDED] px-6 py-4">
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
            className="font-dm-mono cursor-pointer rounded-lg bg-[#F25430] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#d94526] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
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
}

export function FormsDeleteManager({
  open,
  forms,
  submissions,
  isDeleting,
  onClose,
  onDeleteForms,
  onDeleteSubmissions,
}: FormsDeleteManagerProps) {
  const [step, setStep] = useState<Step>({ name: "websites" });
  const [pending, setPending] = useState<Pending | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (open) {
      setStep({ name: "websites" });
      setPending(null);
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

  const submissionsByForm = useMemo(() => {
    const map = new Map<string, Submission[]>();
    for (const s of submissions) {
      const list = map.get(s.form_id);
      if (list) list.push(s);
      else map.set(s.form_id, [s]);
    }
    return map;
  }, [submissions]);

  const websites = useMemo<WebsiteGroup[]>(() => {
    const map = new Map<string, WebsiteGroup>();
    for (const form of forms) {
      const parts = urlParts(form.website_link);
      if (!parts) continue;
      const group = map.get(parts.origin) ?? {
        origin: parts.origin,
        forms: [],
        entryCount: 0,
      };
      group.forms.push(form);
      group.entryCount += submissionsByForm.get(form.id)?.length ?? 0;
      map.set(parts.origin, group);
    }
    return [...map.values()].sort((a, b) => b.forms.length - a.forms.length);
  }, [forms, submissionsByForm]);

  const pages = useMemo<PageGroup[]>(() => {
    if (step.name === "websites") return [];
    const origin = "origin" in step ? step.origin : "";
    const map = new Map<string, PageGroup>();
    for (const form of forms) {
      const parts = urlParts(form.website_link);
      if (!parts || parts.origin !== origin) continue;
      const group = map.get(parts.path) ?? {
        path: parts.path,
        forms: [],
        entryCount: 0,
      };
      group.forms.push(form);
      group.entryCount += submissionsByForm.get(form.id)?.length ?? 0;
      map.set(parts.path, group);
    }
    return [...map.values()].sort((a, b) => b.entryCount - a.entryCount);
  }, [forms, submissionsByForm, step]);

  const pageForms = useMemo<Form[]>(() => {
    if (step.name !== "forms" && step.name !== "entries") return [];
    return forms.filter((form) => {
      const parts = urlParts(form.website_link);
      return parts?.origin === step.origin && parts.path === step.path;
    });
  }, [forms, step]);

  if (!open) return null;

  const level = CRUMB_LEVEL[step.name];

  const confirmPending = async () => {
    if (!pending) return;
    if (pending.kind === "entry" || pending.kind === "allEntries") {
      await onDeleteSubmissions(pending.submissionIds);
    } else {
      await onDeleteForms(pending.formIds);
    }
    setPending(null);
  };

  const renderBody = () => {
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
                    <DeleteAllLink
                      onClick={() =>
                        setPending({
                          kind: "website",
                          label: `All forms on ${hostLabel(site.origin)}`,
                          formIds: site.forms.map((f) => f.id),
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
                  <DeleteAllLink
                    onClick={() =>
                      setPending({
                        kind: "page",
                        label: `All forms on ${page.path}`,
                        formIds: page.forms.map((f) => f.id),
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
                    <DeleteAllLink
                      onClick={() =>
                        setPending({
                          kind: "form",
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
                formIds: pageForms.map((f) => f.id),
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
                <DeleteAllLink
                  onClick={() =>
                    setPending({
                      kind: "entry",
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
                kind: "allEntries",
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
  };

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center px-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close delete manager"
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={isDeleting ? undefined : onClose}
        disabled={isDeleting}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="forms-delete-title"
        className="relative flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2
            id="forms-delete-title"
            className="font-dm-mono text-2xl font-bold tracking-[-0.01em] text-black"
          >
            Delete
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-black/50 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-[#EDEDED] px-6 pb-3">
          <button
            type="button"
            onClick={() => setStep({ name: "websites" })}
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
            disabled={step.name === "websites"}
            onClick={() =>
              step.name !== "websites" &&
              setStep({ name: "pages", origin: step.origin })
            }
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

        <div className="px-6 py-6">{renderBody()}</div>

        <div className="flex justify-end border-t border-[#EDEDED] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="font-dm-mono cursor-pointer rounded-lg border border-[#E5E5E5] px-5 py-2 text-sm text-black/70 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>

        {pending ? (
          <ConfirmDialog
            pending={pending}
            isDeleting={isDeleting}
            onCancel={() => setPending(null)}
            onConfirm={confirmPending}
          />
        ) : null}
      </section>
    </div>
  );
}
