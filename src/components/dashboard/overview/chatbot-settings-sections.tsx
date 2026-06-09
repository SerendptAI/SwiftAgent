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

// ── API INTEGRATION ──────────────────────────────────────────────────────────
// One integration = one product API (shared base URL + key) exposing many
// endpoints, mirroring the backend IntegrationCreate schema.

export const API_INTEGRATION_NAME = "Product API";

// Optional starting points — the agent reasons over each endpoint's
// description, so these are just convenience prefills, not required slots.
export const ENDPOINT_SUGGESTIONS: {
  label: string;
  description: string;
  placeholder: string;
}[] = [
  {
    label: "User / account data",
    description: "Endpoint that exposes user and account profile data.",
    placeholder: "/v1/users/{user_id}",
  },
  {
    label: "Transaction history",
    description: "Endpoint that returns transaction history records.",
    placeholder: "/v1/transactions",
  },
  {
    label: "Current balance / wallet state",
    description: "Endpoint that returns the current balance / wallet state.",
    placeholder: "/v1/wallet/balance",
  },
  {
    label: "Order / service records",
    description: "Endpoint that returns order or service records.",
    placeholder: "/v1/orders",
  },
  {
    label: "In-app event logs",
    description: "Endpoint that exposes in-app event logs.",
    placeholder: "/v1/events",
  },
];

export interface IntegrationEndpointRow {
  id: string;
  label: string;
  path: string;
  description: string;
  placeholder?: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface ApiIntegrationValue {
  integrationId: string | null;
  baseUrl: string;
  apiKey: string;
  authHeader: string;
  authPrefix: string;
  endpoints: IntegrationEndpointRow[];
}

export const emptyApiIntegration = (): ApiIntegrationValue => ({
  integrationId: null,
  baseUrl: "",
  apiKey: "",
  authHeader: "Authorization",
  authPrefix: "Bearer",
  endpoints: [],
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

  const updateEndpoint = (
    index: number,
    patch: Partial<IntegrationEndpointRow>,
  ) =>
    update({
      endpoints: value.endpoints.map((e, i) =>
        i === index ? { ...e, ...patch } : e,
      ),
    });

  const addEndpoint = (suggestion?: (typeof ENDPOINT_SUGGESTIONS)[number]) =>
    update({
      endpoints: [
        ...value.endpoints,
        {
          id: crypto.randomUUID(),
          label: suggestion?.label ?? "",
          path: "",
          description: suggestion?.description ?? "",
          placeholder: suggestion?.placeholder,
        },
      ],
    });

  const removeEndpoint = (index: number) =>
    update({ endpoints: value.endpoints.filter((_, i) => i !== index) });

  const availableSuggestions = ENDPOINT_SUGGESTIONS.filter(
    (s) => !value.endpoints.some((e) => e.label === s.label),
  );

  return (
    <section>
      <h3 className={SECTION_HEADING}>API Integration</h3>
      <p className={SECTION_DESCRIPTION}>
        Connect your product API once, then map the endpoints agents can call to
        automate responses.
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
        <h4 className="font-stolzl mb-1 text-[16px] text-black">Endpoints</h4>
        <p className="font-dm-mono mb-4 text-[12px] leading-[1.8] tracking-[1.2px] text-black/50 uppercase">
          Add the API endpoints agents can call to fetch data. Pick a suggestion
          or add your own.
        </p>

        <div className="space-y-3">
          {value.endpoints.map((endpoint, index) => (
            <EndpointRow
              key={endpoint.id}
              endpoint={endpoint}
              index={index}
              onChange={(patch) => updateEndpoint(index, patch)}
              onRemove={() => removeEndpoint(index)}
            />
          ))}

          {availableSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {availableSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => addEndpoint(suggestion)}
                  className="font-dm-mono flex items-center gap-1 rounded-full border border-black/15 px-3 py-1 text-[11px] tracking-[1px] text-black/60 uppercase transition-colors hover:border-black/40 hover:text-black"
                >
                  <Plus className="h-3 w-3" />
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => addEndpoint()}
            className="font-dm-mono relative flex w-full items-center justify-center gap-6 rounded-[5px] bg-[#F2B035] px-[10px] py-[10px] text-[14px] tracking-[1.4px] text-black/60 uppercase shadow-[inset_0px_-1px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#E0A030]"
          >
            <Plus className="h-5 w-5" />
            Add custom endpoint
          </button>
        </div>
      </div>
    </section>
  );
}

function EndpointRow({
  endpoint,
  index,
  onChange,
  onRemove,
}: {
  endpoint: IntegrationEndpointRow;
  index: number;
  onChange: (patch: Partial<IntegrationEndpointRow>) => void;
  onRemove: () => void;
}) {
  const nameId = `endpoint-${index}-name`;
  const pathId = `endpoint-${index}-path`;
  const descId = `endpoint-${index}-desc`;

  return (
    <div className="space-y-2 rounded-[5px] border border-black/10 bg-black/[0.02] p-3">
      <div className="flex items-center justify-between gap-2">
        <input
          id={nameId}
          value={endpoint.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Endpoint name"
          className="font-stolzl flex-1 bg-transparent text-[16px] text-black outline-none placeholder:text-black/40"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove endpoint"
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <input
        id={pathId}
        type="text"
        value={endpoint.path}
        onChange={(e) => onChange({ path: e.target.value })}
        placeholder={endpoint.placeholder ?? "/v1/resource"}
        className={FIELD_INPUT}
      />
      <input
        id={descId}
        type="text"
        value={endpoint.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="What this endpoint returns"
        className={FIELD_INPUT}
      />
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
