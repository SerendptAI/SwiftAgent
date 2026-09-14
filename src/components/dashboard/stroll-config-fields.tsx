"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import type { StrollConfigPayload } from "@/services/stroll";

export const DEFAULT_STROLL_SCHEDULE = "0 2 * * *";
const DEFAULT_MAX_PAGES = 50;

export interface StrollFormValue {
  dashboardUrl: string;
  loginUrl: string;
  username: string;
  password: string;
  preAuthUrl: string;
  schedule: string;
  maxPages: number;
  sandboxMode: boolean;
}

export function emptyStrollForm(): StrollFormValue {
  return {
    dashboardUrl: "",
    loginUrl: "",
    username: "",
    password: "",
    preAuthUrl: "",
    schedule: DEFAULT_STROLL_SCHEDULE,
    maxPages: DEFAULT_MAX_PAGES,
    sandboxMode: true,
  };
}

export function strollFormFromConfig(
  config: StrollConfigPayload,
): StrollFormValue {
  return {
    dashboardUrl: config.dashboard_url || "",
    loginUrl: config.credentials?.login_url || "",
    username: config.credentials?.username || "",
    password: config.credentials?.password || "",
    preAuthUrl: config.credentials?.pre_auth_url || "",
    schedule: config.schedule || DEFAULT_STROLL_SCHEDULE,
    maxPages: config.max_pages ?? DEFAULT_MAX_PAGES,
    sandboxMode: config.sandbox_mode ?? true,
  };
}

/**
 * Whether the operator actually edited the stroll settings. The widget sidebar
 * saves several unrelated settings together, and writing the stroll config on
 * every save overwrote a working one with whatever the form happened to hold.
 */
export function strollFormChanged(
  a: StrollFormValue,
  b: StrollFormValue,
): boolean {
  return (Object.keys(a) as (keyof StrollFormValue)[]).some(
    (key) => a[key] !== b[key],
  );
}

export function strollFormToPayload(
  value: StrollFormValue,
): StrollConfigPayload {
  const credentials: StrollConfigPayload["credentials"] = {
    username: value.username.trim(),
    password: value.password,
  };
  const loginUrl = value.loginUrl.trim();
  const preAuthUrl = value.preAuthUrl.trim();
  if (loginUrl) credentials.login_url = loginUrl;
  if (preAuthUrl) credentials.pre_auth_url = preAuthUrl;

  return {
    dashboard_url: value.dashboardUrl.trim(),
    schedule: value.schedule.trim() || DEFAULT_STROLL_SCHEDULE,
    credentials,
    sandbox_mode: value.sandboxMode,
    max_pages: value.maxPages,
  };
}

/**
 * Credentials and crawl settings Agent 047 uses to stroll a customer dashboard.
 * Controlled so the caller owns persistence — the widget sidebar saves it
 * alongside other chatbot settings, the settings page saves it on its own.
 */
export function StrollConfigFields({
  value,
  onChange,
}: {
  value: StrollFormValue;
  onChange: (next: StrollFormValue) => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const update = (patch: Partial<StrollFormValue>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <FieldInput
        id="stroll-login-url"
        label="Login URL"
        value={value.loginUrl}
        onChange={(v) => update({ loginUrl: v })}
        placeholder="https://app.example.com/login"
        tooltip="The page where Agent 047 should enter the sandbox account credentials."
      />
      <FieldInput
        id="stroll-dashboard-url"
        label="Dashboard URL"
        value={value.dashboardUrl}
        onChange={(v) => update({ dashboardUrl: v })}
        placeholder="https://app.example.com/dashboard"
        tooltip="The logged-in page Agent 047 should inspect after signing into the sandbox account."
      />
      <FieldInput
        id="stroll-username"
        label="Email/Username"
        value={value.username}
        onChange={(v) => update({ username: v })}
        placeholder="Email/Username"
        tooltip="The sandbox account username Agent 047 should use to sign in."
      />
      <FieldInput
        id="stroll-password"
        label="Password"
        type="password"
        value={value.password}
        onChange={(v) => update({ password: v })}
        placeholder="••••••••"
        tooltip="The sandbox account password Agent 047 should use to sign in."
      />

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={value.sandboxMode}
          onChange={(e) => update({ sandboxMode: e.target.checked })}
          className="h-4 w-4 accent-[#006BE5]"
        />
        <span className="text-xs text-gray-700">Sandbox mode</span>
      </label>

      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        aria-expanded={advancedOpen}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
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
          <ScheduleSelect
            value={value.schedule}
            onChange={(v) => update({ schedule: v })}
          />
          <FieldInput
            id="stroll-max-pages"
            label="Max pages"
            type="number"
            value={String(value.maxPages)}
            onChange={(v) => update({ maxPages: Number(v) || 0 })}
            placeholder="50"
            tooltip="The maximum number of pages Agent 047 should scan in one run."
          />
          <FieldInput
            id="stroll-pre-auth"
            label="Pre-auth URL"
            value={value.preAuthUrl}
            onChange={(v) => update({ preAuthUrl: v })}
            placeholder="https://app.example.com/auto-login?token=abc"
            tooltip="An optional URL that prepares the sandbox session before the scan starts."
          />
        </div>
      )}
    </div>
  );
}

const SCHEDULE_PRESETS: { label: string; value: string }[] = [
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every 12 hours", value: "0 */12 * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Daily at 2 AM", value: DEFAULT_STROLL_SCHEDULE },
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
        <label htmlFor="stroll-schedule" className="text-xs text-gray-700">
          How often should we scan?
        </label>
        <InfoTooltip
          text="Choose how often Agent 047 should scan the sandbox account for updates."
          className="h-3.5 w-3.5"
        />
      </div>
      <select
        id="stroll-schedule"
        value={isPreset ? value : "__custom"}
        onChange={(e) => {
          if (e.target.value !== "__custom") onChange(e.target.value);
        }}
        className="w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#006BE5]"
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
  tooltip,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  tooltip: string;
  type?: "text" | "password" | "number";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-xs text-gray-700">
          {label}
        </label>
        <InfoTooltip text={tooltip} className="h-3.5 w-3.5" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#006BE5]"
      />
    </div>
  );
}
