import { defineRouting } from "next-intl/routing";

/**
 * A locale joins this list only once `messages/<locale>.json` is complete. The
 * middleware negotiates against it, so a half-translated entry sends every
 * browser preferring that language to a page rendering raw message keys —
 * which is exactly what the retired `pl` locale did.
 */
export const routing = defineRouting({
  locales: ["en"],

  defaultLocale: "en",
});
