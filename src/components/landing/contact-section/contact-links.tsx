import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { NAV_LINKS } from "./constants";

const LINK_CLS =
  "font-jetbrains text-sm tracking-[2%] font-medium text-white transition-colors hover:text-gray-300";

export function ContactLinks() {
  const t = useTranslations("common.contact");

  return (
    <div className="absolute bottom-16 left-12 z-20 flex flex-col gap-5 max-md:bottom-52">
      {NAV_LINKS.map(({ id, href }) => (
        <Link key={id} href={href} className={LINK_CLS}>
          {t(`links.${id}`)}
        </Link>
      ))}
    </div>
  );
}
