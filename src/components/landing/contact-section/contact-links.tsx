import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { NAV_LINKS } from "./constants";

const LINK_CLS =
  "font-mono text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:text-gray-300";

/** Navigation links overlaid on the bottom-left of the contact image */
export function ContactLinks() {
  const t = useTranslations("common.contact");

  return (
    <div className="absolute bottom-16 left-12 z-20 flex flex-col gap-6 max-md:bottom-40">
      {NAV_LINKS.map(({ id, href }) => (
        <Link key={id} href={href} className={LINK_CLS}>
          {t(`links.${id}`)}
        </Link>
      ))}
    </div>
  );
}
