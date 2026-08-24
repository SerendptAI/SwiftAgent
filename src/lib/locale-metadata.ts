import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

function localeUrl(locale: string, path: string) {
  return `${siteConfig.url}/${locale}${path}`;
}

/**
 * hreflang map for one path, plus the x-default search engines fall back to.
 * The sitemap builds its alternates from the same function so the two sets
 * cannot drift apart.
 */
export function localeLanguages(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, localeUrl(locale, path)]),
    ),
    "x-default": localeUrl(routing.defaultLocale, path),
  };
}

/**
 * Canonical + hreflang for a localized page. The canonical has to point at the
 * locale being rendered: pinning every locale to the default one tells search
 * engines the translations are duplicates of it, and they get dropped from the
 * index — which is how a hardcoded `/en` canonical silently wastes a
 * translation.
 */
export function localeAlternates(
  locale: string,
  path = "",
): Metadata["alternates"] {
  return {
    canonical: localeUrl(locale, path),
    languages: localeLanguages(path),
  };
}
