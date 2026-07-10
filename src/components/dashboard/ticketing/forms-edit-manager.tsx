"use client";

import { ChevronRight, FileText, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Form, FormOverview } from "@/services/forms";

import { formatDate, hostLabel } from "./forms-hierarchy";
import { ActionLink, CountPill, ManagerShell, Row } from "./forms-manager-ui";

type Step =
  | { name: "websites" }
  | { name: "pages"; form: Form }
  | { name: "forms"; form: Form; pagePath: string };

type RenameTarget =
  | { kind: "website"; kindLabel: string; current: string; form: Form }
  | {
      kind: "form";
      kindLabel: string;
      current: string;
      formId: string;
      pagePath: string;
      formIdentifier: string;
    };

const LEVEL: Record<Step["name"], 0 | 1 | 2> = {
  websites: 0,
  pages: 1,
  forms: 2,
};

const EDIT_COLOR = "text-[#006BE5]";

function RenameDialog({
  target,
  isSaving,
  onCancel,
  onSave,
}: {
  target: RenameTarget;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (next: string) => void;
}) {
  const [value, setValue] = useState(target.current);
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmed = value.trim();
  const canSave = !isSaving && trimmed.length > 0 && trimmed !== target.current;

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 px-6">
      <div className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-dm-mono text-[11px] tracking-[0.1em] text-black/40 uppercase">
              Current name
            </p>
            <p className="font-dm-mono mt-1 truncate text-[15px] font-medium text-black">
              {target.current}
            </p>
          </div>
          <span className="text-black/25">→</span>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="forms-rename-input"
              className="font-dm-mono text-[11px] tracking-[0.1em] text-black/40 uppercase"
            >
              New name
            </label>
            <input
              id="forms-rename-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) onSave(trimmed);
              }}
              className="font-dm-mono mt-1 w-full border-b border-[#E5E5E5] pb-1 text-[15px] font-medium text-black focus:border-[#006BE5] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="font-dm-mono text-[11px] tracking-[0.1em] text-black/40 uppercase">
            Preview
          </p>
          <div className="mt-2 rounded-xl border border-[#EDEDED] bg-[#F9FAFB] px-4 py-3">
            <span className="font-dm-mono text-[15px] font-medium text-black">
              {trimmed || target.current}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="font-dm-mono cursor-pointer rounded-lg border border-[#E5E5E5] px-5 py-2 text-sm text-black/70 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(trimmed)}
            className="font-dm-mono cursor-pointer rounded-lg bg-[#006BE5] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#005fca] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save name"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FormsEditManagerProps {
  open: boolean;
  forms: Form[];
  overviews: Record<string, FormOverview>;
  isRenaming: boolean;
  onRenameWebsite: (form: Form, nextName: string) => Promise<void>;
  onRenameForm: (
    formId: string,
    pagePath: string,
    formIdentifier: string,
    nextName: string,
  ) => Promise<void>;
  onClose: () => void;
}

export function FormsEditManager({
  open,
  forms,
  overviews,
  isRenaming,
  onRenameWebsite,
  onRenameForm,
  onClose,
}: FormsEditManagerProps) {
  const toast = useToast();
  const [step, setStep] = useState<Step>({ name: "websites" });
  const [rename, setRename] = useState<RenameTarget | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (open) {
      setStep({ name: "websites" });
      setRename(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || isRenaming) return;
      if (rename) setRename(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, rename, isRenaming, onClose]);

  if (!open) return null;

  const websites = forms.filter((f) => f.type === "website" && f.website_link);

  const handleCrumb = (target: 0 | 1) => {
    if (target === 0) setStep({ name: "websites" });
    else if (target === 1 && step.name !== "websites")
      setStep({ name: "pages", form: step.form });
  };

  const saveRename = async (next: string) => {
    if (!rename) return;
    const previous = rename.current;
    try {
      if (rename.kind === "form") {
        await onRenameForm(
          rename.formId,
          rename.pagePath,
          rename.formIdentifier,
          next,
        );
      } else {
        await onRenameWebsite(rename.form, next);
      }
    } catch {
      toast.error(`Couldn't rename the ${rename.kindLabel}. Please try again.`);
      return;
    }
    setRename(null);
    toast.success(`Renamed "${previous}" to "${next}".`);
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
              websites.map((site) => {
                const overview = overviews[site.id];
                return (
                  <Row key={site.id}>
                    <button
                      type="button"
                      onClick={() => setStep({ name: "pages", form: site })}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                    >
                      <Globe className="h-4 w-4 shrink-0 text-black/60" />
                      <span className="font-dm-mono min-w-0 truncate text-[15px] tracking-[0.02em] text-black lowercase">
                        {site.website_link}
                      </span>
                    </button>
                    <div className="flex shrink-0 items-center gap-3">
                      <ActionLink
                        label="Edit name"
                        colorClass={EDIT_COLOR}
                        onClick={() =>
                          setRename({
                            kind: "website",
                            kindLabel: "website",
                            current: hostLabel(site.website_link!),
                            form: site,
                          })
                        }
                      />
                      {overview && (
                        <CountPill>
                          {overview.total_entries}{" "}
                          {overview.total_entries === 1 ? "entry" : "entries"}
                        </CountPill>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-black/40" />
                    </div>
                  </Row>
                );
              })
            )}
          </div>
          <p className="font-dm-mono mt-4 text-[13px] text-black/40">
            Click a website to view its pages, or edit its display name.
          </p>
        </>
      );
    }

    if (step.name === "pages") {
      const pages = overviews[step.form.id]?.pages ?? [];
      return (
        <>
          <p className="font-dm-mono text-sm font-semibold tracking-[0.08em] text-black uppercase">
            Select a page
          </p>
          <p className="font-dm-mono mt-1 text-[13px] text-black/50">
            Pages that have forms on {step.form.website_link}
          </p>
          <div className="mt-5">
            {pages.length === 0 ? (
              <p className="font-dm-mono py-6 text-center text-[13px] text-black/40">
                No pages with forms yet.
              </p>
            ) : (
              pages.map((page) => (
                <Row key={page.page_path}>
                  <button
                    type="button"
                    onClick={() =>
                      setStep({
                        name: "forms",
                        form: step.form,
                        pagePath: page.page_path,
                      })
                    }
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-black/60" />
                    <span className="font-dm-mono min-w-0 truncate text-[15px] tracking-[0.02em] text-black lowercase">
                      {page.page_path}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <CountPill>
                      {page.total_entries}{" "}
                      {page.total_entries === 1 ? "entry" : "entries"}
                    </CountPill>
                    <ChevronRight className="h-3.5 w-3.5 text-black/40" />
                  </div>
                </Row>
              ))
            )}
          </div>
          <p className="font-dm-mono mt-4 text-[13px] text-black/40">
            Click a page to see its forms.
          </p>
        </>
      );
    }

    const pageForms =
      overviews[step.form.id]?.pages.find(
        (page) => page.page_path === step.pagePath,
      )?.forms ?? [];
    return (
      <>
        <p className="font-dm-mono text-sm font-semibold tracking-[0.08em] text-black uppercase">
          Forms on this page
        </p>
        <p className="font-dm-mono mt-1 text-[13px] text-black/50">
          Select a form to edit its name.
        </p>
        <div className="mt-5">
          {pageForms.map((group) => (
            <Row key={group.form_identifier}>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="font-dm-mono truncate text-[15px] font-medium text-black">
                  {group.form_name}
                </span>
                <span className="font-dm-mono text-[12px] text-black/45">
                  Entries: {group.entries_count}{" "}
                  {group.entries_count === 1 ? "submission" : "submissions"} ·
                  Last submission: {formatDate(group.last_submission)}
                </span>
              </div>
              <ActionLink
                label="Edit form name"
                colorClass={EDIT_COLOR}
                onClick={() =>
                  setRename({
                    kind: "form",
                    kindLabel: "form",
                    current: group.form_name,
                    formId: step.form.id,
                    pagePath: step.pagePath,
                    formIdentifier: group.form_identifier,
                  })
                }
              />
            </Row>
          ))}
        </div>
      </>
    );
  })();

  return (
    <ManagerShell
      title="Edit name?"
      level={LEVEL[step.name]}
      isBusy={isRenaming}
      onClose={onClose}
      onCrumb={handleCrumb}
      overlay={
        rename ? (
          <RenameDialog
            target={rename}
            isSaving={isRenaming}
            onCancel={() => setRename(null)}
            onSave={saveRename}
          />
        ) : undefined
      }
    >
      {body}
    </ManagerShell>
  );
}
