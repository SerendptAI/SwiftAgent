import Link from "next/link";

import { NAV_LINKS } from "./constants";

const LINK_CLS =
  "font-mono text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:text-gray-300";

/** Navigation links overlaid on the bottom-left of the contact image */
export function ContactLinks() {
  return (
    <div className="absolute bottom-16 left-12 z-20 flex flex-col gap-6 max-md:bottom-40">
      {NAV_LINKS.map(({ label, href }) => (
        <Link key={label} href={href} className={LINK_CLS}>
          {label}
        </Link>
      ))}
    </div>
  );
}
