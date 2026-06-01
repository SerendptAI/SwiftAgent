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
import { OnlineFormDrawer } from "@/components/dashboard/ticketing/online-form-drawer";
import { WebsiteFormDrawer } from "@/components/dashboard/ticketing/website-form-drawer";
import { useScrollLock } from "@/hooks/use-scroll-lock";

interface FormsEmptyStateProps {
  lines: string[];
  variant: "list" | "detail";
}

type FormSubmissionStatus = "unread" | "read";
type FormType = "website" | "online";

interface FormSubmission {
  name: string;
  preview: string;
  time: string;
  avatar: string;
  email: string;
  interest: string;
  message: string;
  receivedAt: string;
  status: FormSubmissionStatus;
}

interface MockForm {
  name: string;
  type: FormType;
  pages?: {
    path: string;
    submissions: FormSubmission[];
  }[];
  submissions: FormSubmission[];
}

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

const MOCK_FORMS: MockForm[] = [
  {
    name: "NG Ballerz Form",
    type: "online",
    submissions: [
      {
        name: "John Doe",
        preview: "Good day, i lost my...",
        time: "4:13pm",
        avatar: "/images/chats/newimg1.svg",
        email: "johndoe@zvask.com",
        interest: "Partnership",
        message: "I would love a partnership with y'all, thanks a lot",
        receivedAt: "2:33pm 02/04/2026",
        status: "unread",
      },
      {
        name: "Jane Austin",
        preview: "Good day, i lost my...",
        time: "4:13pm",
        avatar: "/images/chats/newimg4.svg",
        email: "janeaustin@zvask.com",
        interest: "Support",
        message: "I need help with a form submission from the contact page",
        receivedAt: "2:41pm 02/04/2026",
        status: "unread",
      },
      {
        name: "Jane Jackson",
        preview: "Good day, i lost my...",
        time: "4:13pm",
        avatar: "/images/chats/newimg.svg",
        email: "janejackson@zvask.com",
        interest: "Volunteer",
        message: "I would like to volunteer for upcoming community programs",
        receivedAt: "3:02pm 02/04/2026",
        status: "read",
      },
    ],
  },
  {
    name: "https://serendptai.com",
    type: "website",
    submissions: [],
    pages: [
      {
        path: "/contact-us",
        submissions: [
          {
            name: "Ayo Martins",
            preview: "Hello, I want pricing...",
            time: "3:25pm",
            avatar: "/images/chats/newimg2.svg",
            email: "ayo@serendptai.com",
            interest: "Pricing",
            message: "Hello, I want pricing details for a website form setup",
            receivedAt: "3:25pm 02/05/2026",
            status: "unread",
          },
          {
            name: "Kemi Rhodes",
            preview: "I need help with setup...",
            time: "2:55pm",
            avatar: "/images/chats/newimg.svg",
            email: "kemi@serendptai.com",
            interest: "Setup",
            message: "I need help with setup for our contact workflow",
            receivedAt: "2:55pm 02/05/2026",
            status: "read",
          },
        ],
      },
      {
        path: "/submission",
        submissions: [
          {
            name: "Mina Cole",
            preview: "Can I book a demo...",
            time: "3:12pm",
            avatar: "/images/chats/newimg3.svg",
            email: "mina@serendptai.com",
            interest: "Demo",
            message: "Can I book a demo for the web assistant this week?",
            receivedAt: "3:12pm 02/05/2026",
            status: "unread",
          },
          {
            name: "Tobi Green",
            preview: "The submitted form...",
            time: "1:48pm",
            avatar: "/images/chats/newimg3.svg",
            email: "tobi@serendptai.com",
            interest: "Submission",
            message: "The submitted form needs a confirmation email",
            receivedAt: "1:48pm 02/05/2026",
            status: "read",
          },
        ],
      },
      {
        path: "/volunteer",
        submissions: [
          {
            name: "Lara Stone",
            preview: "I would like to help...",
            time: "12:10pm",
            avatar: "/images/chats/newimg4.svg",
            email: "lara@serendptai.com",
            interest: "Volunteer",
            message: "I would like to help with volunteer coordination",
            receivedAt: "12:10pm 02/05/2026",
            status: "unread",
          },
        ],
      },
    ],
  },
];

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
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/email-mailbox-open.svg"
          alt=""
          width={66}
          height={66}
          className="aspect-66/66 w-full max-w-16.5"
        />
        <p className="font-dm-mono text-center text-sm leading-[1.39] font-normal tracking-widest text-black/60 uppercase">
          {lines.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
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

function EmptyStateTopControls({ variant }: { variant: "list" | "detail" }) {
  if (variant === "list") {
    return <InboxHeader />;
  }

  return (
    <div className="absolute top-4 right-4 left-4 z-10 sm:top-7 sm:right-8 sm:left-8">
      <StatusControls activeStatus="unread" onStatusChange={() => undefined} />
    </div>
  );
}

function FormsEmptyState({ lines, variant }: FormsEmptyStateProps) {
  return (
    <div className="relative w-full overflow-hidden lg:h-full lg:rounded-3xl lg:bg-white lg:shadow-sm">
      <EmptyStateTopControls variant={variant} />
      <EmptyStateCenter lines={lines} />
    </div>
  );
}

function CreateFormMenu({ onSelect }: { onSelect: (type: FormType) => void }) {
  return (
    <div className="font-dm-mono w-[430px] max-w-[calc(100vw-2rem)] rounded-xl bg-white px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] lg:max-w-[calc(100vw-3rem)] lg:px-3 lg:py-2">
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
              className={`min-w-0 flex-1 text-xs font-normal tracking-[0.1em] whitespace-nowrap uppercase lg:text-base lg:tracking-[0.18em] ${meta.textColor}`}
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
  selectedFormIndex,
  onSelectForm,
  onCreateWebsiteForm,
  onCreateOnlineForm,
}: {
  selectedFormIndex: number;
  onSelectForm: (index: number) => void;
  onCreateWebsiteForm: () => void;
  onCreateOnlineForm: () => void;
}) {
  const [isFormMenuOpen, setIsFormMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const formDropdownRef = useRef<HTMLDivElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);
  const selectedForm = MOCK_FORMS[selectedFormIndex] ?? null;
  useScrollLock(isFormMenuOpen || isCreateMenuOpen);

  const handleCreateForm = (type: FormType) => {
    setIsCreateMenuOpen(false);
    setIsFormMenuOpen(false);

    if (type === "website") {
      onCreateWebsiteForm();
      return;
    }

    onCreateOnlineForm();
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
          className="font-dm-mono flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#6433CC] px-3 text-xs font-normal tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#572bb5] lg:h-15 lg:gap-2 lg:px-5 lg:text-base lg:tracking-[0.18em]"
        >
          <Trash2 className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
          <span className="truncate">Delete</span>
        </button>
        <button
          type="button"
          className="font-dm-mono flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#F25430] px-3 text-xs font-normal tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#d94526] lg:h-15 lg:gap-2 lg:px-5 lg:text-base lg:tracking-[0.18em]"
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
              {selectedForm?.name ?? "Create a new form"}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-black transition-transform duration-200 lg:h-4 lg:w-4 ${isFormMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {isFormMenuOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 left-0 z-[70] mt-3 duration-200 sm:right-4 sm:left-auto sm:w-[calc(100%-7.5rem)] sm:min-w-[300px]">
            {MOCK_FORMS.length === 0 ? (
              <CreateFormMenu onSelect={handleCreateForm} />
            ) : (
              <div className="font-dm-mono rounded-xl bg-white px-2 py-1.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] lg:px-3 lg:py-2">
                {MOCK_FORMS.map((form, index) => (
                  <button
                    key={form.name}
                    type="button"
                    className="flex h-10 w-full cursor-pointer items-center gap-2 px-2 text-left transition-colors hover:bg-gray-50 lg:h-12 lg:gap-3 lg:px-3"
                    onClick={() => {
                      onSelectForm(index);
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
                      {form.name}
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

function FormPageTabs({
  pages,
  activePageIndex,
  onSelectPage,
}: {
  pages: NonNullable<MockForm["pages"]>;
  activePageIndex: number;
  onSelectPage: (index: number) => void;
}) {
  return (
    <div className="scrollbar-none flex h-11 min-w-0 items-center gap-3 overflow-x-auto">
      {pages.map((page, index) => (
        <button
          key={page.path}
          type="button"
          onClick={() => onSelectPage(index)}
          className={`font-dm-mono h-11 min-w-[132px] cursor-pointer rounded-lg px-4 text-sm font-normal tracking-[0.12em] uppercase shadow-sm sm:text-base ${
            index === activePageIndex
              ? "bg-[#006BE5] text-white"
              : "border border-[#EDEDED] bg-white text-black"
          }`}
        >
          <span className="block truncate">{page.path}</span>
        </button>
      ))}
    </div>
  );
}

function SubmissionNameDropdown({
  allSubmissions,
  selectedIndex,
  onSelect,
  formType,
}: {
  allSubmissions: FormSubmission[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  formType: FormType;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useScrollLock(isOpen);
  const selected =
    selectedIndex === null ? null : allSubmissions[selectedIndex] || null;

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
          {selected.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-black transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute left-0 z-30 mt-2 w-full rounded-xl border border-[#EDEDED] bg-white p-2 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] duration-200 sm:w-56">
          {allSubmissions.map((submission, index) => (
            <button
              key={submission.name}
              type="button"
              className="font-dm-mono flex h-10 w-full cursor-pointer items-center rounded-lg px-3 text-left text-sm font-normal tracking-[0.12em] text-black uppercase transition-colors hover:bg-gray-50"
              onClick={() => {
                onSelect(index);
                setIsOpen(false);
              }}
            >
              <span className="truncate">{submission.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormSubmissionDetail({
  allSubmissions,
  selectedIndex,
  onSelect,
  formType,
  hideTitle = false,
}: {
  allSubmissions: FormSubmission[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  formType: FormType;
  hideTitle?: boolean;
}) {
  const selected =
    selectedIndex === null ? null : allSubmissions[selectedIndex] || null;

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
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          formType={formType}
        />
      </div>

      <p className="font-dm-mono mt-6 text-xs font-normal tracking-[0.14em] text-black/60 uppercase sm:mt-8 sm:text-sm sm:tracking-[0.18em]">
        Recieved at {selected.receivedAt}
      </p>

      <div className="font-dm-mono mt-7 space-y-4 text-base leading-[1.45] font-normal tracking-[-0.02em] text-black uppercase sm:mt-10 sm:space-y-7 sm:text-2xl sm:leading-[1.32]">
        <p>
          <span className="font-bold">Name:</span> {selected.name}
        </p>
        <p>
          <span className="font-bold">Email:</span> {selected.email}
        </p>
        <p>
          <span className="font-bold">Interest:</span> {selected.interest}
        </p>
        <p className="max-w-[620px]">
          <span className="font-bold">Message:</span> {selected.message}
        </p>
      </div>
    </div>
  );
}

function FormSubmissionList({
  submissions,
  selectedIndex,
  onSelect,
  activeStatus,
  onStatusChange,
}: {
  submissions: FormSubmission[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  activeStatus: FormSubmissionStatus;
  onStatusChange: (status: FormSubmissionStatus) => void;
}) {
  const visibleSubmissions = submissions
    .map((submission, index) => ({
      ...submission,
      index,
    }))
    .filter((submission) => submission.status === activeStatus);

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
            const isSelected = submission.index === selectedIndex;
            return (
              <button
                key={submission.name}
                type="button"
                onClick={() => onSelect(submission.index)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-[19px] p-0 text-left transition-colors lg:h-[82px] lg:gap-4 lg:px-5 ${
                  isSelected
                    ? "text-[#006BE5] lg:bg-[#006BE5] lg:text-white"
                    : "text-black lg:bg-[#FBFBFB] lg:hover:bg-[#F6F6F6]"
                }`}
              >
                <Image
                  src={submission.avatar}
                  alt=""
                  width={52}
                  height={52}
                  className="h-11 w-11 shrink-0 rounded-full lg:h-[52px] lg:w-[52px]"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-dm-mono truncate text-base font-normal tracking-[0.08em] uppercase">
                    {submission.name}
                  </div>
                  <div
                    className={`font-stolzl mt-1 truncate text-sm ${
                      isSelected ? "text-white/80" : "text-[#9B9B9B]"
                    }`}
                  >
                    {submission.preview}
                  </div>
                </div>
                <span
                  className={`font-stolzl shrink-0 text-sm ${
                    isSelected ? "text-white" : "text-[#6433CC]"
                  }`}
                >
                  {submission.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FormsTabContent() {
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState<
    number | null
  >(null);
  const [isMobileDetail, setIsMobileDetail] = useState(false);
  const [selectedFormIndex, setSelectedFormIndex] = useState(0);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [activeStatus, setActiveStatus] =
    useState<FormSubmissionStatus>("unread");
  const [isWebsiteFormDrawerOpen, setIsWebsiteFormDrawerOpen] = useState(false);
  const [isOnlineFormDrawerOpen, setIsOnlineFormDrawerOpen] = useState(false);
  const [successForm, setSuccessForm] = useState<{
    type: FormType;
    name: string;
  } | null>(null);
  const selectedForm = MOCK_FORMS[selectedFormIndex] ?? null;
  const selectedFormType = selectedForm?.type ?? "website";
  const selectedFormPages = selectedForm?.pages ?? [];
  const isWebsiteForm = selectedFormType === "website";
  const selectedFormSubmissions =
    isWebsiteForm && selectedFormPages.length > 0
      ? (selectedFormPages[selectedPageIndex]?.submissions ?? [])
      : (selectedForm?.submissions ?? []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateMatch = () => setIsMobileDetail(mediaQuery.matches);

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useScrollLock(selectedSubmissionIndex !== null && isMobileDetail);

  const handleSelectForm = (index: number) => {
    setSelectedFormIndex(index);
    setSelectedPageIndex(0);
    setSelectedSubmissionIndex(null);
  };

  const handleSelectPage = (index: number) => {
    setSelectedPageIndex(index);
    setSelectedSubmissionIndex(null);
  };

  const handleStatusChange = (status: FormSubmissionStatus) => {
    setActiveStatus(status);
    setSelectedSubmissionIndex(null);
  };

  const inboxDetail = (
    <FormSubmissionDetail
      allSubmissions={selectedFormSubmissions}
      selectedIndex={selectedSubmissionIndex}
      onSelect={setSelectedSubmissionIndex}
      formType={selectedFormType}
    />
  );

  const mobileInboxDetail = (
    <FormSubmissionDetail
      allSubmissions={selectedFormSubmissions}
      selectedIndex={selectedSubmissionIndex}
      onSelect={setSelectedSubmissionIndex}
      formType={selectedFormType}
      hideTitle
    />
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-8">
      <FormsToolbar
        selectedFormIndex={selectedFormIndex}
        onSelectForm={handleSelectForm}
        onCreateWebsiteForm={() => setIsWebsiteFormDrawerOpen(true)}
        onCreateOnlineForm={() => setIsOnlineFormDrawerOpen(true)}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:h-[600px] lg:flex-none lg:grid-cols-12 lg:gap-8">
        <div className="hidden min-w-0 lg:col-span-7 lg:block">
          {inboxDetail}
        </div>
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-5 lg:gap-8">
          {isWebsiteForm && selectedFormPages.length > 0 && (
            <FormPageTabs
              pages={selectedFormPages}
              activePageIndex={selectedPageIndex}
              onSelectPage={handleSelectPage}
            />
          )}
          <div className="min-h-0 flex-1">
            <FormSubmissionList
              submissions={selectedFormSubmissions}
              selectedIndex={selectedSubmissionIndex}
              onSelect={setSelectedSubmissionIndex}
              activeStatus={activeStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
      {selectedSubmissionIndex !== null && isMobileDetail && (
        <div className="fixed inset-0 z-10000 bg-black/45 lg:hidden">
          <section className="animate-in slide-in-from-right ml-auto flex h-full w-full max-w-[520px] flex-col bg-white shadow-[-20px_0_70px_rgba(0,0,0,0.18)] duration-300">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
              <h2 className="font-dm-mono text-xl font-bold tracking-[-0.02em] text-black uppercase">
                Inbox
              </h2>
              <button
                type="button"
                aria-label="Close inbox"
                onClick={() => setSelectedSubmissionIndex(null)}
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
        onSuccess={() =>
          setSuccessForm({
            type: "website",
            name: "https://serendptai.com",
          })
        }
      />
      <OnlineFormDrawer
        open={isOnlineFormDrawerOpen}
        onClose={() => setIsOnlineFormDrawerOpen(false)}
        onSuccess={() =>
          setSuccessForm({
            type: "online",
            name: "NG Ballerz Form",
          })
        }
      />
      <FormCreationSuccessModal
        open={successForm !== null}
        formIcon={FORM_TYPE_META[successForm?.type ?? "website"].icon}
        formName={successForm?.name ?? ""}
        onClose={() => setSuccessForm(null)}
      />
    </div>
  );
}
