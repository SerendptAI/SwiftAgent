"use client";

import { ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip";

const SECTION_HEADING =
  "font-greed-narrow mb-3 text-[34px] leading-[0.95] font-medium tracking-[-0.68px] text-black uppercase";

const SECTION_DESCRIPTION =
  "font-dm-mono mb-6 text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase";

const FIELD_LABEL = "font-stolzl text-[16px] text-black";

const FIELD_INPUT =
  "font-dm-mono w-full rounded-[5px] bg-[#EDEDED] pl-[10px] pr-[37px] py-[10px] text-[14px] text-black outline-none placeholder:text-black/50";

// ── COLLAPSIBLE SECTION ──────────────────────────────────────────────────────

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <h3 className={SECTION_HEADING}>{title}</h3>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-black transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && children}
    </section>
  );
}

// ── PAYMENT SANDBOX ────────────────────────────────────────────────────────

export function PaymentSandboxSection() {
  const [link, setLink] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <CollapsibleSection title="Payment Sandbox">
      <p className={SECTION_DESCRIPTION}>
        Please set up a sandbox account for our agent and provide the login
        details for Agent 047. This will enable Agent have view-only access to
        payments, allowing them to respond to customer queries effectively.
      </p>

      <div className="space-y-[18px]">
        <SettingsField
          id="payment-link"
          label="Link"
          value={link}
          onChange={setLink}
          placeholder="Https://paystack.com/login"
        />
        <SettingsField
          id="payment-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="agent@email.com"
        />
        <SettingsField
          id="payment-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="*********"
        />
      </div>
    </CollapsibleSection>
  );
}

// ── API INTEGRATION ──────────────────────────────────────────────────────────
// One integration = one product API (shared base URL + key). Agents learn the
// callable endpoints from the documentation you provide.

export const API_INTEGRATION_NAME = "Product API";

export type DocumentationMode = "url" | "text";

export interface ApiIntegrationValue {
  integrationId: string | null;
  baseUrl: string;
  apiKey: string;
  authHeader: string;
  authPrefix: string;
  documentationMode: DocumentationMode;
  documentationUrl: string;
  documentation: string;
}

export const emptyApiIntegration = (): ApiIntegrationValue => ({
  integrationId: null,
  baseUrl: "",
  apiKey: "",
  authHeader: "Authorization",
  authPrefix: "Bearer",
  documentationMode: "url",
  documentationUrl: "",
  documentation: "",
});

interface ApiIntegrationSectionProps {
  value: ApiIntegrationValue;
  onChange: (next: ApiIntegrationValue) => void;
}

export function ApiIntegrationSection({
  value,
  onChange,
}: ApiIntegrationSectionProps) {
  const [authOpen, setAuthOpen] = useState(false);

  const update = (patch: Partial<ApiIntegrationValue>) =>
    onChange({ ...value, ...patch });

  return (
    <CollapsibleSection title="API Integration">
      <p className={SECTION_DESCRIPTION}>
        Connect your product API once and share its documentation so agents can
        call it to automate responses.
      </p>

      <div className="space-y-[18px]">
        <SettingsField
          id="integration-base-url"
          label="Base URL"
          value={value.baseUrl}
          onChange={(v) => update({ baseUrl: v })}
          placeholder="https://api.yourcompany.com"
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="integration-api-key" className={FIELD_LABEL}>
              API Key
            </label>
            {value.integrationId && (
              <span className="font-dm-mono rounded-full bg-[#006BE5]/10 px-2 py-0.5 text-[10px] tracking-wider text-[#006BE5] uppercase">
                Configured
              </span>
            )}
          </div>
          <input
            id="integration-api-key"
            type="password"
            value={value.apiKey}
            onChange={(e) => update({ apiKey: e.target.value })}
            placeholder={
              value.integrationId
                ? "Leave blank to keep current key"
                : "*********"
            }
            className={FIELD_INPUT}
          />
        </div>

        <button
          type="button"
          onClick={() => setAuthOpen((v) => !v)}
          className="font-dm-mono flex items-center gap-1 text-[12px] tracking-[1.4px] text-black/50 uppercase hover:text-black"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${
              authOpen ? "rotate-180" : ""
            }`}
          />
          Authentication
        </button>

        {authOpen && (
          <div className="space-y-[18px] border-l-2 border-black/10 pl-3">
            <SettingsField
              id="integration-auth-header"
              label="Auth header"
              value={value.authHeader}
              onChange={(v) => update({ authHeader: v })}
              placeholder="Authorization"
            />
            <SettingsField
              id="integration-auth-prefix"
              label="Auth prefix"
              value={value.authPrefix}
              onChange={(v) => update({ authPrefix: v })}
              placeholder="Bearer"
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        <h4 className="font-stolzl mb-1 text-[16px] text-black">
          Documentation
        </h4>
        <p className="font-dm-mono mb-4 text-[12px] leading-[1.8] tracking-[1.2px] text-black/50 uppercase">
          Help agents understand your API. Drop a link to your docs and
          we&apos;ll index them, or paste the documentation text directly.
        </p>

        <div className="mb-4 flex gap-2">
          <DocumentationModeButton
            active={value.documentationMode === "url"}
            onClick={() => update({ documentationMode: "url" })}
          >
            Provide a URL
          </DocumentationModeButton>
          <DocumentationModeButton
            active={value.documentationMode === "text"}
            onClick={() => update({ documentationMode: "text" })}
          >
            Paste text
          </DocumentationModeButton>
        </div>

        {value.documentationMode === "url" ? (
          <SettingsField
            id="integration-documentation-url"
            label="Documentation URL"
            value={value.documentationUrl}
            onChange={(v) => update({ documentationUrl: v })}
            placeholder="https://docs.yourcompany.com/api"
          />
        ) : (
          <div>
            <label
              htmlFor="integration-documentation-text"
              className={`${FIELD_LABEL} mb-2 block`}
            >
              Documentation text
            </label>
            <textarea
              id="integration-documentation-text"
              value={value.documentation}
              onChange={(e) => update({ documentation: e.target.value })}
              placeholder="Paste your API documentation here…"
              className="font-dm-mono h-[160px] w-full resize-none rounded-[5px] bg-[#EDEDED] px-[10px] py-[10px] text-[14px] text-black outline-none placeholder:text-black/50"
            />
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}

function DocumentationModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-dm-mono flex-1 rounded-[5px] px-3 py-2 text-[12px] tracking-[1px] uppercase transition-colors ${
        active
          ? "bg-[#006BE5] text-white"
          : "bg-[#EDEDED] text-black/60 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

export function RouteToHumanSection({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <CollapsibleSection title="Route to Human" defaultOpen>
      <p className={SECTION_DESCRIPTION}>
        Turn off the AI agent and send every widget chat straight to your human
        support team. Customers are asked for their email and a support ticket
        is opened automatically.
      </p>

      <div className="flex items-center justify-between gap-3">
        <span className="font-dm-mono text-[12px] tracking-[1.2px] text-black/60 uppercase">
          Route all chats to my support team
        </span>
        <ToggleSwitch
          checked={value}
          onChange={onChange}
          label="Route all chats to my support team"
        />
      </div>
    </CollapsibleSection>
  );
}

const SUGGESTION_MAX_LENGTH = 27;

interface SuggestedQuestionsSectionProps {
  value: string[];
  onChange: (next: string[]) => void;
  enabled: boolean;
  onEnabledChange: (next: boolean) => void;
}

export function SuggestedQuestionsSection({
  value,
  onChange,
  enabled,
  onEnabledChange,
}: SuggestedQuestionsSectionProps) {
  const suggestions = value.length > 0 ? value : ["", ""];

  const updateSuggestion = (index: number, next: string) => {
    const copy = [...suggestions];
    copy[index] = next.slice(0, SUGGESTION_MAX_LENGTH);
    onChange(copy);
  };

  const addSuggestion = () => onChange([...suggestions, ""]);

  const removeSuggestion = (index: number) => {
    onChange(suggestions.filter((_, i) => i !== index));
  };

  return (
    <CollapsibleSection title="Suggested Questions">
      <p className={SECTION_DESCRIPTION}>
        Here you can set the most frequently asked questions from your customers
        that the bot will recommend.
      </p>

      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="font-dm-mono text-[12px] tracking-[1.2px] text-black/60 uppercase">
          Show suggestions in the widget
        </span>
        <ToggleSwitch
          checked={enabled}
          onChange={onEnabledChange}
          label="Show suggestions in the widget"
        />
      </div>

      <div
        className={`space-y-[18px] transition-opacity ${
          enabled ? "" : "opacity-50"
        }`}
      >
        {suggestions.map((suggestion, index) => (
          <SuggestionField
            key={index}
            index={index + 1}
            value={suggestion}
            onChange={(v) => updateSuggestion(index, v)}
            onRemove={
              suggestions.length > 1 ? () => removeSuggestion(index) : undefined
            }
          />
        ))}

        <button
          type="button"
          onClick={addSuggestion}
          className="font-dm-mono relative flex w-full items-center justify-center gap-6 rounded-[5px] bg-[#F2B035] px-[10px] py-[10px] text-[14px] tracking-[1.4px] text-black/60 uppercase shadow-[inset_0px_-1px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#E0A030]"
        >
          <Plus className="h-5 w-5" />
          Add a new suggestion
        </button>
      </div>
    </CollapsibleSection>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[#006BE5]" : "bg-black/20"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function SuggestionField({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number;
  value: string;
  onChange: (v: string) => void;
  onRemove?: () => void;
}) {
  const id = `suggestion-${index}`;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className={FIELD_LABEL}>
          Suggestion {index}
        </label>
        <div className="flex items-center gap-2">
          <InfoTooltip
            text="A short suggested question the bot will recommend to customers."
            className="h-4 w-4"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove suggestion ${index}`}
              className="flex h-4 w-4 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          maxLength={SUGGESTION_MAX_LENGTH}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Whats the pricing like?"
          className="font-dm-mono h-[81px] w-full resize-none rounded-[5px] bg-[#EDEDED] px-[10px] pt-[10px] pb-[26px] text-[14px] text-black outline-none placeholder:text-black/50"
        />
        <span className="font-dm-mono pointer-events-none absolute right-[10px] bottom-[8px] text-[12px] text-black/50">
          {value.length}/{SUGGESTION_MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}

// ── Shared field ───────────────────────────────────────────────────────────

function SettingsField({
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
  tooltip?: string;
  type?: "text" | "password" | "email";
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className={FIELD_LABEL}>
          {label}
        </label>
        {tooltip && <InfoTooltip text={tooltip} className="h-4 w-4" />}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={FIELD_INPUT}
      />
    </div>
  );
}
