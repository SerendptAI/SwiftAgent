"use client";

import { ChevronRight, FileText, Globe } from "lucide-react";
import { useEffect, useState } from "react";

import {
  useDeletableFormGroups,
  useDeletablePages,
  useDeletableWebsites,
  usePageFormSubmissions,
} from "@/hooks/use-forms";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Form, Submission } from "@/services/forms";
import { getSubmissionDisplayName } from "@/services/forms";

import { formatDate, formatDateTime, hostLabel } from "./forms-hierarchy";
import {
  ActionLink,
  CancelButton,
  CountPill,
  HintText,
  ManagerShell,
  PathChip,
  PixelTrashIcon,
  Row,
  SectionIntro,
  SolidActionButton,
} from "./forms-manager-ui";

type Step =
  | { name: "websites" }
  | { name: "pages"; form: Form }
  | { name: "forms"; form: Form; pagePath: string }
  | {
      name: "entries";
      form: Form;
      pagePath: string;
      formIdentifier: string;
      formName: string;
    };

type Pending =
  | { kind: "website"; path: string; form: Form }
  | { kind: "page"; path: string; formId: string; pagePath: string }
  | {
      kind: "formGroup";
      path: string;
      formId: string;
      pagePath: string;
      formIdentifier: string;
    }
  | { kind: "submissions"; path: string; submissionIds: string[] };

const LEVEL: Record<Step["name"], 0 | 1 | 2> = {
  websites: 0,
  pages: 1,
  forms: 2,
  entries: 2,
};

const DELETE_COLOR = "text-[#F25430]";

function formSlug(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

function getEntryPreview(entry: Submission): string {
  if (entry.submitter_preview?.trim()) return entry.submitter_preview.trim();
  for (const val of Object.values(entry.data)) {
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return "—";
}

function ShadowButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-dm-mono flex h-[38px] w-full max-w-[378px] items-center justify-center rounded-[8px] bg-[#F25430] text-[14px] font-medium text-white uppercase shadow-[-3px_4px_0px_0px_#000000] ${
        onClick ? "cursor-pointer transition-colors hover:bg-[#d94526]" : ""
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {label}
    </button>
  );
}

function ConfirmBody({
  path,
  isDeleting,
  onConfirm,
}: {
  path: string;
  isDeleting: boolean;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 pt-14 pb-10">
      <PixelTrashIcon className="h-[94px] w-[94px] text-black" />
      <h3 className="font-greed-narrow mt-7 text-center text-[44px] leading-[1.05] font-medium text-black">
        Are you sure
        <br />
        you want to delete
        <br />
        this ?
      </h3>
      <div className="mt-5 flex w-full justify-center">
        <PathChip>{path}</PathChip>
      </div>
      <div className="mt-12 flex w-full justify-center">
        <ShadowButton
          label={isDeleting ? "Deleting..." : "Delete"}
          onClick={onConfirm}
          disabled={isDeleting}
        />
      </div>
    </div>
  );
}

function SuccessBody({ path }: { path: string }) {
  return (
    <div className="flex flex-col items-center px-6 pt-14 pb-10">
      <div className="relative">
        <PixelTrashIcon className="h-[94px] w-[94px] text-black" />
        <span className="absolute -top-1 -right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#F25430]">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
            <path
              d="M5 12.5l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <h3 className="font-greed-narrow mt-7 text-center text-[44px] leading-[1.05] font-medium text-black">
        Deletion
        <br />
        Successful
      </h3>
      <div className="mt-5 flex w-full justify-center">
        <PathChip>{path}</PathChip>
      </div>
      <div className="mt-12 flex w-full justify-center">
        <ShadowButton label="Closing automatically...." />
      </div>
    </div>
  );
}

interface FormsDeleteManagerProps {
  open: boolean;
  forms: Form[];
  isDeleting: boolean;
  onClose: () => void;
  onDeleteWebsite: (form: Form) => Promise<void>;
  onDeletePage: (formId: string, pagePath: string) => Promise<void>;
  onDeleteFormGroup: (
    formId: string,
    pagePath: string,
    formIdentifier: string,
  ) => Promise<void>;
  onDeleteSubmissions: (submissionIds: string[]) => Promise<void>;
}

export function FormsDeleteManager({
  open,
  forms,
  isDeleting,
  onClose,
  onDeleteWebsite,
  onDeletePage,
  onDeleteFormGroup,
  onDeleteSubmissions,
}: FormsDeleteManagerProps) {
  const [step, setStep] = useState<Step>({ name: "websites" });
  const [pending, setPending] = useState<Pending | null>(null);
  const [successPath, setSuccessPath] = useState<string | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (open) {
      setStep({ name: "websites" });
      setPending(null);
      setSuccessPath(null);
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
    if (!successPath) return;
    const id = window.setTimeout(onClose, 1600);
    return () => window.clearTimeout(id);
  }, [successPath, onClose]);

  const websites = forms.filter((f) => f.type === "website" && f.website_link);
  const { data: deletableWebsites = [] } = useDeletableWebsites(open);
  const { data: deletablePages = [], isLoading: pagesLoading } =
    useDeletablePages(
      step.name === "pages" ? step.form.id : null,
      open && step.name === "pages",
    );
  const { data: deletableForms = [], isLoading: formsLoading } =
    useDeletableFormGroups(
      step.name === "forms" ? step.form.id : null,
      step.name === "forms" ? step.pagePath : null,
      open && step.name === "forms",
    );
  const formCountByWebsite = new Map<string, number>();
  for (const w of deletableWebsites) {
    formCountByWebsite.set(w.website, w.form_count);
    formCountByWebsite.set(hostLabel(w.website), w.form_count);
  }
  const { data: entries = [] } = usePageFormSubmissions(
    open && step.name === "entries" ? step.form.id : null,
    step.name === "entries" ? step.pagePath : null,
    step.name === "entries" ? step.formIdentifier : null,
  );

  if (!open) return null;

  const handleCrumb = (target: 0 | 1) => {
    if (target === 0) setStep({ name: "websites" });
    else if (target === 1 && step.name !== "websites")
      setStep({ name: "pages", form: step.form });
  };

  const confirmPending = async () => {
    if (!pending) return;
    if (pending.kind === "submissions") {
      await onDeleteSubmissions(pending.submissionIds);
    } else if (pending.kind === "website") {
      await onDeleteWebsite(pending.form);
    } else if (pending.kind === "page") {
      await onDeletePage(pending.formId, pending.pagePath);
    } else {
      await onDeleteFormGroup(
        pending.formId,
        pending.pagePath,
        pending.formIdentifier,
      );
    }
    setSuccessPath(pending.path);
    setPending(null);
  };

  const stepPath = (() => {
    if (step.name === "websites") return undefined;
    const host = hostLabel(step.form.website_link!);
    if (step.name === "pages") return host;
    if (step.name === "forms") return `${host}${step.pagePath}`;
    return `${host}${step.pagePath}/${formSlug(step.formName)}/entries`;
  })();

  const listBody = (() => {
    if (step.name === "websites") {
      return (
        <div className="flex flex-col gap-4 p-6">
          <SectionIntro
            title="Select a website"
            sub="Choose the website whose forms you want to manage."
          />
          <div className="flex flex-col">
            {websites.length === 0 ? (
              <p className="font-stolzl py-6 text-center text-[13px] text-[#7E7E7E]">
                No website forms to manage.
              </p>
            ) : (
              websites.map((site) => {
                const groupCount =
                  formCountByWebsite.get(site.website_link!) ??
                  formCountByWebsite.get(hostLabel(site.website_link!)) ??
                  null;
                return (
                  <Row key={site.id}>
                    <button
                      type="button"
                      onClick={() => setStep({ name: "pages", form: site })}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                    >
                      <Globe className="h-4 w-4 shrink-0 text-black" />
                      <span className="font-dm-mono min-w-0 truncate text-[18px] text-black uppercase">
                        {site.website_link}
                      </span>
                    </button>
                    <div className="flex shrink-0 items-center gap-4">
                      <ActionLink
                        label="Delete all"
                        colorClass={DELETE_COLOR}
                        onClick={() =>
                          setPending({
                            kind: "website",
                            path: hostLabel(site.website_link!),
                            form: site,
                          })
                        }
                      />
                      {groupCount !== null && (
                        <CountPill>
                          {groupCount} {groupCount === 1 ? "form" : "forms"}
                        </CountPill>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-black" />
                    </div>
                  </Row>
                );
              })
            )}
          </div>
          <HintText>
            Click a website to view its pages, or &apos;Delete all&apos; to
            remove everything.
          </HintText>
        </div>
      );
    }

    if (step.name === "pages") {
      const pages = deletablePages;
      return (
        <div className="flex flex-col gap-4 p-6">
          <SectionIntro
            title="Select a page"
            sub={`Pages that have forms on ${step.form.website_link}`}
          />
          <div className="flex flex-col">
            {pagesLoading ? (
              <p className="font-stolzl py-6 text-center text-[13px] text-[#7E7E7E]">
                Loading pages…
              </p>
            ) : pages.length === 0 ? (
              <p className="font-stolzl py-6 text-center text-[13px] text-[#7E7E7E]">
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
                    <FileText className="h-4 w-4 shrink-0 text-black" />
                    <span className="font-dm-mono min-w-0 truncate text-[18px] text-black lowercase">
                      {page.page_path}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-4">
                    <ActionLink
                      label="Delete page"
                      colorClass={DELETE_COLOR}
                      uppercase={false}
                      onClick={() =>
                        setPending({
                          kind: "page",
                          path: `${hostLabel(step.form.website_link!)}${page.page_path}`,
                          formId: step.form.id,
                          pagePath: page.page_path,
                        })
                      }
                    />
                    <CountPill>
                      {page.entries_count}{" "}
                      {page.entries_count === 1 ? "entry" : "entries"}
                    </CountPill>
                    <ChevronRight className="h-3.5 w-3.5 text-black" />
                  </div>
                </Row>
              ))
            )}
          </div>
          <HintText>
            Click a page to see its forms, or delete the entire page&apos;s
            forms.
          </HintText>
        </div>
      );
    }

    if (step.name === "forms") {
      const pageForms = deletableForms;
      return (
        <div className="flex flex-col gap-4 p-6">
          <SectionIntro
            title="Forms on this page"
            sub="Select a form to manage its entries, or delete the entire form."
          />
          <div className="flex flex-col gap-3">
            {formsLoading ? (
              <p className="font-stolzl py-6 text-center text-[13px] text-[#7E7E7E]">
                Loading forms…
              </p>
            ) : pageForms.length === 0 ? (
              <p className="font-stolzl py-6 text-center text-[13px] text-[#7E7E7E]">
                No forms on this page.
              </p>
            ) : (
              pageForms.map((group) => (
                <div
                  key={group.form_identifier}
                  className="flex items-center justify-between gap-3 border border-[#EDEDED] p-4"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setStep({
                        name: "entries",
                        form: step.form,
                        pagePath: step.pagePath,
                        formIdentifier: group.form_identifier,
                        formName: group.form_name,
                      })
                    }
                    className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-1 text-left"
                  >
                    <span className="font-dm-mono truncate text-[14px] font-medium text-black">
                      {group.form_name}
                    </span>
                    <span className="font-stolzl text-[11px] text-[#7E7E7E]">
                      Entries: {group.entries_count}{" "}
                      {group.entries_count === 1 ? "submission" : "submissions"}
                    </span>
                    <span className="font-stolzl text-[11px] text-[#7E7E7E]">
                      Last submission: {formatDate(group.last_submission)}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <SolidActionButton
                      label="Delete form"
                      colorClass="bg-[#F25430]"
                      onClick={() =>
                        setPending({
                          kind: "formGroup",
                          path: `${hostLabel(step.form.website_link!)}${step.pagePath}/${formSlug(group.form_name)}`,
                          formId: step.form.id,
                          pagePath: step.pagePath,
                          formIdentifier: group.form_identifier,
                        })
                      }
                    />
                    <ChevronRight className="h-3.5 w-3.5 text-black" />
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              setPending({
                kind: "page",
                path: `${hostLabel(step.form.website_link!)}${step.pagePath}`,
                formId: step.form.id,
                pagePath: step.pagePath,
              })
            }
            className="font-dm-mono cursor-pointer text-left text-[13px] font-medium text-[#F25430] uppercase transition-opacity hover:opacity-70"
          >
            Delete all forms on {step.pagePath}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 p-6">
        <SectionIntro
          title="Entries in this form"
          sub="Delete individual submissions or clear all at once."
        />
        <div className="flex flex-col">
          {entries.length === 0 ? (
            <p className="font-stolzl py-6 text-center text-[13px] text-[#7E7E7E]">
              No entries for this form.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 border-b border-[#EDEDED] py-3 last:border-b-0"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6433CC] font-sans text-[13px] font-bold text-white">
                    {getSubmissionDisplayName(entry).charAt(0).toUpperCase()}
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-dm-mono truncate text-[14px] font-medium text-black">
                      {getSubmissionDisplayName(entry)}
                    </span>
                    <span className="font-stolzl truncate text-[12px] text-[#7E7E7E]">
                      {getEntryPreview(entry)}
                    </span>
                    <span className="font-stolzl text-[11px] text-[#7E7E7E]">
                      {formatDateTime(entry.submitted_at)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPending({
                      kind: "submissions",
                      path: stepPath!,
                      submissionIds: [entry.id],
                    })
                  }
                  className="font-dm-mono h-7 shrink-0 cursor-pointer rounded-[6px] border border-[#F25430] px-3 text-[11px] font-medium text-[#F25430] uppercase transition-colors hover:bg-[#F25430]/5"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        {entries.length > 0 ? (
          <button
            type="button"
            onClick={() =>
              setPending({
                kind: "submissions",
                path: stepPath!,
                submissionIds: entries.map((e) => e.id),
              })
            }
            className="font-dm-mono cursor-pointer text-left text-[13px] font-medium text-[#F25430] uppercase transition-opacity hover:opacity-70"
          >
            Delete all entries in {step.formName}
          </button>
        ) : null}
      </div>
    );
  })();

  if (successPath) {
    return (
      <ManagerShell
        title="Delete?"
        level={LEVEL[step.name]}
        isBusy
        onClose={onClose}
        onCrumb={() => undefined}
        footer={null}
      >
        <SuccessBody path={successPath} />
      </ManagerShell>
    );
  }

  if (pending) {
    return (
      <ManagerShell
        title="Delete?"
        level={LEVEL[step.name]}
        isBusy={isDeleting}
        onClose={onClose}
        onCrumb={handleCrumb}
        footer={
          <CancelButton
            onClick={() => setPending(null)}
            disabled={isDeleting}
          />
        }
      >
        <ConfirmBody
          path={pending.path}
          isDeleting={isDeleting}
          onConfirm={confirmPending}
        />
      </ManagerShell>
    );
  }

  return (
    <ManagerShell
      title="Delete"
      level={LEVEL[step.name]}
      path={stepPath}
      isBusy={isDeleting}
      onClose={onClose}
      onCrumb={handleCrumb}
    >
      {listBody}
    </ManagerShell>
  );
}
