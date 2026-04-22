"use client";

import { ChevronDown, Copy, Info, Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useCurrentUser } from "@/hooks/use-auth";
import { useStrollConfig, useUpdateStrollConfig } from "@/hooks/use-stroll";
import type { StrollConfigPayload } from "@/services/stroll";

export function WidgetCard() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSticky, setIsSticky] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const companyId = user?.company_id || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const codeSnippet = useMemo(() => {
    if (!companyId) return "";
    return `<script src="${origin}/widget-ui.js" data-company-id="${companyId}" defer></script>`;
  }, [companyId, origin]);

  const handleCopy = useCallback(() => {
    if (!codeSnippet) return;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeSnippet]);

  return (
    <div className="overflow-hidden rounded-xl">
      {isOpen ? (
        <div className="relative">
          <div className="relative">
            {/* Top bar with notch cutout */}
            <div className="absolute top-0 right-0 left-0 z-1 flex h-[48px] items-center gap-4">
              <div className="bg-muted h-full rounded-br-md pr-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-dm-mono flex items-center gap-2 rounded-md bg-[#006BE5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5]"
                >
                  <ChevronDown className="h-4 w-4" />
                  Widget
                </button>
              </div>

              <div className="flex items-center pr-6">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="font-greed-narrow flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-100"
                >
                  <Settings className="h-3.5 w-3.5" />
                  SETTINGS
                </button>
              </div>
            </div>

            <div className="rounded-md border border-gray-100 bg-white px-5 pt-16 pb-5 shadow-sm">
              {/* Sticky toggle */}
              <div className="mb-4 flex items-center gap-2">
                <figure className="flex w-fit items-center gap-2 rounded-md bg-[#EDEDED] p-1">
                  <button
                    onClick={() => setIsSticky(!isSticky)}
                    className={`font-dm-mono rounded-md px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors ${
                      isSticky
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isSticky ? "ON" : "OFF"}
                  </button>
                  <span className="font-dm-mono text-sm font-normal text-gray-400">
                    sticky?
                  </span>
                </figure>
                <InfoTooltip text="Toggle to enable/disable the widget on your website." />
              </div>

              {/* Code snippet */}
              <pre className="font-stolzl rounded-lg p-4 text-[13px] leading-relaxed break-all whitespace-pre-wrap text-gray-700">
                {codeSnippet || "No widget code found."}
              </pre>

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
        />
      )}
    </div>
  );
}

// ── Chatbot settings sidebar ─────────────────────────────────────────────────

type AgentId = "047" | "007" | "029" | "005" | "001";

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
    id: "029",
    description:
      "Agent 029 can handle cryptocurrency transactions and crypto-swaps on potential wallets.",
  },
  {
    id: "005",
    description:
      "Agent 005 provides bank reviews and updates customers on payments, including refunds and losses.",
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
}: {
  companyId: string;
  onClose: () => void;
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
      return;
    }
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
        <Info className="h-3.5 w-3.5 text-gray-400" />
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
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="font-dm-mono text-xs text-gray-700">
          {label}
        </label>
        <Info className="h-3.5 w-3.5 text-gray-400" />
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
