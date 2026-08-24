import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

/**
 * Catalogues are split by namespace rather than kept in one file per locale:
 * with four locales, a single file becomes a few thousand entries that every
 * parallel branch and every translator edits at once.
 *
 * Each filename becomes its top-level namespace, so `nav.json` is read as
 * `useTranslations("nav")`. A namespace has to be listed here to be loaded —
 * the bundler needs a static list to resolve the imports.
 */
const NAMESPACES = ["nav", "home", "pricing", "login", "consent"] as const;

type Messages = Record<string, unknown>;

function isPlainObject(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** `override` wins wherever it has a value; `base` fills every remaining key. */
function deepMerge(base: Messages, override: Messages): Messages {
  const merged: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = merged[key];

    merged[key] =
      isPlainObject(existing) && isPlainObject(value)
        ? deepMerge(existing, value)
        : value;
  }

  return merged;
}

async function loadMessages(locale: string): Promise<Messages> {
  const namespaces = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      try {
        const messages = await import(
          `../../messages/${locale}/${namespace}.json`
        );

        return [namespace, messages.default] as const;
      } catch {
        // A namespace a locale has not been given yet. The English merge below
        // supplies its copy, so the page renders rather than failing.
        return [namespace, {}] as const;
      }
    }),
  );

  return Object.fromEntries(namespaces);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = await loadMessages(locale);

  return {
    locale,
    // English sits underneath every other locale so an untranslated key renders
    // the English copy instead of a raw key path like `home.hero.subtitle`. A
    // locale can therefore ship before its catalogue is complete, degrading to
    // a mixed-language page rather than a visibly broken one. A key missing
    // from English too is a real bug and still errors.
    messages:
      locale === routing.defaultLocale
        ? messages
        : deepMerge(await loadMessages(routing.defaultLocale), messages),
  };
});
