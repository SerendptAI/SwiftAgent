import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { COPYRIGHT_TEXT } from "./constants";

export function ContactCopyright() {
  const t = useTranslations("common.contact");

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
          {t("privacyPolicy")}
        </Link>
        <span className="text-white/20">|</span>
        <Link href="/" className="transition-colors hover:text-white">
          {t("termsOfService")}
        </Link>
      </div>
    </div>
  );
}
