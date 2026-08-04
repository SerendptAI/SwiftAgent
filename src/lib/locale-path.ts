import { routing } from "@/i18n/routing";

const LOCALE_PREFIX_PATTERN = new RegExp(
  `^/(?:${routing.locales.join("|")})(?=/|$)`,
);

/** `/en/dashboard` → `/dashboard`, `/en` → `/`; unprefixed paths pass through. */
export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX_PATTERN, "") || "/";
}
