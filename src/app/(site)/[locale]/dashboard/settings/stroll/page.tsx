"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { FreePlanBanner } from "@/components/dashboard/free-plan-banner";
import { HelpBanner } from "@/components/dashboard/settings/help-banner";
import {
  emptyStrollForm,
  StrollConfigFields,
  strollFormFromConfig,
  strollFormToPayload,
  type StrollFormValue,
} from "@/components/dashboard/stroll-config-fields";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import {
  useRunStroll,
  useStrollConfig,
  useUpdateStrollConfig,
} from "@/hooks/use-stroll";
import { getApiErrorMessage } from "@/lib/api-error";

const CARD_CLASS =
  "flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4";

const STROLL_NOW_COOLDOWN_MS = 30_000;

export default function StrollSettingsPage() {
  const companyId = useActiveCompanyId();
  const {
    data: config,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useStrollConfig(companyId);
  const updateConfig = useUpdateStrollConfig();
  const runStroll = useRunStroll();

  const [form, setForm] = useState<StrollFormValue>(emptyStrollForm);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  // The cooldown is wall-clock based rather than a plain countdown so it
  // keeps ticking correctly even if the tab was backgrounded and timers were
  // throttled.
  useEffect(() => {
    if (!cooldownUntil) return;

    const tick = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((cooldownUntil - Date.now()) / 1000),
      );
      setCooldownSecondsLeft(secondsLeft);
      if (secondsLeft === 0) setCooldownUntil(null);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  // The active company comes from a store rather than the route, so switching
  // company re-runs this query without remounting the page. `config` is null
  // for a company that has no stroll config yet and undefined while the next
  // one loads, and both have to clear the form — leaving the previous
  // company's dashboard URL and credentials on screen means the next save
  // writes them onto the wrong company.
  useEffect(() => {
    setForm(
      isSuccess && config ? strollFormFromConfig(config) : emptyStrollForm(),
    );
  }, [config, isSuccess]);

  const handleSave = async () => {
    if (!companyId) return;
    if (!form.dashboardUrl.trim()) {
      setStatus({
        kind: "error",
        message: "Add a Dashboard URL — that's the page Agent 047 strolls.",
      });
      return;
    }
    setStatus(null);
    try {
      await updateConfig.mutateAsync({
        companyId,
        payload: strollFormToPayload(form),
      });
      setStatus({ kind: "success", message: "Stroll configuration saved." });
    } catch (err) {
      // The API explains a refusal in `detail` — a plan that doesn't cover
      // strolls answers 402 with the reason. Reading `err.message` instead put
      // "Request failed with status code 402" on screen and threw that away.
      setStatus({
        kind: "error",
        message: getApiErrorMessage(
          err,
          "Could not save the configuration. Please try again.",
        ),
      });
    }
  };

  const handleStrollNow = async () => {
    if (!companyId) return;
    setStatus(null);
    try {
      await runStroll.mutateAsync(companyId);
      setStatus({ kind: "success", message: "Stroll started." });
    } catch (err) {
      setStatus({
        kind: "error",
        message: getApiErrorMessage(
          err,
          "Could not start the stroll. Please try again.",
        ),
      });
    } finally {
      setCooldownUntil(Date.now() + STROLL_NOW_COOLDOWN_MS);
    }
  };

  if (!companyId) {
    return (
      <div className={CARD_CLASS}>
        <HelpBanner bgColor="bg-[#006BE5]" />
        <p className="px-6 py-6 text-center text-sm text-gray-400">
          Select a company to configure its strolls.
        </p>
      </div>
    );
  }

  return (
    <div className={CARD_CLASS}>
      <HelpBanner bgColor="bg-[#006BE5]" />

      <FreePlanBanner feature="more strolls" />

      <div>
        <h3 className="text-base font-bold text-gray-900 sm:text-lg">
          Stroll Configuration
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Agent 047 signs into a sandbox account on your dashboard and strolls
          it on a schedule, so it can point customers at the exact feature they
          ask for. Use a sandbox account — never a real customer login.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8">
          <p className="text-sm text-gray-500">
            Could not load your stroll configuration.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs tracking-[2%] text-gray-700 transition-colors hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {!config && (
            <p className="rounded-xl bg-[#006BE5]/5 px-4 py-3 text-xs text-[#0055B8]">
              No configuration yet — fill this in to schedule your first stroll.
            </p>
          )}

          <div className="rounded-xl border border-gray-100 px-4 py-4 sm:px-6">
            <StrollConfigFields value={form} onChange={setForm} />
          </div>

          {status && (
            <p
              role="status"
              className={`text-xs ${
                status.kind === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateConfig.isPending}
              className="flex h-11 items-center justify-center gap-2 self-start rounded-2xl bg-[#006BE5] px-6 text-sm font-bold tracking-[2%] text-white shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#0055B8] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10"
            >
              {updateConfig.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </button>

            <button
              type="button"
              onClick={handleStrollNow}
              disabled={runStroll.isPending || cooldownUntil !== null}
              className="flex h-11 items-center justify-center gap-2 self-start rounded-2xl border border-gray-200 bg-white px-6 text-sm font-bold tracking-[2%] text-gray-900 shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10"
            >
              {runStroll.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : cooldownUntil ? (
                `Stroll Now (${cooldownSecondsLeft}s)`
              ) : (
                "Stroll Now"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
