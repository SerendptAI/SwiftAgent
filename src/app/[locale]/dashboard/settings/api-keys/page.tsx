"use client";

import { AlertTriangle, Check, Copy, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
} from "@/hooks/use-api-keys";

export default function ApiKeysPage() {
  const companyId = useActiveCompanyId();

  const { data: keys, isLoading } = useApiKeys(companyId);
  const createKey = useCreateApiKey(companyId);
  const revokeKey = useRevokeApiKey(companyId);

  const [label, setLabel] = useState("Widget Key");
  const [revealKey, setRevealKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!companyId) return;
    setError(null);
    try {
      const created = await createKey.mutateAsync(label.trim() || "Widget Key");
      setRevealKey(created.key);
      setLabel("Widget Key");
    } catch {
      setError("Could not generate a key. Please try again.");
    }
  };

  const handleCopy = () => {
    if (!revealKey) return;
    navigator.clipboard.writeText(revealKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (keyId: string) => {
    setError(null);
    setRevokingId(keyId);
    try {
      await revokeKey.mutateAsync(keyId);
    } catch {
      setError("Could not revoke that key. Please try again.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4">
      <HelpBanner bgColor="bg-[#00B37E]" />

      <div className="space-y-4">
        <div>
          <h3 className="font-stolzl text-base font-bold text-gray-900 sm:text-lg">
            Widget API Keys
          </h3>
          <p className="font-dm-mono mt-1 text-xs text-gray-500">
            Generate a key and paste it into your embed snippet&apos;s{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-700">
              data-api-key
            </code>{" "}
            attribute. The full key is shown only once.
          </p>
        </div>

        {/* One-time reveal of the freshly generated key */}
        {revealKey && (
          <div className="rounded-xl border border-[#00B37E]/30 bg-[#00B37E]/5 px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#00875c]" />
              <p className="font-dm-mono text-xs leading-relaxed text-[#00684a]">
                Copy this key now — you won&apos;t be able to see it again.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <code className="font-stolzl flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 text-xs break-all text-gray-800">
                {revealKey}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00B37E] text-white transition-colors hover:bg-[#00966a]"
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
              className="font-dm-mono mt-3 text-xs text-gray-500 underline hover:text-gray-700"
            >
              I&apos;ve saved it — dismiss
            </button>
          </div>
        )}

        {/* Generate a new key */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 px-4 py-4 sm:flex-row sm:items-end sm:px-6">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="api-key-label"
              className="font-dm-mono mb-1.5 block text-xs font-semibold tracking-[0.15em] text-gray-500 uppercase"
            >
              Key Label
            </label>
            <input
              id="api-key-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Widget Key"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#00B37E]"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={createKey.isPending || !companyId}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#00B37E] px-6 text-sm font-bold tracking-wide text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#00966a] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10"
          >
            {createKey.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {error && <p className="font-dm-mono text-xs text-red-600">{error}</p>}
      </div>

      {/* Existing keys */}
      <div className="space-y-4">
        <h3 className="font-stolzl text-base font-bold text-gray-900 sm:text-lg">
          Active Keys
        </h3>
        <div className="rounded-xl border border-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : !keys || keys.length === 0 ? (
            <p className="font-stolzl px-6 py-6 text-center text-sm text-gray-400">
              No keys yet. Generate one to authenticate your widget.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {keys.map((key) => (
                <li
                  key={key.id}
                  className={`flex items-center gap-3 px-4 py-3 sm:px-6 ${
                    key.active ? "" : "opacity-60"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-stolzl truncate text-sm font-semibold text-gray-900">
                      {key.label}
                    </p>
                    <p className="font-stolzl truncate text-xs text-gray-400">
                      {key.key_prefix}··· · created{" "}
                      {new Date(key.created_at).toLocaleDateString()}
                      {key.last_used_at
                        ? ` · last used ${new Date(key.last_used_at).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`font-dm-mono shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                      key.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {key.active ? "Active" : "Revoked"}
                  </span>
                  {key.active && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(key.id)}
                      disabled={revokingId === key.id}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label={`Revoke ${key.label}`}
                    >
                      {revokingId === key.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
