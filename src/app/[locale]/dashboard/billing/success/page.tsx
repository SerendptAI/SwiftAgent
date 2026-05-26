"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="flex w-full max-w-[520px] flex-col items-center gap-6 rounded-3xl bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="h-14 w-14 text-[#006BE5]" />

        <h1 className="font-greed-narrow text-[34px] leading-[1.05] font-medium tracking-[-0.68px] text-black uppercase">
          Thank you for subscribing!
        </h1>

        <p className="font-dm-mono max-w-[420px] text-[14px] leading-[1.6] tracking-[1.2px] text-black/60 uppercase">
          Your subscription is being activated. You can start using your new
          plan right away — no further action needed.
        </p>

        <Link
          href="/dashboard"
          className="font-dm-mono mt-2 inline-flex h-11 items-center justify-center rounded-[8px] bg-[#006BE5] px-8 text-[14px] tracking-[1.4px] text-white uppercase shadow-[-3px_4px_0px_0px_#000000] transition-all hover:bg-[#0055B8] active:-translate-x-0.5 active:translate-y-0.5 active:shadow-[-1px_2px_0px_0px_#000000]"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
