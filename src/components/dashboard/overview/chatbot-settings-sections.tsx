"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip";

const SECTION_HEADING =
  "font-greed-narrow mb-3 text-[34px] leading-[0.95] font-medium tracking-[-0.68px] text-black uppercase";

const SECTION_DESCRIPTION =
  "font-dm-mono mb-6 text-[14px] leading-[1.96] tracking-[1.4px] text-black/60 uppercase";

const FIELD_LABEL = "font-stolzl text-[16px] text-black";

const FIELD_INPUT =
  "font-dm-mono w-full rounded-[5px] bg-[#EDEDED] pl-[10px] pr-[37px] py-[10px] text-[14px] text-black outline-none placeholder:text-black/50";

// ── PAYMENT SANDBOX ────────────────────────────────────────────────────────

export function PaymentSandboxSection() {
  const [link, setLink] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section>
      <h3 className={SECTION_HEADING}>Payment Sandbox</h3>
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
    </section>
  );
}

// ── API KEYS ───────────────────────────────────────────────────────────────

export const API_KEY_FIELDS: { id: string; label: string; tooltip: string }[] =
  [
    {
      id: "api-user-account",
      label: "User / account data API",
      tooltip: "API endpoint that exposes user and account profile data.",
    },
    {
      id: "api-transaction-history",
      label: "Transaction history API",
      tooltip: "API endpoint that returns transaction history records.",
    },
    {
      id: "api-balance",
      label: "Current balance / wallet state API",
      tooltip: "API endpoint that returns the current balance / wallet state.",
    },
    {
      id: "api-orders",
      label: "Order / service records API",
      tooltip: "API endpoint that returns order or service records.",
    },
    {
      id: "api-event-logs",
      label: "In-app event logs  API",
      tooltip: "API endpoint that exposes in-app event logs.",
    },
  ];

export interface ApiKeyRowValue {
  integrationId: string | null;
  apiKey: string;
  baseUrl: string;
  endpointPath: string;
  endpointDescription: string;
}

export const emptyApiKeyRow = (): ApiKeyRowValue => ({
  integrationId: null,
  apiKey: "",
  baseUrl: "",
  endpointPath: "",
  endpointDescription: "",
});

interface ApiKeysSectionProps {
  value: Record<string, ApiKeyRowValue>;
  onChange: (presetId: string, next: ApiKeyRowValue) => void;
}

export function ApiKeysSection({ value, onChange }: ApiKeysSectionProps) {
  return (
    <section>
      <h3 className={SECTION_HEADING}>API Keys</h3>
      <p className={SECTION_DESCRIPTION}>
        To achieve complete automation of your product, please enter your API
        keys here. This will enable agents to fully automate various RESPONSES.
      </p>

      <div className="space-y-[18px]">
        {API_KEY_FIELDS.map((field) => {
          const row = value[field.id] ?? emptyApiKeyRow();
          return (
            <ApiKeyRow
              key={field.id}
              presetId={field.id}
              label={field.label}
              tooltip={field.tooltip}
              row={row}
              onChange={(next) => onChange(field.id, next)}
            />
          );
        })}
      </div>
    </section>
  );
}

function ApiKeyRow({
  presetId,
  label,
  tooltip,
  row,
  onChange,
}: {
  presetId: string;
  label: string;
  tooltip: string;
  row: ApiKeyRowValue;
  onChange: (next: ApiKeyRowValue) => void;
}) {
  const expanded = !!row.integrationId || row.apiKey.length > 0;
  const apiKeyId = `apikey-${presetId}`;
  const baseUrlId = `apikey-${presetId}-base`;
  const pathId = `apikey-${presetId}-path`;
  const descId = `apikey-${presetId}-desc`;

  const update = (patch: Partial<ApiKeyRowValue>) =>
    onChange({ ...row, ...patch });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={apiKeyId} className={FIELD_LABEL}>
          {label}
        </label>
        <div className="flex items-center gap-2">
          {row.integrationId && (
            <span className="font-dm-mono rounded-full bg-[#006BE5]/10 px-2 py-0.5 text-[10px] tracking-wider text-[#006BE5] uppercase">
              Configured
            </span>
          )}
          <InfoTooltip text={tooltip} className="h-4 w-4" />
        </div>
      </div>
      <input
        id={apiKeyId}
        type="password"
        value={row.apiKey}
        onChange={(e) => update({ apiKey: e.target.value })}
        placeholder={
          row.integrationId ? "Leave blank to keep current key" : "*********"
        }
        className={FIELD_INPUT}
      />
      {expanded && (
        <div className="space-y-2 rounded-[5px] border border-black/10 bg-black/[0.02] p-3">
          <div>
            <label htmlFor={baseUrlId} className={FIELD_LABEL}>
              Base URL
            </label>
            <input
              id={baseUrlId}
              type="text"
              value={row.baseUrl}
              onChange={(e) => update({ baseUrl: e.target.value })}
              placeholder="https://api.example.com"
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <label htmlFor={pathId} className={FIELD_LABEL}>
              Endpoint path
            </label>
            <input
              id={pathId}
              type="text"
              value={row.endpointPath}
              onChange={(e) => update({ endpointPath: e.target.value })}
              placeholder="/api/v1/orders/{order_id}"
              className={FIELD_INPUT}
            />
          </div>
          <div>
            <label htmlFor={descId} className={FIELD_LABEL}>
              Endpoint description
            </label>
            <input
              id={descId}
              type="text"
              value={row.endpointDescription}
              onChange={(e) => update({ endpointDescription: e.target.value })}
              placeholder={tooltip}
              className={FIELD_INPUT}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── SUGGESTED QUESTIONS ────────────────────────────────────────────────────

const SUGGESTION_MAX_LENGTH = 80;

interface SuggestedQuestionsSectionProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function SuggestedQuestionsSection({
  value,
  onChange,
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
    <section>
      <h3 className={SECTION_HEADING}>Suggested Questions</h3>
      <p className={SECTION_DESCRIPTION}>
        Here you can set the most frequently asked questions from your customers
        that the bot will recommend.
      </p>

      <div className="space-y-[18px]">
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
    </section>
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
