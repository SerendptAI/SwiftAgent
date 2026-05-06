"use client";

import { CheckCircle2, ChevronDown, Copy, XCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useStrollConfig, useUpdateStrollConfig } from "@/hooks/use-stroll";
import type { StrollConfigPayload } from "@/services/stroll";

type WidgetMode = "widget" | "button";

export function WidgetCard() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSticky, setIsSticky] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [mode, setMode] = useState<WidgetMode>("widget");
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const activeCompanyId = useActiveCompanyId();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  // Auto-open settings when arriving from onboarding (/dashboard?settings=1)
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (searchParams.get("settings") === "1") {
      setIsSettingsOpen(true);
      const next = new URLSearchParams(searchParams.toString());
      next.delete("settings");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
  }, [searchParams, pathname, router]);

  // Close mode dropdown on outside click
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!modeDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(e.target as Node)
      ) {
        setModeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modeDropdownOpen]);

  const companyId = activeCompanyId || "";

  const codeSnippet = useMemo(() => {
    if (!companyId) return "";
    if (mode === "button") {
      return `<script src="https://widget.swiftagents.org/dist/widget-ui.js" data-company-id="${companyId}" data-mode="button" data-trigger="[data-swift-agent-open]" defer></script>\n<button data-swift-agent-open>Chat with us</button>`;
    }
    return `<script src="https://widget.swiftagents.org/dist/widget-ui.js" data-company-id="${companyId}" defer></script>`;
  }, [companyId, mode]);

  const handleCopy = useCallback(() => {
    if (!codeSnippet) return;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setIsSettingsOpen(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeSnippet]);

  return (
    <div className="rounded-xl">
      {isOpen ? (
        <div className="relative">
          <div className="relative">
            {/* Top bar with notch cutout */}
            <div className="absolute top-0 right-0 left-0 z-50 flex h-[48px] items-center gap-4">
              <div
                className="bg-muted h-full rounded-br-md pr-4"
                ref={modeDropdownRef}
              >
                <button
                  onClick={() => setModeDropdownOpen((v) => !v)}
                  className="font-dm-mono flex items-center gap-2 rounded-md bg-[#006BE5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${modeDropdownOpen ? "rotate-180" : ""}`}
                  />
                  {mode === "button" ? "Button" : "Widget"}
                </button>

                {modeDropdownOpen && (
                  <div className="animate-in fade-in slide-in-from-top-1 absolute top-[48px] left-0 z-1000 min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        setMode("widget");
                        setModeDropdownOpen(false);
                      }}
                      className={`font-dm-mono flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${mode === "widget" ? "font-semibold text-[#006BE5]" : "text-gray-700"}`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-[#006BE5]/10 text-[#006BE5]">
                        <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                      </span>
                      Widget Mode
                    </button>
                    <div className="mx-3 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        setMode("button");
                        setModeDropdownOpen(false);
                      }}
                      className={`font-dm-mono flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${mode === "button" ? "font-semibold text-[#006BE5]" : "text-gray-700"}`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded ${mode === "button" ? "bg-[#006BE5]/10 text-[#006BE5]" : "bg-gray-100 text-gray-500"}`}
                      >
                        <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                      </span>
                      Button Mode
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center pr-6">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="font-greed-narrow flex cursor-pointer items-center gap-2 rounded-md bg-[#EDEDED] px-4 py-2 text-xs font-bold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-100"
                >
                  <Icons.Settings className="h-5 w-5" />
                  SETTINGS
                </button>
              </div>
            </div>

            <div className="rounded-md border border-gray-100 bg-white px-5 pt-16 pb-5 shadow-sm">
              {/* Sticky toggle */}
              <div className="mb-4 flex items-center gap-2">
                <button
                  type="button"
                  aria-pressed={isSticky}
                  className="relative flex h-[32px] w-[125px] cursor-pointer items-center rounded-md bg-[#EDEDED] p-1"
                  onClick={() => setIsSticky(!isSticky)}
                >
                  {/* Label — always visible on the side opposite the knob */}
                  <span
                    className={`font-dm-mono absolute z-[1] text-sm font-normal text-gray-400 transition-all duration-300 ease-in-out select-none ${
                      isSticky ? "right-3" : "left-3"
                    }`}
                  >
                    sticky?
                  </span>
                  {/* Sliding knob */}
                  <span
                    className={`font-dm-mono absolute top-1 bottom-1 z-[2] flex w-[44px] items-center justify-center rounded-md text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-in-out ${
                      isSticky
                        ? "left-1 bg-black text-white"
                        : "left-[77px] bg-gray-300 text-gray-500"
                    }`}
                  >
                    {isSticky ? "ON" : "OFF"}
                  </span>
                </button>
                <InfoTooltip text="Toggle to enable/disable the widget on your website." />
              </div>

              {/* Code snippet */}
              <pre className="font-stolzl rounded-lg bg-[#F6F6F6] p-4 text-[13px] leading-relaxed break-all whitespace-pre-wrap text-gray-700">
                {codeSnippet || "No widget code found."}
              </pre>
              {mode === "button" && (
                <p className="font-dm-mono mt-2 text-[11px] text-gray-400">
                  Add the{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-600">
                    data-swift-agent-open
                  </code>{" "}
                  attribute to any element to trigger the widget popup.
                </p>
              )}

              {/* Copy button */}
              <button
                onClick={handleCopy}
                disabled={!codeSnippet}
                className="font-dm-mono mt-6 flex w-full items-center justify-center gap-2.5 rounded-md bg-[#006BE5] py-2 text-base font-normal text-white shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-[#1E88E5] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-[-2px_2px_0px_0px_#000000] disabled:opacity-50"
              >
                <Copy className="h-5 w-5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
        >
          <ChevronDown className="h-4 w-4 -rotate-90 transition-transform" />
          Widget
        </button>
      )}

      {isSettingsOpen && (
        <ChatbotSettingsSidebar
          companyId={companyId}
          onClose={() => setIsSettingsOpen(false)}
          onSaved={() =>
            setToast({ kind: "success", message: "Settings saved." })
          }
          onError={(message) => setToast({ kind: "error", message })}
        />
      )}

      {toast && (
        <ToastNotification
          kind={toast.kind}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ── Chatbot settings sidebar ─────────────────────────────────────────────────

type AgentId = "047" | "007" | "626" | "001";

interface AgentOption {
  id: AgentId;
  description: string;
  requiresLogin?: boolean;
}

const AGENT_OPTIONS: AgentOption[] = [
  {
    id: "047",
    description:
      "Agent 047 can locate any password, listing, or purchase on your site, no matter the complexity. It scans and provides instant answers for all account-related requirements.",
    requiresLogin: true,
  },
  {
    id: "007",
    description:
      "Agent 007 can search a website's front-end content for custom info. If a website doesn't have the requested data, it responds gracefully.",
  },
  {
    id: "626",
    description:
      "Agent 626 can analyze cryptocurrency transactions and inform users of potential issues.",
  },

  {
    id: "001",
    description:
      "Agent 001 handles general inquiries and light conversation for first-time visitors.",
  },
];

const SIDEBAR_TRANSITION_MS = 300;

function ChatbotSettingsSidebar({
  companyId,
  onClose,
  onSaved,
  onError,
}: {
  companyId: string;
  onClose: () => void;
  onSaved?: () => void;
  onError?: (message: string) => void;
}) {
  const { data: config } = useStrollConfig(companyId || null);
  const updateConfig = useUpdateStrollConfig();

  const [selected, setSelected] = useState<Set<AgentId>>(
    () => new Set(["047", "007"]),
  );
  const [dashboardUrl, setDashboardUrl] = useState("");
  const [loginUrl, setLoginUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [preAuthUrl, setPreAuthUrl] = useState("");
  const [schedule, setSchedule] = useState("0 2 * * *");
  const [maxPages, setMaxPages] = useState<number>(50);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (!config) return;
    setDashboardUrl(config.dashboard_url || "");
    setSchedule(config.schedule || "0 2 * * *");
    setSandboxMode(config.sandbox_mode ?? true);
    setMaxPages(config.max_pages ?? 50);
    if (config.credentials) {
      setLoginUrl(config.credentials.login_url || "");
      setUsername(config.credentials.username || "");
      setPassword(config.credentials.password || "");
      setPreAuthUrl(config.credentials.pre_auth_url || "");
    }
  }, [config]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const closeWithAnimation = useCallback(() => {
    setIsShown(false);
    setTimeout(onClose, SIDEBAR_TRANSITION_MS);
  }, [onClose]);

  const toggleAgent = (id: AgentId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!companyId) {
      closeWithAnimation();
      return;
    }
    const credentials: StrollConfigPayload["credentials"] = {
      username: username.trim(),
      password,
    };
    if (loginUrl.trim()) credentials.login_url = loginUrl.trim();
    if (preAuthUrl.trim()) credentials.pre_auth_url = preAuthUrl.trim();

    try {
      await updateConfig.mutateAsync({
        companyId,
        payload: {
          dashboard_url: dashboardUrl.trim(),
          schedule: schedule.trim() || "0 2 * * *",
          credentials,
          sandbox_mode: sandboxMode,
          max_pages: maxPages,
        },
      });
    } catch (err) {
      console.error("Failed to save sandbox credentials:", err);
      onError?.(
        err instanceof Error
          ? err.message
          : "Could not save settings. Please try again.",
      );
      return;
    }
    onSaved?.();
    closeWithAnimation();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        aria-label="Close settings"
        onClick={closeWithAnimation}
        className={`flex-1 cursor-default bg-black/40 transition-opacity duration-300 ${
          isShown ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
          isShown ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          <section>
            <h3 className="font-greed-narrow mb-3 text-base font-bold tracking-wider text-gray-900 uppercase">
              Select Agents
            </h3>
            <p className="font-dm-mono mb-5 text-xs tracking-wider text-gray-500 uppercase">
              Which agents are allowed to work in this chatbot
            </p>
            <ul className="space-y-4">
              {AGENT_OPTIONS.map((agent) => {
                const isChecked = selected.has(agent.id);
                return (
                  <li key={agent.id}>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAgent(agent.id)}
                        className="mt-1 h-4 w-4 cursor-pointer accent-[#006BE5]"
                      />
                      <div className="flex-1">
                        <p className="font-dm-mono mb-1 text-xs font-bold tracking-wider text-gray-900 uppercase">
                          Agent {agent.id}
                        </p>
                        <p className="font-dm-mono text-[11px] leading-relaxed tracking-wide text-gray-500 uppercase">
                          {agent.description}
                        </p>
                        {isChecked && agent.requiresLogin && (
                          <p className="font-dm-mono mt-2 rounded-sm bg-[#006BE5] px-3 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase">
                            Users must be logged in
                          </p>
                        )}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h3 className="font-greed-narrow mb-3 text-base font-bold tracking-wider text-gray-900 uppercase">
              Sandbox
            </h3>
            <p className="font-dm-mono mb-5 text-xs tracking-wider text-gray-500 uppercase">
              Please create a sandbox account and enter the login details for
              Agent 047
            </p>
            <div className="space-y-4">
              <FieldInput
                id="sandbox-dashboard-url"
                label="Dashboard URL"
                value={dashboardUrl}
                onChange={setDashboardUrl}
                placeholder="https://app.example.com/dashboard"
              />
              <FieldInput
                id="sandbox-login-url"
                label="Login URL"
                value={loginUrl}
                onChange={setLoginUrl}
                placeholder="https://app.example.com/login"
              />
              <FieldInput
                id="sandbox-username"
                label="Username"
                value={username}
                onChange={setUsername}
                placeholder="Username"
              />
              <FieldInput
                id="sandbox-password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sandboxMode}
                  onChange={(e) => setSandboxMode(e.target.checked)}
                  className="h-4 w-4 accent-[#006BE5]"
                />
                <span className="font-dm-mono text-xs text-gray-700">
                  Sandbox mode
                </span>
              </label>

              <button
                type="button"
                onClick={() => setAdvancedOpen((v) => !v)}
                className="font-dm-mono flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    advancedOpen ? "rotate-180" : ""
                  }`}
                />
                Advanced options
              </button>

              {advancedOpen && (
                <div className="space-y-4 border-l-2 border-gray-100 pl-3">
                  <ScheduleSelect value={schedule} onChange={setSchedule} />
                  <FieldInput
                    id="sandbox-max-pages"
                    label="Max pages"
                    type="number"
                    value={String(maxPages)}
                    onChange={(v) => setMaxPages(Number(v) || 0)}
                    placeholder="50"
                  />
                  <FieldInput
                    id="sandbox-pre-auth"
                    label="Pre-auth URL"
                    value={preAuthUrl}
                    onChange={setPreAuthUrl}
                    placeholder="https://app.example.com/auto-login?token=abc"
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleSave}
            disabled={updateConfig.isPending}
            className="font-dm-mono w-full cursor-pointer rounded-sm bg-[#006BE5] py-3 text-center text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#0055B8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateConfig.isPending ? "Saving…" : "Save & Close"}
          </button>
        </div>
      </aside>
    </div>
  );
}

const SCHEDULE_PRESETS: { label: string; value: string }[] = [
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every 12 hours", value: "0 */12 * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Daily at 2 AM", value: "0 2 * * *" },
  { label: "Daily at 9 AM", value: "0 9 * * *" },
  { label: "Weekly (Sunday midnight)", value: "0 0 * * 0" },
  { label: "Monthly (1st at midnight)", value: "0 0 1 * *" },
];

function ScheduleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isPreset = SCHEDULE_PRESETS.some((p) => p.value === value);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor="sandbox-schedule"
          className="font-dm-mono text-xs text-gray-700"
        >
          How often should we scan?
        </label>
        <InfoTooltip
          text="Choose how often Agent 047 should scan the sandbox account for updates."
          className="h-3.5 w-3.5"
        />
      </div>
      <select
        id="sandbox-schedule"
        value={isPreset ? value : "__custom"}
        onChange={(e) => {
          if (e.target.value !== "__custom") onChange(e.target.value);
        }}
        className="font-dm-mono w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#006BE5]"
      >
        {SCHEDULE_PRESETS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
        {!isPreset && <option value="__custom">Custom ({value})</option>}
      </select>
    </div>
  );
}

function FieldInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "number";
}) {
  const tooltipText = getSandboxFieldTooltip(label);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="font-dm-mono text-xs text-gray-700">
          {label}
        </label>
        <InfoTooltip text={tooltipText} className="h-3.5 w-3.5" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-dm-mono w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#006BE5]"
      />
    </div>
  );
}

function getSandboxFieldTooltip(label: string) {
  switch (label) {
    case "Dashboard URL":
      return "The logged-in page Agent 047 should inspect after signing into the sandbox account.";
    case "Login URL":
      return "The page where Agent 047 should enter the sandbox account credentials.";
    case "Username":
      return "The sandbox account username Agent 047 should use to sign in.";
    case "Password":
      return "The sandbox account password Agent 047 should use to sign in.";
    case "Max pages":
      return "The maximum number of pages Agent 047 should scan in one run.";
    case "Pre-auth URL":
      return "An optional URL that prepares the sandbox session before the scan starts.";
    default:
      return `More information about ${label.toLowerCase()}.`;
  }
}

function ToastNotification({
  kind,
  message,
  onDismiss,
}: {
  kind: "success" | "error";
  message: string;
  onDismiss: () => void;
}) {
  const isSuccess = kind === "success";
  return (
    <div
      role="status"
      className={`fixed top-6 right-6 z-[60] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      )}
      <p className="font-dm-mono flex-1 text-sm">{message}</p>
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className={`shrink-0 rounded-md p-0.5 transition-colors ${
          isSuccess
            ? "text-green-500 hover:bg-green-100"
            : "text-red-500 hover:bg-red-100"
        }`}
      >
        <span aria-hidden className="text-lg leading-none">
          ×
        </span>
      </button>
    </div>
  );
}
