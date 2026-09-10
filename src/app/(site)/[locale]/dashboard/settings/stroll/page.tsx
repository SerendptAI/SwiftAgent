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
import { useStrollConfig, useUpdateStrollConfig } from "@/hooks/use-stroll";
import { getApiErrorMessage } from "@/lib/api-error";

const CARD_CLASS =
  "flex min-h-[360px] flex-col gap-5 rounded-[20px] bg-white p-3 shadow-sm sm:min-h-[450px] sm:gap-6 sm:rounded-xl sm:p-4";

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

  const [form, setForm] = useState<StrollFormValue>(emptyStrollForm);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

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

  if (!companyId) {
    return (
      <div className={CARD_CLASS}>
        <HelpBanner bgColor="bg-[#006BE5]" />
        <p className="font-stolzl px-6 py-6 text-center text-sm text-gray-400">
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
        <h3 className="font-stolzl text-base font-bold text-gray-900 sm:text-lg">
          Stroll Configuration
        </h3>
        <p className="font-dm-mono mt-1 text-xs text-gray-500">
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
          <p className="font-stolzl text-sm text-gray-500">
            Could not load your stroll configuration.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-dm-mono rounded-lg border border-gray-200 px-4 py-2 text-xs tracking-wider text-gray-700 uppercase transition-colors hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {!config && (
            <p className="font-dm-mono rounded-xl bg-[#006BE5]/5 px-4 py-3 text-xs text-[#0055B8]">
              No configuration yet — fill this in to schedule your first stroll.
            </p>
          )}

          <div className="rounded-xl border border-gray-100 px-4 py-4 sm:px-6">
            <StrollConfigFields value={form} onChange={setForm} />
          </div>

          {status && (
            <p
              role="status"
              className={`font-dm-mono text-xs ${
                status.kind === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={updateConfig.isPending}
            className="flex h-11 items-center justify-center gap-2 self-start rounded-2xl bg-[#006BE5] px-6 text-sm font-bold tracking-wide text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#0055B8] disabled:cursor-not-allowed disabled:opacity-50 sm:h-10"
          >
            {updateConfig.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </>
      )}
    </div>
  );
}
