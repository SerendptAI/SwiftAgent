import { defineRouting } from "next-intl/routing";

/**
 * A locale may join this list before its catalogue is finished: request.ts
 * merges English underneath every other locale, so an untranslated key renders
 * English copy rather than a raw key path. That is what the retired `pl` locale
 * lacked — it was negotiated against here while half its namespaces were
 * missing, so every browser preferring Polish was sent to a broken page.
 *
 * Adding a locale is therefore one line here plus a messages/<locale>/
 * directory, but the pages it exposes are only as translated as that
 * directory is.
 */
export const routing = defineRouting({
  locales: ["en", "fr", "es", "sw"],

  defaultLocale: "en",
});
