"use client";

import {
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
} from "@/hooks/use-api-keys";

/**
 * Generates and manages the company's widget API keys. The raw key is shown
 * exactly once on creation (the backend stores only a SHA-256 hash), so we
 * surface it in a dismissible reveal box and copy it straight into the embed
 * snippet via `onKeyGenerated`.
 */
export function WidgetApiKeySection({
  companyId,
  onKeyGenerated,
}: {
  companyId: string;
  onKeyGenerated?: (rawKey: string) => void;
}) {
  const { data: keys, isLoading } = useApiKeys(companyId || null);
  const createKey = useCreateApiKey(companyId || null);
  const revokeKey = useRevokeApiKey(companyId || null);

  const [label, setLabel] = useState("Widget Key");
  const [revealKey, setRevealKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!companyId) return;
    setError(null);
    try {
      const created = await createKey.mutateAsync(label.trim() || "Widget Key");
      setRevealKey(created.key);
      onKeyGenerated?.(created.key);
    } catch {
      setError("Could not generate a key. Please try again.");
    }
  };

  const handleCopyReveal = () => {
    if (!revealKey) return;
    navigator.clipboard.writeText(revealKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (keyId: string) => {
    setError(null);
    try {
      await revokeKey.mutateAsync(keyId);
    } catch {
      setError("Could not revoke that key. Please try again.");
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-[#006BE5]" />
        <h3 className="font-greed-narrow text-[24px] leading-none font-medium tracking-[-0.48px] text-black uppercase">
          Widget API Key
        </h3>
      </div>
      <p className="font-dm-mono mb-5 text-[12px] leading-relaxed tracking-wide text-black/60">
        Generate a key and paste it into the embed snippet&apos;s{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-700">
          data-api-key
        </code>{" "}
        attribute. The full key is shown only once.
      </p>

      {/* One-time reveal of the freshly generated key */}
      {revealKey && (
        <div className="mb-4 rounded-lg border border-[#006BE5]/30 bg-[#006BE5]/5 p-3">
          <div className="mb-2 flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#006BE5]" />
            <p className="font-dm-mono text-[11px] leading-relaxed text-[#004a9e]">
              Copy this key now — you won&apos;t be able to see it again.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="font-stolzl flex-1 overflow-x-auto rounded-md bg-white px-3 py-2 text-[12px] break-all text-gray-800">
              {revealKey}
            </code>
            <button
              type="button"
              onClick={handleCopyReveal}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#006BE5] text-white transition-colors hover:bg-[#0055B8]"
              aria-label="Copy API key"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setRevealKey(null)}
            className="font-dm-mono mt-2 text-[11px] text-gray-500 underline hover:text-gray-700"
          >
            I&apos;ve saved it — dismiss
          </button>
        </div>
      )}

      {/* Generate a new key */}
      <div className="mb-4 flex items-end gap-2">
        <div className="flex-1">
          <label
            htmlFor="api-key-label"
            className="font-dm-mono mb-1.5 block text-xs text-gray-700"
          >
            Key label
          </label>
          <input
            id="api-key-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Widget Key"
            className="font-dm-mono w-full rounded-sm border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#006BE5]"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={createKey.isPending || !companyId}
          className="font-dm-mono flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-md bg-[#006BE5] px-4 py-2 text-sm text-white transition-colors hover:bg-[#0055B8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {createKey.isPending ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && (
        <p className="font-dm-mono mb-3 text-[11px] text-red-600">{error}</p>
      )}

      {/* Existing keys */}
      <div className="space-y-2">
        {isLoading ? (
          <p className="font-dm-mono text-[12px] text-gray-400">
            Loading keys…
          </p>
        ) : keys && keys.length > 0 ? (
          keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="font-dm-mono truncate text-[12px] font-medium text-gray-800">
                  {key.label}
                </p>
                <p className="font-stolzl truncate text-[11px] text-gray-400">
                  {key.prefix}··· · created{" "}
                  {new Date(key.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRevoke(key.id)}
                disabled={revokeKey.isPending}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label={`Revoke ${key.label}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="font-dm-mono text-[12px] text-gray-400">
            No keys yet. Generate one to authenticate your widget.
          </p>
        )}
      </div>
    </section>
  );
}
