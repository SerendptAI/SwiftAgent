import Image from "next/image";

import { Icons } from "@/components/icons";

interface HelpBannerProps {
  bgColor: string;
  textColor?: string;
}

export function HelpBanner({
  bgColor,
  textColor = "text-white",
}: HelpBannerProps) {
  return (
    <div
      className={`relative flex min-h-[132px] flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl px-4 py-5 sm:min-h-[150px] sm:flex-row sm:items-center sm:px-8 sm:py-6 ${bgColor}`}
    >
      <Image
        src="/images/box.svg"
        alt=""
        aria-hidden="true"
        width={160}
        height={160}
        className="pointer-events-none absolute top-1/2 left-1/2 w-32 -translate-x-1/2 -translate-y-1/2 opacity-100 sm:w-40"
      />
      <h2
        className={`font-greed font-condensed relative z-10 text-3xl leading-[95%] font-[650] tracking-[-2%] sm:text-4xl ${textColor}`}
      >
        Need help?
      </h2>
      <button
        type="button"
        data-swift-agent-help
        className="relative z-10 flex h-11 items-center gap-2 rounded-md bg-[#2196F3] px-4 text-xs font-bold text-white shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5] sm:px-6 sm:text-sm"
      >
        <Icons.CallAgent /> Call Agent
      </button>
    </div>
  );
}
