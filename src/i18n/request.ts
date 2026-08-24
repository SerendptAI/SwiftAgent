import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

/**
 * Catalogues are split by namespace rather than kept in one file per locale:
 * with four locales planned, a single file becomes a few thousand entries that
 * every parallel branch and every translator edits at once.
 *
 * Each filename becomes its top-level namespace, so `nav.json` is read as
 * `useTranslations("nav")`. A namespace has to be listed here to be loaded —
 * the bundler needs a static list to resolve the imports — and a missing one
 * fails immediately and loudly on the first page that reads it.
 */
const NAMESPACES = ["nav", "home", "login", "consent"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const namespaces = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      const messages = await import(
        `../../messages/${locale}/${namespace}.json`
      );

      return [namespace, messages.default] as const;
    }),
  );

  return {
    locale,
    messages: Object.fromEntries(namespaces),
  };
});
