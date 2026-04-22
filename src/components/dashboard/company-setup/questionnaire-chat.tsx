"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  Paperclip,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCheckEmailSlug, useCompanyMutations } from "@/hooks/use-company";
import { useIngestKnowledge, useUploadKnowledge } from "@/hooks/use-knowledge";

const BriggsAnimation = dynamic(
  () => import("@/components/briggs-face-animation"),
  { ssr: false },
);

// ── Types ────────────────────────────────────────────────────────────────────

type UploadKind = "text" | "pdf" | "word" | "file";

interface ChatUpload {
  label: string;
  kind: UploadKind;
  status: "pending" | "done" | "error";
}

function detectFileKind(filename: string): UploadKind {
  const ext = filename.toLowerCase().split(".").pop();
  if (ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx") return "word";
  return "file";
}

const FILE_THUMBNAILS: Partial<Record<UploadKind, string>> = {
  pdf: "/images/pdf.svg",
  word: "/images/word.svg",
};

type StepType = "select" | "upload";

type CompanyType = "saas" | "crypto";

type UploadCategory =
  | "faq"
  | "manuals"
  | "policies"
  | "sops"
  | "whitepaper"
  | "tokenomics"
  | "links"
  | "audit_reports"
  | "governance"
  | "risk_disclosures"
  | "roadmap"
  | "community_support";

interface ChatEntry {
  question: string;
  options?: string[];
  selected?: string;
  type: StepType;
  uploads?: ChatUpload[];
}

interface QuestionDef {
  id: string;
  question: string;
  options?: string[];
  type: StepType;
  uploadCategory?: UploadCategory;
  apiMapping?: {
    section: "type" | "boundaries";
    field: string;
    transform?: (value: string) => unknown;
  };
}

const INITIAL_QUESTION: QuestionDef = {
  id: "company_type",
  question: "Are you a SAAS or crypto based company?",
  options: ["WE ARE A SAAS COMPANY.", "WE ARE A CRYPTO COMPANY."],
  type: "select",
  apiMapping: {
    section: "type",
    field: "company_type",
    transform: (v) => (v.includes("SAAS") ? "saas" : "crypto"),
  },
};

const FAQ_QUESTION: QuestionDef = {
  id: "faq_upload",
  question:
    "Do you have FAQs? Upload the document or type a few common questions and answers.",
  type: "upload",
  uploadCategory: "faq",
  apiMapping: {
    section: "boundaries",
    field: "custom_info",
  },
};

const SAAS_QUESTIONS: QuestionDef[] = [
  FAQ_QUESTION,
  {
    id: "manuals_upload",
    question: "Do you have any manuals? Upload the document or type it",
    type: "upload",
    uploadCategory: "manuals",
  },
  {
    id: "policies_upload",
    question: "Do you have policies? Upload the document or type it",
    type: "upload",
    uploadCategory: "policies",
  },
  {
    id: "sops_upload",
    question: "Do you have internal SOPs? Upload the document or type it",
    type: "upload",
    uploadCategory: "sops",
  },
];

const CRYPTO_QUESTIONS: QuestionDef[] = [
  FAQ_QUESTION,
  {
    id: "whitepaper_upload",
    question: "Do you have a Whitepaper? Upload the document or type it",
    type: "upload",
    uploadCategory: "whitepaper",
  },
  {
    id: "tokenomics_upload",
    question: "Do you have a Tokenomics Documentation? Upload the document",
    type: "upload",
    uploadCategory: "tokenomics",
  },
  {
    id: "blockchain_links",
    question:
      "Do you have Blockchain Explorer Links? Type them please, separate them with commas",
    type: "upload",
    uploadCategory: "links",
  },
  {
    id: "audit_reports_upload",
    question: "Do you have Audit Reports? Upload the document",
    type: "upload",
    uploadCategory: "audit_reports",
  },
  {
    id: "governance_upload",
    question: "Do you have Governance Documentation? Upload the document",
    type: "upload",
    uploadCategory: "governance",
  },
  {
    id: "risk_disclosures_upload",
    question: "Do you have Risk Disclosures? Upload the document or type it",
    type: "upload",
    uploadCategory: "risk_disclosures",
  },
  {
    id: "roadmap_upload",
    question: "Do you have a Roadmap and Updates? Upload the document",
    type: "upload",
    uploadCategory: "roadmap",
  },
  {
    id: "community_support_upload",
    question: "Do you have Community and Support Docs? Upload the document",
    type: "upload",
    uploadCategory: "community_support",
  },
];

function buildQuestions(type: CompanyType | null): QuestionDef[] {
  if (type === "crypto") return [INITIAL_QUESTION, ...CRYPTO_QUESTIONS];
  if (type === "saas") return [INITIAL_QUESTION, ...SAAS_QUESTIONS];
  return [INITIAL_QUESTION];
}

// ── Component ────────────────────────────────────────────────────────────────

export function QuestionnaireChat({
  companyId,
  companyName,
  logoUrl,
}: {
  companyId: string | null;
  companyName: string;
  logoUrl?: string;
}) {
  const [questions, setQuestions] = useState<QuestionDef[]>(() =>
    buildQuestions(null),
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [entries, setEntries] = useState<ChatEntry[]>([
    {
      question: INITIAL_QUESTION.question,
      options: INITIAL_QUESTION.options,
      type: INITIAL_QUESTION.type,
    },
  ]);
  const [textInput, setTextInput] = useState("");
  const [phase, setPhase] = useState<"chat" | "thanks" | "email" | "congrats">(
    "chat",
  );
  const [emailHandle, setEmailHandle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { updateCompany, updateEmailSlug } = useCompanyMutations();
  const uploadKnowledge = useUploadKnowledge();
  const ingestKnowledge = useIngestKnowledge();
  const [emailError, setEmailError] = useState<string | null>(null);

  const scrollToBottom = () => {
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const advanceToNextStep = (overrideQuestions?: QuestionDef[]) => {
    const list = overrideQuestions ?? questions;
    const nextStep = currentStep + 1;
    if (nextStep >= list.length) {
      setPhase("thanks");
      return;
    }
    const next = list[nextStep];
    setCurrentStep(nextStep);
    setEntries((prev) => [
      ...prev,
      {
        question: next.question,
        options: next.options,
        type: next.type,
      },
    ]);
    scrollToBottom();
  };

  const handleSelectOption = (option: string) => {
    const questionDef = questions[currentStep];

    // Mark selection in current entry
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === currentStep ? { ...entry, selected: option } : entry,
      ),
    );

    // Determine branching for company_type
    let nextQuestions = questions;
    if (questionDef?.id === "company_type") {
      const type: CompanyType = option.includes("SAAS") ? "saas" : "crypto";
      nextQuestions = buildQuestions(type);
      setQuestions(nextQuestions);
    }

    // Fire-and-forget: save answer in the background so the UI advances instantly.
    if (companyId && questionDef?.apiMapping) {
      const value = questionDef.apiMapping.transform
        ? questionDef.apiMapping.transform(option)
        : option;

      updateCompany
        .mutateAsync({
          companyId,
          section: questionDef.apiMapping.section,
          payload: { [questionDef.apiMapping.field]: value },
        })
        .catch((e) => console.error("Failed to save answer:", e));
    }

    advanceToNextStep(nextQuestions);
  };

  const appendUpload = (label: string, kind: UploadKind) => {
    // Compute the index synchronously from current state — the setEntries
    // updater runs later, so relying on its side-effect returns stale values.
    const index = entries[currentStep]?.uploads?.length ?? 0;
    setEntries((prev) =>
      prev.map((entry, i) => {
        if (i !== currentStep) return entry;
        return {
          ...entry,
          uploads: [
            ...(entry.uploads || []),
            { label, kind, status: "pending" as const },
          ],
        };
      }),
    );
    return index;
  };

  const setUploadStatus = (
    uploadIndex: number,
    status: ChatUpload["status"],
  ) => {
    if (uploadIndex < 0) return;
    setEntries((prev) =>
      prev.map((entry, i) => {
        if (i !== currentStep || !entry.uploads) return entry;
        return {
          ...entry,
          uploads: entry.uploads.map((u, j) =>
            j === uploadIndex ? { ...u, status } : u,
          ),
        };
      }),
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so re-selecting the same file still fires onChange
    e.target.value = "";
    if (!file || !companyId) return;

    const category = questions[currentStep]?.uploadCategory ?? "faq";
    const uploadIndex = appendUpload(file.name, detectFileKind(file.name));
    scrollToBottom();

    try {
      await uploadKnowledge.mutateAsync({
        companyId,
        category,
        file,
      });
      setUploadStatus(uploadIndex, "done");
      advanceToNextStep();
    } catch (err) {
      console.error("Failed to upload:", err);
      setUploadStatus(uploadIndex, "error");
    }
  };

  const handleTextSubmit = async () => {
    const value = textInput.trim();
    if (!value || !companyId || ingestKnowledge.isPending) return;

    const category = questions[currentStep]?.uploadCategory ?? "faq";
    const uploadIndex = appendUpload(value, "text");
    setTextInput("");
    scrollToBottom();

    try {
      await ingestKnowledge.mutateAsync({
        company_id: companyId,
        category,
        title: value.slice(0, 80),
        content: value,
      });
      setUploadStatus(uploadIndex, "done");
      advanceToNextStep();
    } catch (err) {
      console.error("Failed to save knowledge text:", err);
      setUploadStatus(uploadIndex, "error");
    }
  };

  const currentEntry = entries[currentStep];
  const showInputBar = currentEntry?.type === "upload";

  if (phase === "thanks") {
    return (
      <OverlayShell>
        <Image
          src="/images/champion.svg"
          alt="Completed"
          width={120}
          height={140}
          className="mb-8"
        />
        <h2 className="font-greed-narrow mb-10 text-3xl leading-tight font-bold text-gray-900">
          Thanks for helping
          <br />
          us learn about your
          <br />
          company.
        </h2>
        <PrimaryActionButton onClick={() => setPhase("email")}>
          Pick an email address
        </PrimaryActionButton>

        <div className="absolute right-0 -bottom-20 -translate-x-1/2">
          <BriggsAnimation className="h-16 w-16" />
        </div>
      </OverlayShell>
    );
  }

  if (phase === "email") {
    return (
      <EmailPickerScreen
        companyId={companyId}
        value={emailHandle}
        onChange={(v) => {
          setEmailHandle(v);
          if (emailError) setEmailError(null);
        }}
        error={emailError}
        isSaving={updateEmailSlug.isPending}
        onSelect={async (handle) => {
          if (!companyId) {
            setEmailHandle(handle);
            setPhase("congrats");
            return;
          }
          try {
            await updateEmailSlug.mutateAsync({ companyId, slug: handle });
            setEmailHandle(handle);
            setPhase("congrats");
          } catch (err) {
            console.error("Failed to save email slug:", err);
            setEmailError(
              err instanceof Error
                ? err.message
                : "Could not save this email. Please try another.",
            );
          }
        }}
      />
    );
  }

  if (phase === "congrats") {
    return (
      <OverlayShell>
        <Image
          src="/images/congratsemail.svg"
          alt="Congratulations"
          width={120}
          height={140}
          className="mb-6"
        />
        <h2 className="font-greed-narrow mb-3 text-3xl font-bold text-gray-900">
          Congratulations
        </h2>
        <p className="font-dm-mono mb-6 text-xs tracking-wider text-gray-500 uppercase">
          All customer replies will be
          <br />
          made with this email
        </p>
        <div className="mb-8 w-full rounded-sm border border-gray-200 px-4 py-3 text-center">
          <span className="font-dm-mono text-sm font-bold tracking-wider text-gray-900">
            {emailHandle}
          </span>
          <span className="font-dm-mono text-sm tracking-wider text-gray-400">
            @swifty.email
          </span>
        </div>
        <PrimaryActionButton
          onClick={() => router.push("/dashboard?settings=1")}
        >
          Finish
        </PrimaryActionButton>
      </OverlayShell>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute inset-y-0 right-[350px] left-0 flex items-center justify-center p-6 lg:left-[105px]">
        <div className="relative flex h-[80%] w-full max-w-md flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/newlogo.svg"
                alt={companyName}
                width={34}
                height={34}

              />
              <span className="font-dm-mono text-sm font-bold tracking-wider uppercase">
                SWIFT AGENTS
              </span>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>

          {/* Chat body */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {entries.map((entry, entryIdx) => (
              <div key={entryIdx} className="mb-6">
                {/* Bot question */}
                <div className="mb-4 w-fit max-w-[80%] rounded-lg rounded-tl-none bg-blue-50 px-4 py-3">
                  <p className="text-sm font-medium text-blue-600">
                    {entry.question}
                  </p>
                </div>

                {/* Options */}
                {entry.options && (
                  <div className="space-y-3">
                    {entry.options.map((option) => {
                      const isSelected = entry.selected === option;
                      return (
                        <button
                          key={option}
                          disabled={!!entry.selected}
                          onClick={() => handleSelectOption(option)}
                          className={`font-dm-mono flex w-fit items-center gap-2 rounded-md border px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-colors ${isSelected
                            ? "border-[#E8613C] bg-[#E8613C] text-white"
                            : entry.selected
                              ? "cursor-default border-gray-200 bg-white text-gray-900"
                              : "cursor-pointer border-gray-200 bg-white text-gray-900 hover:border-gray-400"
                            }`}
                        >
                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-black/20">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Uploaded files/text */}
                {entry.uploads?.map((item, idx) => {
                  const thumbnail = FILE_THUMBNAILS[item.kind];

                  if (thumbnail) {
                    return (
                      <div
                        key={idx}
                        className={`mt-3 ml-auto flex w-fit flex-col items-end ${item.status === "pending" ? "opacity-60" : ""
                          }`}
                      >
                        <Image
                          src={thumbnail}
                          alt={item.kind.toUpperCase()}
                          width={150}
                          height={126}
                          className="rounded-2xl"
                        />
                        {item.status !== "done" && (
                          <p
                            className={`font-dm-mono mt-2 text-[10px] font-bold tracking-wider uppercase ${item.status === "error"
                              ? "text-red-500"
                              : "text-gray-400"
                              }`}
                          >
                            {item.status === "error"
                              ? "Upload failed"
                              : "Uploading…"}
                          </p>
                        )}
                      </div>
                    );
                  }

                  const statusLabel =
                    item.status === "pending"
                      ? " · UPLOADING…"
                      : item.status === "error"
                        ? " · FAILED"
                        : "";

                  return (
                    <div
                      key={idx}
                      className={`max-4/5 mt-3 ml-auto w-fit rounded-md px-4 py-3 ${item.status === "error"
                        ? "bg-red-500"
                        : item.status === "pending"
                          ? "bg-blue-400"
                          : "bg-blue-600"
                        }`}
                    >
                      <p className="font-dm-mono text-xs font-bold tracking-wider text-white">
                        {item.label}
                        {statusLabel}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          {/* Input bar for upload/text questions */}
          {showInputBar && (
            <div className="space-y-3 border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadKnowledge.isPending}
                  className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                  placeholder="Ask a question"
                  disabled={ingestKnowledge.isPending}
                  className="font-dm-mono flex-1 text-sm outline-none placeholder:text-gray-400 disabled:opacity-50"
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={ingestKnowledge.isPending || !textInput.trim()}
                  className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* Rive animation */}
          <div className="absolute right-0 -bottom-20 -translate-x-1/2">
            <BriggsAnimation className="h-16 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Completion screens ────────────────────────────────────────────────────────

function OverlayShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="relative flex w-full max-w-md flex-col items-center justify-center bg-white px-10 py-14 text-center shadow-xl">
        {children}
      </div>
    </div>
  );
}

function PrimaryActionButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-dm-mono w-full cursor-pointer rounded-sm bg-[#006BE5] py-4 text-center text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#0055B8] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

// Slug format: lowercase letters, digits, dashes. 3-30 chars per API.
const EMAIL_HANDLE_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

type EmailAvailability =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken";

function EmailPickerScreen({
  companyId,
  value,
  onChange,
  onSelect,
  error,
  isSaving,
}: {
  companyId: string | null;
  value: string;
  onChange: (v: string) => void;
  onSelect: (handle: string) => void;
  error?: string | null;
  isSaving?: boolean;
}) {
  const handle = value.trim().toLowerCase();
  const isValidFormat = EMAIL_HANDLE_PATTERN.test(handle);

  // Debounce the slug we actually send to the API
  const [debouncedHandle, setDebouncedHandle] = useState(handle);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedHandle(handle), 400);
    return () => clearTimeout(timer);
  }, [handle]);

  const canCheck = !!companyId && isValidFormat && debouncedHandle === handle;
  const checkQuery = useCheckEmailSlug(companyId, debouncedHandle, {
    enabled: canCheck,
  });

  let availability: EmailAvailability = "idle";
  let takenMessage = "Name taken, please try another one";
  if (!handle) {
    availability = "idle";
  } else if (!isValidFormat) {
    availability = "invalid";
  } else if (debouncedHandle !== handle || checkQuery.isFetching) {
    availability = "checking";
  } else if (checkQuery.data) {
    availability = checkQuery.data.available ? "available" : "taken";
    if (!checkQuery.data.available && checkQuery.data.suggestion) {
      takenMessage = `Name taken. Try "${checkQuery.data.suggestion}"`;
    }
  }

  return (
    <OverlayShell>
      <Image
        src="/images/emaildelivery.svg"
        alt="Pick email"
        width={90}
        height={180}
        className="mb-6"
      />
      <p className="font-dm-mono mb-6 text-sm tracking-wider text-gray-500 uppercase">
        This is the email address that will be used to communicate with
        customers via email, it should correspond with your company name
      </p>
      <div className="mb-3 flex w-fit items-center rounded-sm border border-gray-200 px-4 py-3">
        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value.toLowerCase().replace(/\s+/g, ""))
          }
          placeholder="companyname"
          size={12}
          className="font-dm-mono min-w-0 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        <span className="font-dm-mono text-sm tracking-wider text-gray-400">
          @swifty.email
        </span>
      </div>
      <div className="mb-6 flex h-4 items-center gap-1.5">
        {availability === "checking" && (
          <span className="font-dm-mono text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            Checking availability…
          </span>
        )}
        {availability === "invalid" && handle.length > 0 && (
          <>
            <CircleX className="h-4 w-4 fill-red-500 text-white" />
            <span className="font-dm-mono text-[10px] font-bold tracking-wider text-red-500 uppercase">
              3-30 chars, lowercase letters, digits or dashes
            </span>
          </>
        )}
        {availability === "available" && (
          <>
            <CircleCheck className="h-4 w-4 fill-green-500 text-white" />
            <span className="font-dm-mono text-[10px] font-bold tracking-wider text-green-600 uppercase">
              Name available
            </span>
          </>
        )}
        {availability === "taken" && (
          <>
            <CircleX className="h-4 w-4 fill-red-500 text-white" />
            <span className="font-dm-mono text-[10px] font-bold tracking-wider text-red-500 uppercase">
              {takenMessage}
            </span>
          </>
        )}
        {error && availability !== "taken" && (
          <span className="font-dm-mono text-[10px] font-bold tracking-wider text-red-500 uppercase">
            {error}
          </span>
        )}
      </div>
      <PrimaryActionButton
        onClick={() => onSelect(handle)}
        disabled={availability !== "available" || !!isSaving}
      >
        {isSaving ? "Saving…" : "Select"}
      </PrimaryActionButton>
    </OverlayShell>
  );
}
