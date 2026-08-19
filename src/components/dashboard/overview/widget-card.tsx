"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Copy,
  XCircle,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  emptyStrollForm,
  StrollConfigFields,
  strollFormFromConfig,
  strollFormToPayload,
  type StrollFormValue,
} from "@/components/dashboard/stroll-config-fields";
import { Icons } from "@/components/icons";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useHasActivePlan } from "@/hooks/use-billing";
import { useCompanyMutations, useCompanyQuery } from "@/hooks/use-company";
import {
  useCreateIntegration,
  useIntegrations,
  useUpdateIntegration,
} from "@/hooks/use-integrations";
import { useStrollConfig, useUpdateStrollConfig } from "@/hooks/use-stroll";
import { Link } from "@/i18n/navigation";
import type {
  IntegrationCreatePayload,
  IntegrationUpdatePayload,
} from "@/services/integrations";
import { useUpgradeModalStore } from "@/store/upgrade-modal-store";

import {
  API_INTEGRATION_NAME,
  ApiIntegrationSection,
  type ApiIntegrationValue,
  CollapsibleSection,
  emptyApiIntegration,
  PaymentSandboxSection,
  RouteToHumanSection,
  SuggestedQuestionsSection,
} from "./chatbot-settings-sections";

type WidgetMode = "widget" | "button";

export function WidgetCard() {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [mode, setMode] = useState<WidgetMode>("widget");
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const activeCompanyId = useActiveCompanyId();
  const hasActivePlan = useHasActivePlan(activeCompanyId);
  const locked = hasActivePlan === false;
  const showUpgrade = useUpgradeModalStore((s) => s.show);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  // Auto-open settings when arriving from onboarding (/dashboard?settings=1),
  // but only for users on an active plan — otherwise prompt them to upgrade.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (searchParams.get("settings") !== "1") return;
    // Wait until the plan status is known before deciding what to open.
    if (hasActivePlan === undefined) return;

    const next = new URLSearchParams(searchParams.toString());
    next.delete("settings");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });

    if (hasActivePlan) {
      setIsSettingsOpen(true);
    } else {
      showUpgrade();
    }
  }, [searchParams, pathname, router, hasActivePlan, showUpgrade]);

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
      return `<script src="https://widget.swiftagents.org/dist/widget-ui.js" data-company-id="${companyId}" data-api-key="YOUR_API_KEY" data-mode="button" data-trigger="[data-swift-agent-open]" defer></script>\n<button data-swift-agent-open>Chat with us</button>`;
    }
    return `<script src="https://widget.swiftagents.org/dist/widget-ui.js" data-company-id="${companyId}" data-api-key="YOUR_API_KEY" defer></script>`;
  }, [companyId, mode]);

  const handleCopy = useCallback(() => {
    if (!codeSnippet || locked) return;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setIsSettingsOpen(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeSnippet, locked]);

  return (
    <div className="rounded-xl">
      {isOpen ? (
        <div className="relative">
          <div className="relative">
            <div className="absolute top-0 right-0 left-0 z-10 flex h-[48px] items-center gap-2 pr-3 sm:gap-4 sm:pr-0">
              <div
                className="bg-muted h-full rounded-br-md pr-4"
                ref={modeDropdownRef}
              >
                <button
                  onClick={() => setModeDropdownOpen((v) => !v)}
                  className="font-dm-mono flex min-h-11 items-center gap-2 rounded-md bg-[#006BE5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E88E5] sm:px-5"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${modeDropdownOpen ? "rotate-180" : ""}`}
                  />
                  {mode === "button" ? "Button" : "Widget"}
                </button>

                {modeDropdownOpen && (
                  <div className="animate-in fade-in slide-in-from-top-1 absolute top-[48px] left-0 z-20 min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
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

              <div className="flex items-center sm:pr-6">
                <button
                  onClick={() => {
                    if (locked) {
                      showUpgrade();
                      return;
                    }
                    setIsSettingsOpen(true);
                  }}
                  className="font-greed-narrow flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-[#EDEDED] px-3 py-2 text-xs font-bold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-100 sm:px-4"
                >
                  <Icons.Settings className="h-5 w-5" />
                  <span className="hidden min-[360px]:inline">SETTINGS</span>
                </button>
              </div>
            </div>

            <div className="rounded-[20px] border border-gray-100 bg-white px-4 pt-16 pb-5 shadow-sm md:rounded-md md:px-5">
              <div className="relative">
                <pre
                  className={`font-stolzl max-h-48 overflow-auto rounded-lg bg-[#F6F6F6] p-3 text-[11px] leading-relaxed break-all whitespace-pre-wrap text-gray-700 sm:p-4 sm:text-[13px] ${
                    locked ? "pointer-events-none blur-sm select-none" : ""
                  }`}
                >
                  {codeSnippet || "No widget code found."}
                </pre>
                {locked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/50">
                    <p className="font-dm-mono max-w-[260px] text-center text-xs font-bold tracking-wider text-gray-700 uppercase">
                      Subscribe to a plan to unlock your widget code
                    </p>
                    <button
                      onClick={showUpgrade}
                      className="font-dm-mono rounded-md bg-[#006BE5] px-5 py-2 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#0055B8]"
                    >
                      Upgrade
                    </button>
                  </div>
                )}
              </div>
              <p className="font-dm-mono mt-2 text-[11px] text-gray-400">
                Replace{" "}
                <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-600">
                  YOUR_API_KEY
                </code>{" "}
                with a key from{" "}
                <Link
                  href="/dashboard/settings/api-keys"
                  className="text-[#006BE5] underline hover:text-[#0055B8]"
                >
                  Settings → API Keys
                </Link>
                .
              </p>
              {mode === "button" && (
                <p className="font-dm-mono mt-2 text-[11px] text-gray-400">
                  Add the{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-600">
                    data-swift-agent-open
                  </code>{" "}
                  attribute to any element to trigger the widget popup.
                </p>
              )}

              <button
                onClick={handleCopy}
                disabled={!codeSnippet || locked}
                className="font-dm-mono mt-6 flex min-h-11 w-full items-center justify-center gap-2.5 rounded-md bg-[#006BE5] py-2 text-base font-normal text-white shadow-[-4px_4px_0px_0px_#000000] transition-all hover:bg-[#1E88E5] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-[-2px_2px_0px_0px_#000000] disabled:cursor-not-allowed disabled:opacity-50"
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
          onSaved={(opts) =>
            setToast({
              kind: "success",
              message: opts?.indexing
                ? "Settings saved. Indexing documentation…"
                : "Settings saved.",
            })
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
      "Agent 047 can locate any dashboard feature for users, no matter the complexity. It knows each feature's location and can provide directions and screenshots.",
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
      "Agent 001 reviews bank records and updates customers on payments, including refunds and issues.",
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
  onSaved?: (opts?: { indexing?: boolean }) => void;
  onError?: (message: string) => void;
}) {
  const { data: config } = useStrollConfig(companyId || null);
  const updateConfig = useUpdateStrollConfig();
  const { data: company } = useCompanyQuery(companyId || null);
  const { updateCompany } = useCompanyMutations();
  const { data: integrations } = useIntegrations(companyId || null);
  const createIntegration = useCreateIntegration(companyId || null);
  const updateIntegration = useUpdateIntegration(companyId || null);

  const [selected, setSelected] = useState<Set<AgentId>>(
    () => new Set(["047", "007"]),
  );
  const [strollForm, setStrollForm] =
    useState<StrollFormValue>(emptyStrollForm);
  const [isShown, setIsShown] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [enableSuggestedPrompts, setEnableSuggestedPrompts] = useState(true);
  const [routeToHuman, setRouteToHuman] = useState(false);
  const [apiIntegration, setApiIntegration] = useState<ApiIntegrationValue>(
    () => emptyApiIntegration(),
  );

  useEffect(() => {
    if (!config) return;
    setStrollForm(strollFormFromConfig(config));
  }, [config]);

  useEffect(() => {
    if (!company) return;
    setSuggestedPrompts(company.suggested_ai_prompts ?? []);
    setEnableSuggestedPrompts(company.enable_suggested_prompts ?? true);
    setRouteToHuman(company.route_to_human ?? false);
  }, [company]);

  useEffect(() => {
    if (!integrations) return;
    // Only adopt the integration we own (named API_INTEGRATION_NAME); never
    // fall back to an arbitrary one, which could overwrite unrelated data.
    const existing = integrations.find((i) => i.name === API_INTEGRATION_NAME);
    if (!existing) return;

    const documentationUrl = existing.documentation_url ?? "";
    const documentation = existing.documentation ?? "";
    setApiIntegration({
      integrationId: existing.id,
      baseUrl: existing.base_url ?? "",
      apiKey: "",
      authHeader: existing.auth_header || "Authorization",
      authPrefix: existing.auth_prefix || "Bearer",
      documentationMode: documentationUrl
        ? "url"
        : documentation
          ? "text"
          : "url",
      documentationUrl,
      documentation,
    });
  }, [integrations]);

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
    const cleanedPrompts = suggestedPrompts
      .map((p) => p.trim())
      .filter(Boolean);

    const integrationMutations: Promise<unknown>[] = [];
    let documentationIndexing = false;
    {
      const baseUrl = apiIntegration.baseUrl.trim();
      const apiKey = apiIntegration.apiKey.trim();
      const authHeader = apiIntegration.authHeader.trim() || "Authorization";
      const authPrefix = apiIntegration.authPrefix.trim() || "Bearer";

      const isUrlMode = apiIntegration.documentationMode === "url";
      const documentationUrl = isUrlMode
        ? apiIntegration.documentationUrl.trim()
        : "";
      const documentationText = isUrlMode
        ? ""
        : apiIntegration.documentation.trim();

      const hasDocumentation = isUrlMode
        ? documentationUrl.length > 0
        : documentationText.length > 0;

      const hasInput =
        baseUrl.length > 0 || apiKey.length > 0 || hasDocumentation;

      if (apiIntegration.integrationId) {
        if (hasInput) {
          if (!baseUrl) {
            onError?.("Add a Base URL before saving the API integration.");
            return;
          }
          const payload: IntegrationUpdatePayload = {
            base_url: baseUrl,
            auth_header: authHeader,
            auth_prefix: authPrefix,
          };
          if (apiKey) payload.api_key = apiKey;
          if (isUrlMode) {
            if (documentationUrl) {
              payload.documentation_url = documentationUrl;
              documentationIndexing = true;
            }
          } else {
            payload.documentation = documentationText;
          }
          integrationMutations.push(
            updateIntegration.mutateAsync({
              integrationId: apiIntegration.integrationId,
              payload,
            }),
          );
        }
      } else if (hasInput) {
        if (!baseUrl) {
          onError?.(
            "The API integration needs a Base URL before it can be saved.",
          );
          return;
        }
        const createPayload: IntegrationCreatePayload = {
          name: API_INTEGRATION_NAME,
          base_url: baseUrl,
          auth_header: authHeader,
          auth_prefix: authPrefix,
          documentation: documentationText,
          documentation_url: documentationUrl,
        };
        if (apiKey) createPayload.api_key = apiKey;
        if (documentationUrl) documentationIndexing = true;
        integrationMutations.push(createIntegration.mutateAsync(createPayload));
      }
    }

    try {
      await Promise.all([
        updateConfig.mutateAsync({
          companyId,
          payload: strollFormToPayload(strollForm),
        }),
        updateCompany.mutateAsync({
          companyId,
          section: "info",
          payload: {
            suggested_ai_prompts: cleanedPrompts,
            enable_suggested_prompts: enableSuggestedPrompts,
            route_to_human: routeToHuman,
          },
        }),
        ...integrationMutations,
      ]);
    } catch (err) {
      console.error("Failed to save sandbox credentials:", err);
      onError?.(
        err instanceof Error
          ? err.message
          : "Could not save settings. Please try again.",
      );
      return;
    }
    onSaved?.({ indexing: documentationIndexing });
    closeWithAnimation();
  };

  const isSaving =
    updateConfig.isPending ||
    updateCompany.isPending ||
    createIntegration.isPending ||
    updateIntegration.isPending;

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
        <div className="flex-1 space-y-8 overflow-y-auto px-4 py-5 sm:space-y-10 sm:px-6 sm:py-6">
          <button
            type="button"
            onClick={closeWithAnimation}
            className="font-dm-mono flex items-center gap-1.5 text-xs tracking-wider text-black/50 uppercase hover:text-black"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <RouteToHumanSection
            value={routeToHuman}
            onChange={setRouteToHuman}
          />
          <CollapsibleSection title="Select Agents" defaultOpen>
            <p className="font-dm-mono mb-5 text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase">
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
          </CollapsibleSection>

          <CollapsibleSection title="Sandbox" defaultOpen>
            <p className="font-dm-mono mb-5 text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase">
              Please create a sandbox account and share the login details for
              Agent 047
            </p>
            <StrollConfigFields value={strollForm} onChange={setStrollForm} />
          </CollapsibleSection>

          <PaymentSandboxSection />
          <ApiIntegrationSection
            value={apiIntegration}
            onChange={setApiIntegration}
          />
          <SuggestedQuestionsSection
            value={suggestedPrompts}
            onChange={setSuggestedPrompts}
            enabled={enableSuggestedPrompts}
            onEnabledChange={setEnableSuggestedPrompts}
          />
        </div>

        <div className="border-t border-gray-100 px-4 py-4 sm:px-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="font-dm-mono w-full cursor-pointer rounded-[8px] bg-[#006BE5] py-3 text-center text-sm tracking-wider text-white uppercase shadow-[-3px_4px_0px_0px_#000000] transition-all hover:bg-[#0055B8] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-[-1px_2px_0px_0px_#000000] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save & Close"}
          </button>
        </div>
      </aside>
    </div>
  );
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
      className={`fixed top-4 right-4 left-4 z-[60] flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg sm:top-6 sm:right-6 sm:left-auto sm:max-w-sm ${
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
