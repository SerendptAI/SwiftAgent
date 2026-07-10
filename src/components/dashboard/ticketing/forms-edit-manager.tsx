"use client";

import { ChevronRight, FileText, Globe } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Form, FormOverview } from "@/services/forms";

import { formatDate, hostLabel } from "./forms-hierarchy";
import {
  ActionLink,
  CancelButton,
  CountPill,
  FormCheckIcon,
  HintText,
  ManagerShell,
  Row,
  SectionIntro,
  SolidActionButton,
} from "./forms-manager-ui";

type Step =
  | { name: "websites" }
  | { name: "pages"; form: Form }
  | { name: "forms"; form: Form; pagePath: string };

type RenameTarget =
  | { kind: "website"; current: string; form: Form; meta?: string }
  | { kind: "page"; current: string; form: Form; path: string; meta?: string }
  | {
      kind: "form";
      current: string;
      formId: string;
      pagePath: string;
      formIdentifier: string;
      meta?: string;
    };

const LEVEL: Record<Step["name"], 0 | 1 | 2> = {
  websites: 0,
  pages: 1,
  forms: 2,
};

const EDIT_COLOR = "text-[#03A84E]";

const HELPER_TEXT: Record<RenameTarget["kind"], string> = {
  website: "This name appears as the website label in your dashboard.",
  page: "This name appears as the page label in your dashboard.",
  form: "This name appears as the form title in your dashboard and submissions.",
};

function targetIcon(kind: RenameTarget["kind"]): ReactNode {
  if (kind === "website")
    return <Globe className="h-[18px] w-[18px] shrink-0 text-black" />;
  if (kind === "page")
    return <FileText className="h-[18px] w-[18px] shrink-0 text-black" />;
  return <FormCheckIcon className="h-[18px] w-[18px] shrink-0 text-black" />;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-stolzl text-[11px] font-normal text-[#7E7E7E] uppercase">
      {children}
    </p>
  );
}

function PreviewCard({
  icon,
  name,
  meta,
}: {
  icon: ReactNode;
  name: string;
  meta?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5 border border-[#EDEDED] bg-[#F6F6F6] p-3">
      <div className="flex min-w-0 items-center gap-2">
        {icon}
        <span className="font-dm-mono min-w-0 truncate text-[14px] font-medium text-black">
          {name}
        </span>
      </div>
      {meta && <p className="font-stolzl text-[11px] text-[#7E7E7E]">{meta}</p>}
    </div>
  );
}

function SaveButton({
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
      className={`font-dm-mono flex h-9 min-w-[110px] items-center justify-center rounded-[8px] bg-[#03A84E] px-4 text-[13px] font-medium text-white uppercase shadow-[-3px_4px_0px_0px_#000000] ${
        onClick ? "cursor-pointer transition-colors hover:bg-[#029143]" : ""
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

function RenameBody({
  target,
  value,
  onChange,
  canSave,
  onSubmit,
}: {
  target: RenameTarget;
  value: string;
  onChange: (value: string) => void;
  canSave: boolean;
  onSubmit: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className="flex flex-col gap-[5px] p-6">
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Current name</FieldLabel>
        <p className="font-dm-mono text-[16px] text-[#7E7E7E] line-through">
          {target.current}
        </p>
      </div>
      <div className="flex justify-center">
        <span className="font-dm-mono text-[16px] text-[#C0C0C0]">→</span>
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel>New name</FieldLabel>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSave) onSubmit();
          }}
          className="font-dm-mono h-11 w-full border border-[#EDEDED] bg-white px-3 text-[16px] text-black caret-[#03A84E] outline-none focus:border-[#03A84E]"
        />
        <p className="font-stolzl text-[11px] font-normal text-[#7E7E7E]">
          {HELPER_TEXT[target.kind]}
        </p>
      </div>
      <div className="flex flex-col gap-2.5 py-[25px]">
        <FieldLabel>Preview</FieldLabel>
        <PreviewCard
          icon={targetIcon(target.kind)}
          name={value.trim() || target.current}
          meta={target.meta}
        />
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
  onRenamePage: (
    form: Form,
    oldPath: string,
    nextName: string,
  ) => Promise<void>;
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
  onRenamePage,
  onRenameForm,
  onClose,
}: FormsEditManagerProps) {
  const toast = useToast();
  const [step, setStep] = useState<Step>({ name: "websites" });
  const [rename, setRename] = useState<RenameTarget | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [saved, setSaved] = useState<{
    kind: RenameTarget["kind"];
    name: string;
    meta?: string;
  } | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (open) {
      setStep({ name: "websites" });
      setRename(null);
      setRenameValue("");
      setSaved(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || isRenaming || saved) return;
      if (rename) setRename(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, rename, saved, isRenaming, onClose]);

  useEffect(() => {
    if (!saved) return;
    const id = window.setTimeout(onClose, 1400);
    return () => window.clearTimeout(id);
  }, [saved, onClose]);

  if (!open) return null;

  const websites = forms.filter((f) => f.type === "website" && f.website_link);

  const handleCrumb = (target: 0 | 1) => {
    if (target === 0) setStep({ name: "websites" });
    else if (target === 1 && step.name !== "websites")
      setStep({ name: "pages", form: step.form });
  };

  const openRename = (target: RenameTarget) => {
    setRename(target);
    setRenameValue(target.current);
  };

  const trimmedValue = renameValue.trim();
  const canSave =
    !isRenaming && trimmedValue.length > 0 && trimmedValue !== rename?.current;

  const saveRename = async () => {
    if (!rename || !canSave) return;
    try {
      if (rename.kind === "form") {
        await onRenameForm(
          rename.formId,
          rename.pagePath,
          rename.formIdentifier,
          trimmedValue,
        );
      } else if (rename.kind === "page") {
        await onRenamePage(rename.form, rename.path, trimmedValue);
      } else {
        await onRenameWebsite(rename.form, trimmedValue);
      }
    } catch {
      toast.error(`Couldn't rename the ${rename.kind}. Please try again.`);
      return;
    }
    setSaved({ kind: rename.kind, name: trimmedValue, meta: rename.meta });
    setRename(null);
  };

  const stepPath = (() => {
    if (step.name === "websites") return undefined;
    const host = hostLabel(step.form.website_link!);
    return step.name === "pages" ? host : `${host}${step.pagePath}`;
  })();

  const renamePath = (() => {
    if (!rename && !saved) return undefined;
    if (rename?.kind === "page") return hostLabel(rename.form.website_link!);
    return stepPath;
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
                const overview = overviews[site.id];
                const groupCount = overview
                  ? overview.pages.reduce((n, p) => n + p.forms.length, 0)
                  : null;
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
                        label="Edit name"
                        colorClass={EDIT_COLOR}
                        onClick={() =>
                          openRename({
                            kind: "website",
                            current: hostLabel(site.website_link!),
                            form: site,
                            meta:
                              groupCount !== null
                                ? `${groupCount} ${groupCount === 1 ? "form" : "forms"}`
                                : undefined,
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
            Click a website to view its pages, or edit its display name.
          </HintText>
        </div>
      );
    }

    if (step.name === "pages") {
      const pages = overviews[step.form.id]?.pages ?? [];
      return (
        <div className="flex flex-col gap-4 p-6">
          <SectionIntro
            title="Select a page"
            sub={`Pages that have forms on ${step.form.website_link}`}
          />
          <div className="flex flex-col">
            {pages.length === 0 ? (
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
                      label="Edit page name"
                      colorClass={EDIT_COLOR}
                      uppercase={false}
                      onClick={() =>
                        openRename({
                          kind: "page",
                          current: page.page_path,
                          form: step.form,
                          path: page.page_path,
                          meta: `${page.total_entries} ${page.total_entries === 1 ? "entry" : "entries"}`,
                        })
                      }
                    />
                    <CountPill>
                      {page.total_entries}{" "}
                      {page.total_entries === 1 ? "entry" : "entries"}
                    </CountPill>
                    <ChevronRight className="h-3.5 w-3.5 text-black" />
                  </div>
                </Row>
              ))
            )}
          </div>
          <HintText>
            Click a page to see its forms, or edit the page name.
          </HintText>
        </div>
      );
    }

    const pageForms =
      overviews[step.form.id]?.pages.find(
        (page) => page.page_path === step.pagePath,
      )?.forms ?? [];
    return (
      <div className="flex flex-col gap-4 p-6">
        <SectionIntro
          title="Forms on this page"
          sub="Select a form to edit its name"
        />
        <div className="flex flex-col gap-3">
          {pageForms.map((group) => (
            <div
              key={group.form_identifier}
              className="flex items-center justify-between gap-3 border border-[#EDEDED] p-4"
            >
              <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
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
              </div>
              <SolidActionButton
                label="Edit form name"
                colorClass="bg-[#03A84E]"
                onClick={() =>
                  openRename({
                    kind: "form",
                    current: group.form_name,
                    formId: step.form.id,
                    pagePath: step.pagePath,
                    formIdentifier: group.form_identifier,
                    meta: `${group.entries_count} ${group.entries_count === 1 ? "submission" : "submissions"} · Last: ${formatDate(group.last_submission)}`,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  })();

  if (saved) {
    return (
      <ManagerShell
        title="Edit name?"
        level={LEVEL[step.name]}
        path={renamePath}
        isBusy
        onClose={onClose}
        onCrumb={() => undefined}
        footer={<SaveButton label="Saved!" />}
      >
        <div className="flex flex-col gap-2.5 p-6">
          <FieldLabel>New name</FieldLabel>
          <PreviewCard
            icon={targetIcon(saved.kind)}
            name={saved.name}
            meta={saved.meta}
          />
        </div>
      </ManagerShell>
    );
  }

  if (rename) {
    return (
      <ManagerShell
        title="Edit name?"
        level={LEVEL[step.name]}
        path={renamePath}
        isBusy={isRenaming}
        onClose={onClose}
        onCrumb={handleCrumb}
        footer={
          <div className="flex w-full items-center justify-end gap-4">
            <CancelButton
              onClick={() => setRename(null)}
              disabled={isRenaming}
            />
            <SaveButton
              label={isRenaming ? "Saving..." : "Save name"}
              onClick={saveRename}
              disabled={!canSave}
            />
          </div>
        }
      >
        <RenameBody
          target={rename}
          value={renameValue}
          onChange={setRenameValue}
          canSave={canSave}
          onSubmit={saveRename}
        />
      </ManagerShell>
    );
  }

  return (
    <ManagerShell
      title="Edit name?"
      level={LEVEL[step.name]}
      path={stepPath}
      isBusy={isRenaming}
      onClose={onClose}
      onCrumb={handleCrumb}
    >
      {listBody}
    </ManagerShell>
  );
}
