import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { COPYRIGHT_TEXT } from "./constants";

export function ContactCopyright() {
  const t = useTranslations("common.contact");

  return (
    <div className="font-jetbrains absolute bottom-34 left-0 z-20 flex w-full flex-col items-center gap-2 text-center md:bottom-12">
      <span className="text-[10px] font-semibold tracking-widest text-white uppercase sm:text-xs">
        {COPYRIGHT_TEXT}
      </span>

      <div className="flex gap-4 text-[9px] tracking-widest text-white/90 uppercase sm:text-[10px]">
        <Link
          href="/privacy-policy"
          className="font-semibold transition-colors hover:text-white"
        >
          {t("privacyPolicy")}
        </Link>
        <span className="font-bold text-white/50">|</span>
        <Link
          href="/"
          className="font-semibold transition-colors hover:text-white"
        >
          {t("termsOfService")}
        </Link>
      </div>
    </div>
  );
}
