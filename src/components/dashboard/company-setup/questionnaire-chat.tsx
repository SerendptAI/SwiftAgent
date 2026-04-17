"use client";

import { Check, ChevronDown, ChevronUp, Paperclip } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";

import { useCompanyMutations } from "@/hooks/use-company";
import { useIngestKnowledge, useUploadKnowledge } from "@/hooks/use-knowledge";
import { useRunStroll, useUpdateStrollConfig } from "@/hooks/use-stroll";

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

type StepType = "select" | "upload" | "sandbox";

type SandboxStatus = "editing" | "configuring" | "running" | "done" | "error";

interface SandboxForm {
  dashboard_url: string;
  login_url: string;
  username: string;
  password: string;
}

interface SandboxState {
  form: SandboxForm;
  status: SandboxStatus;
  errorMessage?: string;
}

interface ChatEntry {
  question: string;
  options?: string[];
  selected?: string;
  type: StepType;
  uploads?: ChatUpload[];
  sandbox?: SandboxState;
}

interface QuestionDef {
  id: string;
  question: string;
  options?: string[];
  type: StepType;
  apiMapping?: {
    section: "type" | "boundaries";
    field: string;
    transform?: (value: string) => unknown;
  };
}

const QUESTIONS: QuestionDef[] = [
  {
    id: "company_type",
    question: "Are you a SAAS or crypto based company?",
    options: ["WE ARE A SAAS COMPANY.", "WE ARE A CRYPTO COMPANY."],
    type: "select",
    apiMapping: {
      section: "type",
      field: "company_type",
      transform: (v) => (v.includes("SAAS") ? "saas" : "crypto"),
    },
  },
  {
    id: "faq_upload",
    question:
      "Do you have FAQs? Upload the document or type in the common questions and answers.",
    type: "upload",
    apiMapping: {
      section: "boundaries",
      field: "custom_info",
    },
  },
  {
    id: "sandbox_setup",
    question:
      "Last step — let's set up your first sandbox stroll. Share your dashboard URL and login so I can take a look around safely.",
    type: "sandbox",
  },
];

const EMPTY_SANDBOX_FORM: SandboxForm = {
  dashboard_url: "",
  login_url: "",
  username: "",
  password: "",
};

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
  const [currentStep, setCurrentStep] = useState(0);
  const [entries, setEntries] = useState<ChatEntry[]>([
    {
      question: QUESTIONS[0].question,
      options: QUESTIONS[0].options,
      type: QUESTIONS[0].type,
    },
  ]);
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { updateCompany } = useCompanyMutations();
  const uploadKnowledge = useUploadKnowledge();
  const ingestKnowledge = useIngestKnowledge();
  const updateStrollConfig = useUpdateStrollConfig();
  const runStroll = useRunStroll();

  const scrollToBottom = () => {
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const advanceToNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep >= QUESTIONS.length) return;
    const next = QUESTIONS[nextStep];
    setCurrentStep(nextStep);
    setEntries((prev) => [
      ...prev,
      {
        question: next.question,
        options: next.options,
        type: next.type,
        sandbox:
          next.type === "sandbox"
            ? { form: { ...EMPTY_SANDBOX_FORM }, status: "editing" }
            : undefined,
      },
    ]);
    scrollToBottom();
  };

  const handleSelectOption = async (option: string) => {
    const questionDef = QUESTIONS[currentStep];

    // Mark selection in current entry
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === currentStep ? { ...entry, selected: option } : entry,
      ),
    );

    // Submit to API immediately
    if (companyId && questionDef?.apiMapping) {
      const value = questionDef.apiMapping.transform
        ? questionDef.apiMapping.transform(option)
        : option;

      try {
        await updateCompany.mutateAsync({
          companyId,
          section: questionDef.apiMapping.section,
          payload: { [questionDef.apiMapping.field]: value },
        });
      } catch (e) {
        console.error("Failed to save answer:", e);
      }
    }

    advanceToNextStep();
  };

  const appendUpload = (label: string, kind: UploadKind) => {
    let index = -1;
    setEntries((prev) =>
      prev.map((entry, i) => {
        if (i !== currentStep) return entry;
        const uploads = [
          ...(entry.uploads || []),
          { label, kind, status: "pending" as const },
        ];
        index = uploads.length - 1;
        return { ...entry, uploads };
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

    const uploadIndex = appendUpload(file.name, detectFileKind(file.name));
    scrollToBottom();

    try {
      await uploadKnowledge.mutateAsync({
        companyId,
        category: "faq",
        file,
      });
      setUploadStatus(uploadIndex, "done");
    } catch (err) {
      console.error("Failed to upload:", err);
      setUploadStatus(uploadIndex, "error");
    }
  };

  const updateSandboxForm = (patch: Partial<SandboxForm>) => {
    setEntries((prev) =>
      prev.map((entry, i) => {
        if (i !== currentStep || !entry.sandbox) return entry;
        return {
          ...entry,
          sandbox: {
            ...entry.sandbox,
            form: { ...entry.sandbox.form, ...patch },
            // Clear error state once the user edits again
            status:
              entry.sandbox.status === "error"
                ? "editing"
                : entry.sandbox.status,
            errorMessage:
              entry.sandbox.status === "error"
                ? undefined
                : entry.sandbox.errorMessage,
          },
        };
      }),
    );
  };

  const setSandboxStatus = (status: SandboxStatus, errorMessage?: string) => {
    setEntries((prev) =>
      prev.map((entry, i) => {
        if (i !== currentStep || !entry.sandbox) return entry;
        return {
          ...entry,
          sandbox: { ...entry.sandbox, status, errorMessage },
        };
      }),
    );
  };

  const handleSandboxSubmit = async () => {
    if (!companyId) return;
    const entry = entries[currentStep];
    const sandbox = entry?.sandbox;
    if (
      !sandbox ||
      sandbox.status === "configuring" ||
      sandbox.status === "running"
    ) {
      return;
    }

    const form = sandbox.form;
    const dashboardUrl = form.dashboard_url.trim();
    const username = form.username.trim();
    const password = form.password;

    if (!dashboardUrl || !username || !password) {
      setSandboxStatus(
        "error",
        "Dashboard URL, username, and password are required.",
      );
      return;
    }

    setSandboxStatus("configuring");

    try {
      await updateStrollConfig.mutateAsync({
        companyId,
        payload: {
          dashboard_url: dashboardUrl,
          sandbox_mode: true,
          max_pages: 10,
          credentials: {
            login_url: form.login_url.trim() || undefined,
            username,
            password,
          },
        },
      });

      setSandboxStatus("running");
      await runStroll.mutateAsync({ companyId });
      setSandboxStatus("done");
      scrollToBottom();
    } catch (err) {
      console.error("Failed to set up sandbox:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Couldn't start the sandbox stroll.";
      setSandboxStatus("error", message);
    }
  };

  const handleTextSubmit = async () => {
    const value = textInput.trim();
    if (!value || !companyId || ingestKnowledge.isPending) return;

    const uploadIndex = appendUpload(value, "text");
    setTextInput("");
    scrollToBottom();

    try {
      await ingestKnowledge.mutateAsync({
        company_id: companyId,
        category: "faq",
        title: value.slice(0, 80),
        content: value,
      });
      setUploadStatus(uploadIndex, "done");
    } catch (err) {
      console.error("Failed to save FAQ text:", err);
      setUploadStatus(uploadIndex, "error");
    }
  };

  const currentEntry = entries[currentStep];
  const showInputBar = currentEntry?.type === "upload";
  const canAdvanceFromFaq =
    currentEntry?.type === "upload" &&
    !!currentEntry.uploads?.some((u) => u.status === "done") &&
    !uploadKnowledge.isPending &&
    !ingestKnowledge.isPending;

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute inset-y-0 right-[350px] left-0 flex items-center justify-center p-6 lg:left-[105px]">
        <div className="relative flex h-[80%] w-full max-w-md flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src={logoUrl || "/images/company_logo_new.svg"}
                alt={companyName}
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-dm-mono text-sm font-bold tracking-wider uppercase">
                {companyName}
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
                          className={`font-dm-mono flex w-fit items-center gap-2 rounded-md border px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-colors ${
                            isSelected
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
                        className={`mt-3 ml-auto flex w-fit flex-col items-end ${
                          item.status === "pending" ? "opacity-60" : ""
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
                            className={`font-dm-mono mt-2 text-[10px] font-bold tracking-wider uppercase ${
                              item.status === "error"
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
                      className={`mt-3 ml-auto w-fit rounded-md px-4 py-3 ${
                        item.status === "error"
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

                {/* Sandbox setup form */}
                {entry.type === "sandbox" && entry.sandbox && (
                  <SandboxFormCard
                    sandbox={entry.sandbox}
                    isCurrent={entryIdx === currentStep}
                    onChange={updateSandboxForm}
                    onSubmit={handleSandboxSubmit}
                  />
                )}
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          {/* Input bar for upload/text questions */}
          {showInputBar && (
            <div className="space-y-3 border-t border-gray-100 px-4 py-3">
              {canAdvanceFromFaq && (
                <button
                  onClick={advanceToNextStep}
                  className="font-dm-mono w-full cursor-pointer rounded-md bg-[#E8613C] px-4 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#d1552f]"
                >
                  CONTINUE →
                </button>
              )}
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

// ── Sandbox form ──────────────────────────────────────────────────────────────

function SandboxFormCard({
  sandbox,
  isCurrent,
  onChange,
  onSubmit,
}: {
  sandbox: SandboxState;
  isCurrent: boolean;
  onChange: (patch: Partial<SandboxForm>) => void;
  onSubmit: () => void;
}) {
  const { form, status, errorMessage } = sandbox;
  const isBusy = status === "configuring" || status === "running";
  const isDone = status === "done";
  const locked = !isCurrent || isBusy || isDone;

  if (isDone) {
    return (
      <div className="mt-3 w-fit max-w-[80%] rounded-lg bg-blue-600 px-4 py-3">
        <p className="font-dm-mono text-xs font-bold tracking-wider text-white uppercase">
          Sandbox stroll started · we&apos;ll share results soon
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
      <SandboxField
        label="Dashboard URL"
        value={form.dashboard_url}
        placeholder="https://app.example.com/dashboard"
        disabled={locked}
        onChange={(v) => onChange({ dashboard_url: v })}
      />
      <SandboxField
        label="Login URL (optional)"
        value={form.login_url}
        placeholder="https://app.example.com/login"
        disabled={locked}
        onChange={(v) => onChange({ login_url: v })}
      />
      <SandboxField
        label="Username"
        value={form.username}
        placeholder="admin@company.com"
        disabled={locked}
        onChange={(v) => onChange({ username: v })}
      />
      <SandboxField
        label="Password"
        value={form.password}
        type="password"
        placeholder="••••••••"
        disabled={locked}
        onChange={(v) => onChange({ password: v })}
      />

      {errorMessage && (
        <p className="font-dm-mono text-xs font-bold tracking-wider text-red-500 uppercase">
          {errorMessage}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={locked}
        className="font-dm-mono w-full cursor-pointer rounded-md bg-[#E8613C] px-4 py-3 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#d1552f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "configuring"
          ? "SAVING CONFIG…"
          : status === "running"
            ? "STARTING STROLL…"
            : "START SANDBOX STROLL"}
      </button>
    </div>
  );
}

function SandboxField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "password";
}) {
  return (
    <label className="block">
      <span className="font-dm-mono mb-1 block text-[10px] font-bold tracking-wider text-gray-500 uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="font-dm-mono w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 disabled:opacity-60"
      />
    </label>
  );
}
