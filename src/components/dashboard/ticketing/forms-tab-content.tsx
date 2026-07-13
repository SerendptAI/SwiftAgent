"use client";

import {
  ChevronDown,
  Info,
  Pencil,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { FormCreationSuccessModal } from "@/components/dashboard/ticketing/form-creation-success-modal";
import { FormsDeleteManager } from "@/components/dashboard/ticketing/forms-delete-manager";
import { FormsEditManager } from "@/components/dashboard/ticketing/forms-edit-manager";
import { MessagesEmptyState } from "@/components/dashboard/ticketing/messages-empty-state";
import { OnlineFormDrawer } from "@/components/dashboard/ticketing/online-form-drawer";
import { WebsiteFormDrawer } from "@/components/dashboard/ticketing/website-form-drawer";
import {
  useBulkDeleteSubmissions,
  useDeletePage,
  useDeletePageForm,
  useDeleteWebsite,
  useFormOverviews,
  useForms,
  useFormSubmissions,
  useMarkSubmissionRead,
  usePageFormSubmissions,
  useRenamePage,
  useRenamePageForm,
  useRenameWebsite,
} from "@/hooks/use-forms";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Form, OverviewPage, Submission } from "@/services/forms";
import { getFormDisplayName, getSubmissionDisplayName } from "@/services/forms";

type FormSubmissionStatus = "unread" | "read";
type FormType = "website" | "online";

const FORM_TYPE_META: Record<
  FormType,
  { icon: string; label: string; textColor: string }
> = {
  website: {
    icon: "/images/icons/internet-www.svg",
    label: "Create Website Form",
    textColor: "text-[#6433CC]",
  },
  online: {
    icon: "/images/icons/sticky-notepad.svg",
    label: "Create Online Form",
    textColor: "text-[#F25430]",
  },
};

function getSubmissionPreview(submission: Submission): string {
  if (submission.submitter_preview?.trim()) {
    return submission.submitter_preview.trim();
  }
  for (const val of Object.values(submission.data)) {
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return "—";
}

function formatSubmissionTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatSubmissionReceivedAt(isoString: string): string {
  try {
    const d = new Date(isoString);
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = d.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${time} ${date}`;
  } catch {
    return isoString;
  }
}

function SubmissionAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDEDED] lg:h-[52px] lg:w-[52px]">
      <span className="font-dm-mono text-base font-bold text-black/60 uppercase lg:text-lg">
        {initial}
      </span>
    </div>
  );
}

function PendingIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.2013 2H6.79864C5.34088 2 4.0619 2.9847 4.00348 4.40355C3.92997 6.18879 5.18552 7.37422 6.50423 8.4871C8.32849 10.0266 9.24063 10.7964 9.3363 11.7708C9.35127 11.9233 9.35127 12.0767 9.3363 12.2292C9.24063 13.2036 8.3285 13.9734 6.50423 15.5129C5.1492 16.6564 3.92618 17.7195 4.00348 19.5964C4.0619 21.0153 5.34088 22 6.79864 22H17.2013C18.659 22 19.938 21.0153 19.9964 19.5964C20.0429 18.4668 19.6243 17.342 18.7351 16.56C18.3297 16.2034 17.9088 15.8615 17.4957 15.5129C15.6714 13.9734 14.7593 13.2036 14.6636 12.2292C14.6486 12.0767 14.6486 11.9233 14.6636 11.7708C14.7593 10.7964 15.6714 10.0266 17.4957 8.4871C18.8365 7.35558 20.0728 6.25809 19.9964 4.40355C19.938 2.9847 18.659 2 17.2013 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 21.6381C9 21.1962 9 20.9752 9.0876 20.7821C9.10151 20.7514 9.11699 20.7214 9.13399 20.6923C9.24101 20.509 9.42211 20.3796 9.78432 20.1208C10.7905 19.4021 11.2935 19.0427 11.8652 19.0045C11.955 18.9985 12.045 18.9985 12.1348 19.0045C12.7065 19.0427 13.2095 19.4021 14.2157 20.1208C14.5779 20.3796 14.759 20.509 14.866 20.6923C14.883 20.7214 14.8985 20.7514 14.9124 20.7821C15 20.9752 15 21.1962 15 21.6381V22H9V21.6381Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ResolvedIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.5 8L7 10.5L11.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyStateCenter({ lines }: { lines: string[] }) {
  return (
    <MessagesEmptyState className="absolute inset-0 flex items-center justify-center">
      {lines.map((line, index) => (
        <span key={line}>
          {index > 0 && <br />}
          {line}
        </span>
      ))}
    </MessagesEmptyState>
  );
}

function InboxHeader() {
  return (
    <div className="absolute top-5 left-5 z-10 sm:top-9 sm:left-10">
      <h2 className="font-dm-mono text-xl font-bold tracking-[-0.02em] text-black uppercase sm:text-2xl">
        Inbox
      </h2>
    </div>
  );
}

function StatusControls({
  activeStatus,
  onStatusChange,
}: {
  activeStatus: FormSubmissionStatus;
  onStatusChange: (status: FormSubmissionStatus) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 sm:gap-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-8">
        <button
          type="button"
          onClick={() => onStatusChange("unread")}
          className={`font-stolzl flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-xs font-normal sm:h-12 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-base ${
            activeStatus === "unread"
              ? "bg-[#808080] text-white"
              : "bg-[#F6F6F6] text-black"
          }`}
          aria-pressed={activeStatus === "unread"}
        >
          <PendingIcon className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
          <span>Unread</span>
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("read")}
          className={`font-stolzl flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-xs font-normal sm:h-12 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-base ${
            activeStatus === "read"
              ? "bg-[#808080] text-white"
              : "bg-[#F6F6F6] text-black"
          }`}
          aria-pressed={activeStatus === "read"}
        >
          <ResolvedIcon className="size-4 shrink-0 stroke-1 sm:size-5" />
          <span>Read</span>
        </button>
      </div>
      <button
        type="button"
        aria-label="Form settings"
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#808080] transition-colors hover:bg-[#F6F6F6] sm:h-12 sm:w-12 sm:rounded-xl"
      >
        <Settings className="h-5 w-5 sm:h-7 sm:w-7" />
      </button>
    </div>
  );
}

function FormsEmptyState({
  lines,
  variant,
}: {
  lines: string[];
  variant: "list" | "detail";
}) {
  return (
    <div className="relative w-full overflow-hidden lg:h-full lg:rounded-3xl lg:bg-white lg:shadow-sm">
      {variant === "list" ? (
        <InboxHeader />
      ) : (
        <div className="absolute top-4 right-4 left-4 z-10 sm:top-7 sm:right-8 sm:left-8">
          <StatusControls
            activeStatus="unread"
            onStatusChange={() => undefined}
          />
        </div>
      )}
      <EmptyStateCenter lines={lines} />
    </div>
  );
}

function CreateFormMenu({
  onSelect,
  widthClass = "w-[430px]",
}: {
  onSelect: (type: FormType) => void;
  widthClass?: string;
}) {
  return (
    <div
      className={`font-dm-mono ${widthClass} max-w-[calc(100vw-2rem)] rounded-xl bg-white px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] lg:max-w-[calc(100vw-3rem)] lg:px-3 lg:py-2`}
    >
      {(["website", "online"] as FormType[]).map((type, index) => {
        const meta = FORM_TYPE_META[type];
        return (
          <button
            key={type}
            type="button"
            className={`flex h-10 w-full cursor-pointer items-center gap-2 px-2 text-left transition-colors hover:bg-gray-50 lg:h-12 lg:gap-3 lg:px-3 ${
              index === 0 ? "border-b border-[#808080]" : ""
            }`}
            onClick={() => onSelect(type)}
          >
            <Image
              src={meta.icon}
              alt=""
              width={type === "website" ? 23 : 22}
              height={type === "website" ? 23 : 22}
              className="h-[18px] w-[18px] shrink-0 lg:h-[23px] lg:w-[23px]"
            />
            <span
              className={`min-w-0 flex-1 truncate text-xs font-normal tracking-[0.1em] uppercase lg:text-base lg:tracking-[0.18em] ${meta.textColor}`}
            >
              {meta.label}
            </span>
            <Info className="h-3.5 w-3.5 shrink-0 text-black lg:h-4 lg:w-4" />
          </button>
        );
      })}
    </div>
  );
}

function FormsToolbar({
  forms,
  selectedFormId,
  onSelectForm,
  onDelete,
  onEdit,
  onCreateWebsiteForm,
  onCreateOnlineForm,
}: {
  forms: Form[];
  selectedFormId: string | null;
  onSelectForm: (id: string) => void;
  onDelete: () => void;
  onEdit: () => void;
  onCreateWebsiteForm: () => void;
  onCreateOnlineForm: () => void;
}) {
  const [isFormMenuOpen, setIsFormMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const formDropdownRef = useRef<HTMLDivElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);
  const selectedForm = forms.find((f) => f.id === selectedFormId) ?? null;
  useScrollLock(isFormMenuOpen || isCreateMenuOpen);

  const handleCreateForm = (type: FormType) => {
    setIsCreateMenuOpen(false);
    setIsFormMenuOpen(false);
    if (type === "website") {
      onCreateWebsiteForm();
    } else {
      onCreateOnlineForm();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        formDropdownRef.current &&
        !formDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFormMenuOpen(false);
      }
      if (
        createDropdownRef.current &&
        !createDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCreateMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="grid shrink-0 grid-cols-1 gap-3 lg:h-15 lg:grid-cols-12 lg:gap-8">
      <div
        className={`grid min-w-0 grid-cols-3 gap-2 lg:col-span-7 lg:flex lg:items-center lg:gap-8 ${
          isCreateMenuOpen ? "relative z-[90]" : ""
        }`}
      >
        <button
          type="button"
          onClick={onDelete}
          disabled={forms.length === 0}
          className="font-dm-mono flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#6433CC] px-3 text-xs font-normal tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#572bb5] disabled:cursor-not-allowed disabled:opacity-50 lg:h-15 lg:gap-2 lg:px-5 lg:text-base lg:tracking-[0.18em]"
        >
          <Trash2 className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
          <span className="truncate">Delete</span>
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={forms.length === 0}
          className="font-dm-mono flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#F25430] px-3 text-xs font-normal tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#d94526] disabled:cursor-not-allowed disabled:opacity-50 lg:h-15 lg:gap-2 lg:px-5 lg:text-base lg:tracking-[0.18em]"
        >
          <Pencil className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
          <span className="truncate">Edit</span>
        </button>
        <div ref={createDropdownRef} className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsCreateMenuOpen((open) => !open)}
            className="font-dm-mono flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#006BE5] px-3 text-xs font-normal tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#005fca] lg:h-15 lg:gap-2 lg:px-5 lg:text-base lg:tracking-[0.18em]"
            aria-expanded={isCreateMenuOpen}
          >
            {isCreateMenuOpen ? (
              <X className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
            ) : (
              <Plus className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
            )}
            <span className="truncate">Create</span>
          </button>
          {isCreateMenuOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 absolute top-[calc(100%+0.75rem)] right-0 z-[70] duration-200 lg:top-[calc(100%+1rem)] lg:right-[-1.25rem]">
              <CreateFormMenu onSelect={handleCreateForm} />
            </div>
          )}
        </div>
      </div>

      <div
        ref={formDropdownRef}
        className={`relative min-w-0 lg:col-span-5 ${isFormMenuOpen ? "z-[70]" : ""}`}
      >
        {isFormMenuOpen && (
          <button
            type="button"
            aria-label="Close form menu"
            className="fixed inset-0 z-[60] cursor-pointer bg-black/30 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={() => setIsFormMenuOpen(false)}
          />
        )}

        <div className="relative z-[70] flex h-12 min-w-0 items-center rounded-[18px] border border-[#EDEDED] bg-white px-2 shadow-sm lg:h-15 lg:rounded-[22px] lg:px-4">
          <div className="font-dm-mono shrink-0 pr-2 pl-1 text-xs font-normal tracking-[0.1em] text-black uppercase lg:pr-5 lg:pl-3 lg:text-base lg:tracking-[0.16em]">
            Forms
          </div>
          <button
            type="button"
            onClick={() => setIsFormMenuOpen((open) => !open)}
            className="flex h-9 min-w-0 flex-1 cursor-pointer items-center justify-between gap-1.5 rounded-[13px] border border-[#EDEDED] bg-white px-2 text-left transition-colors hover:bg-gray-50 lg:gap-3 lg:px-5"
            aria-expanded={isFormMenuOpen}
          >
            {selectedForm && (
              <Image
                src={FORM_TYPE_META[selectedForm.type].icon}
                alt=""
                width={23}
                height={23}
                className="ml-0.5 h-[18px] w-[18px] shrink-0 lg:ml-1 lg:h-[23px] lg:w-[23px]"
              />
            )}
            <span className="font-dm-mono min-w-0 flex-1 truncate text-xs font-normal tracking-[0.1em] text-black uppercase lg:text-base lg:tracking-[0.18em]">
              {selectedForm
                ? getFormDisplayName(selectedForm)
                : "Create a new form"}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-black transition-transform duration-200 lg:h-4 lg:w-4 ${isFormMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {isFormMenuOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 left-0 z-[70] mt-3 duration-200 sm:right-4 sm:left-auto sm:w-[calc(100%-7.5rem)] sm:min-w-90">
            {forms.length === 0 ? (
              <CreateFormMenu onSelect={handleCreateForm} widthClass="w-full" />
            ) : (
              <div className="font-dm-mono rounded-xl bg-white px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] lg:px-3 lg:py-2">
                {forms.map((form) => (
                  <button
                    key={form.id}
                    type="button"
                    className="flex h-10 w-full cursor-pointer items-center gap-2 px-2 text-left transition-colors hover:bg-gray-50 lg:h-12 lg:gap-3 lg:px-3"
                    onClick={() => {
                      onSelectForm(form.id);
                      setIsFormMenuOpen(false);
                    }}
                  >
                    <Image
                      src={FORM_TYPE_META[form.type].icon}
                      alt=""
                      width={23}
                      height={23}
                      className="h-[18px] w-[18px] shrink-0 lg:h-[23px] lg:w-[23px]"
                    />
                    <span className="min-w-0 flex-1 truncate text-xs font-normal tracking-[0.1em] text-black uppercase lg:text-base lg:tracking-[0.18em]">
                      {getFormDisplayName(form)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SubmissionNameDropdown({
  allSubmissions,
  selectedId,
  onSelect,
  formType,
}: {
  allSubmissions: Submission[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  formType: FormType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useScrollLock(isOpen);
  const selected =
    selectedId === null
      ? null
      : (allSubmissions.find((s) => s.id === selectedId) ?? null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selected) return null;

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-fit">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-9 w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-[#EDEDED] bg-white px-3 text-left transition-colors hover:bg-gray-50 sm:min-w-[184px]"
        aria-expanded={isOpen}
      >
        <Image
          src={FORM_TYPE_META[formType].icon}
          alt=""
          width={23}
          height={23}
          className="h-[23px] w-[23px] shrink-0"
        />
        <span className="font-dm-mono min-w-0 flex-1 truncate text-base font-normal tracking-[0.12em] text-black uppercase">
          {getSubmissionDisplayName(selected)}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-black transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute left-0 z-30 mt-2 w-full rounded-xl border border-[#EDEDED] bg-white p-2 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] duration-200 sm:w-56">
          {allSubmissions.map((submission) => (
            <button
              key={submission.id}
              type="button"
              className="font-dm-mono flex h-10 w-full cursor-pointer items-center rounded-lg px-3 text-left text-sm font-normal tracking-[0.12em] text-black uppercase transition-colors hover:bg-gray-50"
              onClick={() => {
                onSelect(submission.id);
                setIsOpen(false);
              }}
            >
              <span className="truncate">
                {getSubmissionDisplayName(submission)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormSubmissionDetail({
  allSubmissions,
  selectedId,
  onSelect,
  formType,
  hideTitle = false,
}: {
  allSubmissions: Submission[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  formType: FormType;
  hideTitle?: boolean;
}) {
  const selected =
    selectedId === null
      ? null
      : (allSubmissions.find((s) => s.id === selectedId) ?? null);

  if (!selected) {
    return (
      <FormsEmptyState
        variant="list"
        lines={["SELECT A MESSAGE", "TO VIEW IT"]}
      />
    );
  }

  return (
    <div className="relative min-h-[420px] w-full overflow-hidden lg:h-full lg:rounded-3xl lg:bg-white lg:px-10 lg:py-9 lg:shadow-sm">
      {!hideTitle && (
        <h2 className="font-dm-mono text-xl font-bold tracking-[-0.02em] text-black uppercase sm:text-2xl">
          Inbox
        </h2>
      )}

      <div className={hideTitle ? "" : "mt-5 sm:mt-6"}>
        <SubmissionNameDropdown
          allSubmissions={allSubmissions}
          selectedId={selectedId}
          onSelect={onSelect}
          formType={formType}
        />
      </div>

      <p className="font-dm-mono mt-6 text-xs font-normal tracking-[0.14em] text-black/60 uppercase sm:mt-8 sm:text-sm sm:tracking-[0.18em]">
        Received at {formatSubmissionReceivedAt(selected.submitted_at)}
      </p>

      <div className="font-dm-mono mt-7 space-y-4 text-base leading-[1.45] font-normal tracking-[-0.02em] text-black uppercase sm:mt-10 sm:space-y-7 sm:text-2xl sm:leading-[1.32]">
        {Object.entries(selected.data).map(([key, value]) => (
          <p key={key}>
            <span className="font-bold">
              {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
            </span>{" "}
            {typeof value === "string"
              ? value
              : typeof value === "number" || typeof value === "boolean"
                ? String(value)
                : JSON.stringify(value)}
          </p>
        ))}
        {Object.keys(selected.data).length === 0 && (
          <p className="text-black/40">No submission data</p>
        )}
      </div>
    </div>
  );
}

function FormSubmissionList({
  submissions,
  selectedId,
  onSelect,
  activeStatus,
  onStatusChange,
}: {
  submissions: Submission[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeStatus: FormSubmissionStatus;
  onStatusChange: (status: FormSubmissionStatus) => void;
}) {
  const visibleSubmissions = submissions.filter(
    (s) => s.is_read === (activeStatus === "read"),
  );

  return (
    <div className="relative w-full overflow-hidden lg:h-full lg:rounded-3xl lg:bg-white lg:shadow-sm">
      <div className="mb-4 lg:absolute lg:top-7 lg:right-8 lg:left-8 lg:z-10 lg:mb-0">
        <StatusControls
          activeStatus={activeStatus}
          onStatusChange={onStatusChange}
        />
      </div>

      <div className="scrollbar-none overflow-y-auto pt-2 lg:h-full lg:px-9 lg:pt-28">
        <div className="space-y-4">
          {visibleSubmissions.map((submission) => {
            const isSelected = submission.id === selectedId;
            const displayName = getSubmissionDisplayName(submission);
            const preview = getSubmissionPreview(submission);
            const time = formatSubmissionTime(submission.submitted_at);

            return (
              <button
                key={submission.id}
                type="button"
                onClick={() => onSelect(submission.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-[19px] p-0 text-left transition-colors lg:h-[82px] lg:gap-4 lg:px-5 ${
                  isSelected
                    ? "text-[#006BE5] lg:bg-[#006BE5] lg:text-white"
                    : "text-black lg:bg-[#FBFBFB] lg:hover:bg-[#F6F6F6]"
                }`}
              >
                <SubmissionAvatar name={displayName} />
                <div className="min-w-0 flex-1">
                  <div className="font-dm-mono truncate text-base font-normal tracking-[0.08em] uppercase">
                    {displayName}
                  </div>
                  <div
                    className={`font-stolzl mt-1 truncate text-sm ${
                      isSelected ? "text-white/80" : "text-[#9B9B9B]"
                    }`}
                  >
                    {preview}
                  </div>
                </div>
                <span
                  className={`font-stolzl shrink-0 text-sm ${
                    isSelected ? "text-white" : "text-[#6433CC]"
                  }`}
                >
                  {time}
                </span>
              </button>
            );
          })}
          {visibleSubmissions.length === 0 && (
            <p className="font-dm-mono py-8 text-center text-sm tracking-widest text-black/40 uppercase">
              No {activeStatus} submissions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function PageFormTabs({
  pages,
  selectedPagePath,
  selectedFormIdentifier,
  onSelectPage,
  onSelectFormIdentifier,
}: {
  pages: OverviewPage[];
  selectedPagePath: string | null;
  selectedFormIdentifier: string | null;
  onSelectPage: (pagePath: string) => void;
  onSelectFormIdentifier: (formIdentifier: string) => void;
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-start gap-3">
      {pages.map((page) => {
        const isActive = page.page_path === selectedPagePath;
        if (!isActive || page.forms.length === 0) {
          return (
            <button
              key={page.page_path}
              type="button"
              onClick={() => onSelectPage(page.page_path)}
              className={`font-dm-mono flex h-[42px] max-w-[170px] cursor-pointer items-center justify-center rounded-[9px] border border-black/5 px-2.5 text-base tracking-[0.1em] uppercase transition-colors ${
                isActive
                  ? "bg-[#006BE5] font-medium text-white"
                  : "bg-white font-normal text-black hover:bg-gray-50"
              }`}
              aria-pressed={isActive}
            >
              <span className="truncate">{page.page_path}</span>
            </button>
          );
        }
        return (
          <div
            key={page.page_path}
            className="flex flex-col rounded-[9px] border border-black/5 bg-[#006BE5] p-[9px] pt-0"
          >
            <div className="font-dm-mono flex h-[42px] items-center justify-center px-0.5 text-base font-medium tracking-[0.1em] text-white uppercase">
              <span className="max-w-[152px] truncate">{page.page_path}</span>
            </div>
            <div className="flex flex-col gap-2">
              {page.forms.map((group) => {
                const isActiveForm =
                  group.form_identifier === selectedFormIdentifier;
                return (
                  <button
                    key={group.form_identifier}
                    type="button"
                    onClick={() =>
                      onSelectFormIdentifier(group.form_identifier)
                    }
                    className={`font-dm-mono flex h-[37px] w-[152px] cursor-pointer items-center justify-center rounded-[9px] border border-black/5 px-2.5 text-xs tracking-[0.1em] uppercase transition-colors ${
                      isActiveForm
                        ? "bg-[#F25430] font-medium text-white"
                        : "bg-white font-normal text-black hover:bg-gray-50"
                    }`}
                    aria-pressed={isActiveForm}
                  >
                    <span className="truncate">{group.form_name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FormsTabContent() {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [isMobileDetail, setIsMobileDetail] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedPagePath, setSelectedPagePath] = useState<string | null>(null);
  const [selectedFormIdentifier, setSelectedFormIdentifier] = useState<
    string | null
  >(null);
  const [activeStatus, setActiveStatus] =
    useState<FormSubmissionStatus>("unread");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditManagerOpen, setIsEditManagerOpen] = useState(false);
  const [isWebsiteFormDrawerOpen, setIsWebsiteFormDrawerOpen] = useState(false);
  const [isOnlineFormDrawerOpen, setIsOnlineFormDrawerOpen] = useState(false);
  const [successForm, setSuccessForm] = useState<{
    type: FormType;
    name: string;
  } | null>(null);

  const { data: forms = [] } = useForms();
  const overviews = useFormOverviews(forms.map((f) => f.id));
  const deleteWebsite = useDeleteWebsite();
  const deletePage = useDeletePage();
  const deletePageForm = useDeletePageForm();
  const bulkDeleteSubmissions = useBulkDeleteSubmissions();
  const renameWebsite = useRenameWebsite();
  const renamePage = useRenamePage();
  const renamePageForm = useRenamePageForm();
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const { mutate: markSubmissionRead } = useMarkSubmissionRead();

  useEffect(() => {
    if (forms.length > 0 && !selectedFormId) {
      setSelectedFormId(forms[0].id);
    }
  }, [forms, selectedFormId]);

  const selectedForm = forms.find((f) => f.id === selectedFormId) ?? null;
  const selectedFormType: FormType = selectedForm?.type ?? "website";
  const overview = selectedFormId ? overviews.byId[selectedFormId] : undefined;
  const pages = overview?.pages ?? [];
  const hasHierarchy = pages.length > 0;

  useEffect(() => {
    if (!overview) return;
    const page =
      overview.pages.find((p) => p.page_path === selectedPagePath) ??
      overview.pages[0] ??
      null;
    const nextPagePath = page?.page_path ?? null;
    const group =
      page?.forms.find((g) => g.form_identifier === selectedFormIdentifier) ??
      page?.forms[0] ??
      null;
    const nextIdentifier = group?.form_identifier ?? null;
    if (nextPagePath !== selectedPagePath) setSelectedPagePath(nextPagePath);
    if (nextIdentifier !== selectedFormIdentifier)
      setSelectedFormIdentifier(nextIdentifier);
  }, [overview, selectedPagePath, selectedFormIdentifier]);

  const { data: scopedSubmissions = [] } = usePageFormSubmissions(
    hasHierarchy ? (selectedFormId ?? null) : null,
    selectedPagePath,
    selectedFormIdentifier,
  );
  const { data: flatSubmissions = [] } = useFormSubmissions(
    hasHierarchy ? null : (selectedForm?.id ?? null),
  );
  const submissions = hasHierarchy ? scopedSubmissions : flatSubmissions;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateMatch = () => setIsMobileDetail(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useScrollLock(selectedSubmissionId !== null && isMobileDetail);

  useEffect(() => {
    if (!selectedSubmissionId) return;
    const submission = submissions.find((s) => s.id === selectedSubmissionId);
    if (submission && !submission.is_read) {
      markSubmissionRead(selectedSubmissionId);
    }
  }, [selectedSubmissionId, submissions, markSubmissionRead]);

  const handleSelectForm = (id: string) => {
    setSelectedFormId(id);
    setSelectedPagePath(null);
    setSelectedFormIdentifier(null);
    setSelectedSubmissionId(null);
  };

  const handleSelectPage = (pagePath: string) => {
    setSelectedPagePath(pagePath);
    setSelectedFormIdentifier(null);
    setSelectedSubmissionId(null);
  };

  const handleSelectFormIdentifier = (formIdentifier: string) => {
    setSelectedFormIdentifier(formIdentifier);
    setSelectedSubmissionId(null);
  };

  const handleStatusChange = (status: FormSubmissionStatus) => {
    setActiveStatus(status);
    setSelectedSubmissionId(null);
  };

  const handleEdit = () => {
    setIsEditManagerOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmissions = async (submissionIds: string[]) => {
    setIsBulkDeleting(true);
    try {
      await bulkDeleteSubmissions.mutateAsync(submissionIds);
      if (
        selectedSubmissionId &&
        submissionIds.includes(selectedSubmissionId)
      ) {
        setSelectedSubmissionId(null);
      }
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteWebsite = async (form: Form) => {
    setIsBulkDeleting(true);
    try {
      await deleteWebsite.mutateAsync(form.website_link!);
      const affected = forms.filter(
        (f) => f.website_link === form.website_link,
      );
      if (selectedFormId && affected.some((f) => f.id === selectedFormId)) {
        setSelectedFormId(null);
        setSelectedPagePath(null);
        setSelectedFormIdentifier(null);
        setSelectedSubmissionId(null);
      }
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeletePage = async (formId: string, pagePath: string) => {
    setIsBulkDeleting(true);
    try {
      await deletePage.mutateAsync({ formId, pagePath });
      if (selectedFormId === formId && selectedPagePath === pagePath) {
        setSelectedPagePath(null);
        setSelectedFormIdentifier(null);
        setSelectedSubmissionId(null);
      }
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteFormGroup = async (
    formId: string,
    pagePath: string,
    formIdentifier: string,
  ) => {
    setIsBulkDeleting(true);
    try {
      await deletePageForm.mutateAsync({ formId, pagePath, formIdentifier });
      if (
        selectedFormId === formId &&
        selectedPagePath === pagePath &&
        selectedFormIdentifier === formIdentifier
      ) {
        setSelectedFormIdentifier(null);
        setSelectedSubmissionId(null);
      }
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleRenameForm = async (
    formId: string,
    pagePath: string,
    formIdentifier: string,
    nextName: string,
  ) => {
    await renamePageForm.mutateAsync({
      formId,
      pagePath,
      formIdentifier,
      newName: nextName,
    });
  };

  const handleRenameWebsite = async (form: Form, nextName: string) => {
    const trimmed = nextName.trim();
    const newWebsite = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    await renameWebsite.mutateAsync({
      oldWebsite: form.website_link!,
      newWebsite,
    });
  };

  const handleRenamePage = async (
    form: Form,
    oldPath: string,
    nextName: string,
  ) => {
    const trimmed = nextName.trim();
    const newPage = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    await renamePage.mutateAsync({
      website: form.website_link!,
      oldPage: oldPath,
      newPage,
    });
    if (selectedFormId === form.id && selectedPagePath === oldPath) {
      setSelectedPagePath(newPage);
    }
  };

  const handleWebsiteFormSuccess = (form: Form) => {
    setSelectedFormId(form.id);
    setSuccessForm({ type: form.type, name: form.website_link ?? form.id });
  };

  const handleOnlineFormSuccess = (form: Form) => {
    setSelectedFormId(form.id);
    setSuccessForm({ type: form.type, name: form.form_title ?? form.id });
  };

  const inboxDetail = (
    <FormSubmissionDetail
      allSubmissions={submissions}
      selectedId={selectedSubmissionId}
      onSelect={setSelectedSubmissionId}
      formType={selectedFormType}
    />
  );

  const mobileInboxDetail = (
    <FormSubmissionDetail
      allSubmissions={submissions}
      selectedId={selectedSubmissionId}
      onSelect={setSelectedSubmissionId}
      formType={selectedFormType}
      hideTitle
    />
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-8">
      <FormsToolbar
        forms={forms}
        selectedFormId={selectedFormId}
        onSelectForm={handleSelectForm}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onCreateWebsiteForm={() => setIsWebsiteFormDrawerOpen(true)}
        onCreateOnlineForm={() => setIsOnlineFormDrawerOpen(true)}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:h-[600px] lg:flex-none lg:grid-cols-12 lg:gap-8">
        <div className="hidden min-w-0 lg:col-span-7 lg:block">
          {inboxDetail}
        </div>
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-5 lg:gap-7">
          {hasHierarchy && (
            <PageFormTabs
              pages={pages}
              selectedPagePath={selectedPagePath}
              selectedFormIdentifier={selectedFormIdentifier}
              onSelectPage={handleSelectPage}
              onSelectFormIdentifier={handleSelectFormIdentifier}
            />
          )}
          <div className="min-h-0 flex-1">
            <FormSubmissionList
              submissions={submissions}
              selectedId={selectedSubmissionId}
              onSelect={setSelectedSubmissionId}
              activeStatus={activeStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>

      {selectedSubmissionId !== null && isMobileDetail && (
        <div className="fixed inset-0 z-10000 bg-black/45 lg:hidden">
          <section className="animate-in slide-in-from-right ml-auto flex h-full w-full max-w-[520px] flex-col bg-white shadow-[-20px_0_70px_rgba(0,0,0,0.18)] duration-300">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
              <h2 className="font-dm-mono text-xl font-bold tracking-[-0.02em] text-black uppercase">
                Inbox
              </h2>
              <button
                type="button"
                aria-label="Close inbox"
                onClick={() => setSelectedSubmissionId(null)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#F6F6F6] text-gray-700 transition-colors hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {mobileInboxDetail}
            </div>
          </section>
        </div>
      )}

      <WebsiteFormDrawer
        open={isWebsiteFormDrawerOpen}
        onClose={() => setIsWebsiteFormDrawerOpen(false)}
        onSuccess={handleWebsiteFormSuccess}
        mode="create"
      />
      <OnlineFormDrawer
        open={isOnlineFormDrawerOpen}
        onClose={() => setIsOnlineFormDrawerOpen(false)}
        onSuccess={handleOnlineFormSuccess}
        mode="create"
      />
      <FormCreationSuccessModal
        open={successForm !== null}
        formIcon={FORM_TYPE_META[successForm?.type ?? "website"].icon}
        formName={successForm?.name ?? ""}
        onClose={() => setSuccessForm(null)}
      />
      <FormsDeleteManager
        open={isDeleteModalOpen}
        forms={forms}
        overviews={overviews.byId}
        isDeleting={isBulkDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteWebsite={handleDeleteWebsite}
        onDeletePage={handleDeletePage}
        onDeleteFormGroup={handleDeleteFormGroup}
        onDeleteSubmissions={handleDeleteSubmissions}
      />
      <FormsEditManager
        open={isEditManagerOpen}
        forms={forms}
        overviews={overviews.byId}
        isRenaming={
          renameWebsite.isPending ||
          renamePage.isPending ||
          renamePageForm.isPending
        }
        onRenameForm={handleRenameForm}
        onRenameWebsite={handleRenameWebsite}
        onRenamePage={handleRenamePage}
        onClose={() => setIsEditManagerOpen(false)}
      />
    </div>
  );
}
