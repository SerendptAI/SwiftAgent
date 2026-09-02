"use client";

import { useQueryClient } from "@tanstack/react-query";
import { differenceInDays, differenceInMonths } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useBillingDetails, useBillingPlans } from "@/hooks/use-billing";
import { isFreeTier } from "@/services/billing";

// How long to keep polling the backend for the webhook-driven activation
// before showing a "still processing" state.
const CONFIRM_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 3_000;

function formatDuration(startIso?: string, endIso?: string): string {
  if (!startIso || !endIso) return "—";
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";
  const months = differenceInMonths(end, start);
  if (months >= 1) return `${months} Month${months === 1 ? "" : "s"}`;
  const days = Math.max(differenceInDays(end, start), 0);
  return `${days} Day${days === 1 ? "" : "s"}`;
}

export default function BillingSuccessPage() {
  const companyId = useActiveCompanyId();
  const queryClient = useQueryClient();
  const { data: plans } = useBillingPlans();

  const [gaveUp, setGaveUp] = useState(false);

  // Read live billing details; poll until the subscription flips to active
  // (the Polar webhook can land a few seconds after the redirect back), then
  // stop. Give up after the grace period if it never confirms.
  const { data: details } = useBillingDetails(companyId, {
    refetchInterval: (query) => {
      if (gaveUp) return false;
      const d = query.state.data;
      const st = d?.subscription_status ?? d?.status;
      const active = !!d && !isFreeTier(d.tier) && st === "active";
      return active ? false : POLL_INTERVAL_MS;
    },
  });

  const status = details?.subscription_status ?? details?.status;
  const confirmed =
    !!details && !isFreeTier(details.tier) && status === "active";

  // Force a fresh read on arrival (the cached value may pre-date the payment),
  // and stop polling after a grace period if the webhook never confirms.
  useEffect(() => {
    if (companyId) {
      queryClient.invalidateQueries({
        queryKey: ["billingDetails", companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
    const timer = setTimeout(() => setGaveUp(true), CONFIRM_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [companyId, queryClient]);

  // Once confirmed, stop the give-up timer from mattering.
  const confirming = !confirmed && !gaveUp;

  const tierKey = details && !isFreeTier(details.tier) ? details.tier : null;
  const plan = tierKey && plans ? plans[tierKey] : undefined;
  const planName =
    details?.display_name || plan?.display_name || tierKey || "—";
  const amount = plan?.price_usd != null ? `$${plan.price_usd}` : "—";
  const duration = formatDuration(
    details?.subscription_started_at,
    details?.subscription_expires_at,
  );
  const heading = confirmed
    ? "Congratulations!"
    : confirming
      ? "Confirming your payment…"
      : "Payment received";
  const subcopy = confirmed
    ? "Your journey to AGI starts here"
    : confirming
      ? "Hang tight while we confirm your subscription."
      : "We're finalizing your subscription — this can take a moment.";
  const paymentStatus = confirmed
    ? "Successful"
    : confirming
      ? "Confirming…"
      : "Processing";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-black/5 bg-white px-[30px] pt-[33px] pb-10">
      <Link
        href="/dashboard/billing"
        className="inline-flex items-center gap-2 text-[#1F1F1F]"
      >
        <Icons.BackArrow className="h-6 w-6" />
        <span className="font-dm-mono text-[12px] tracking-wider text-black uppercase opacity-50">
          BACK
        </span>
      </Link>

      <div className="mt-4 flex w-full items-stretch overflow-hidden rounded-[22px] bg-[#7F9FFF] py-[47px] pr-[50px] pl-[79px]">
        <Image
          src="/images/billing/success-hero.png"
          alt=""
          width={326}
          height={257}
          className="block h-[257px] w-[326px] shrink-0 object-cover"
          priority
        />

        <div className="flex min-w-0 flex-1 flex-col items-start pt-[17px] pl-[53px]">
          <h1
            className="font-instrument text-[40px] leading-[0.95] font-bold tracking-[-0.02em] text-[#F6F4EF]"
            style={{ fontVariationSettings: "'wdth' 80" }}
          >
            {heading}
          </h1>
          <p className="font-stolzl mt-[23px] text-[16px] leading-normal text-white opacity-[0.77]">
            {subcopy}
          </p>

          <dl className="font-dm-mono mt-[22px] flex flex-col gap-[20px] text-[14px] leading-none text-black/[0.69]">
            <div>Duration: {duration}</div>
            <div>Amount: {amount}</div>
            <div>Plan: {planName}</div>
            <div>Payment status: {paymentStatus}</div>
          </dl>

          <div className="mt-[30px] flex h-[58px] w-[383px] max-w-full items-center justify-between rounded-[10px] bg-[#174BE6] pr-[10px] pl-[18px]">
            <span className="font-dm-mono text-[14px] tracking-[1.4px] text-[#F6F4EF] uppercase">
              DOWNLOAD RECIEPT
            </span>
            <button
              type="button"
              className="font-dm-mono flex h-[38px] w-[167px] shrink-0 cursor-pointer items-center justify-center rounded-[13px] bg-[#006BE5] text-[14px] tracking-[1.4px] text-white uppercase transition-colors hover:bg-[#0058C0]"
            >
              DOWNLOAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
