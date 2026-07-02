import { Link } from "@/i18n/navigation";

import { COPYRIGHT_TEXT } from "./constants";

/** Copyright footer centered at the bottom of the contact image */
export function ContactCopyright() {
  return (
    <div className="absolute bottom-30 left-0 z-20 flex w-full flex-col items-center gap-2 text-center md:bottom-12">
      <span className="font-mono text-[10px] tracking-widest text-white uppercase sm:text-xs">
        {COPYRIGHT_TEXT}
      </span>
      <div className="flex gap-4 font-mono text-[9px] tracking-widest text-white/50 uppercase sm:text-[10px]">
        <Link
          href="/privacy-policy"
          className="transition-colors hover:text-white"
        >
          Privacy Policy
        </Link>
        <span className="text-white/20">|</span>
        <Link href="/" className="transition-colors hover:text-white">
          Terms of Service
        </Link>
      </div>
    </div>
  );
}
