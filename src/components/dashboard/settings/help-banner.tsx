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
      className={`relative flex h-[150px] items-center justify-between overflow-hidden rounded-2xl px-8 py-6 ${bgColor}`}
    >
      <Image
        src="/images/box.svg"
        alt=""
        aria-hidden="true"
        width={160}
        height={160}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100"
      />
      <h2
        className={`font-greed-narrow font-condensed relative z-10 text-4xl leading-[95%] font-[650] tracking-[-2%] ${textColor}`}
      >
        Need help?
      </h2>
      <button className="relative z-10 flex items-center gap-2 rounded-md bg-[#2196F3] px-6 py-3 text-sm font-bold text-white shadow-[-3px_3px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5]">
        <Icons.CallAgent /> CALL AGENT
      </button>
    </div>
  );
}
