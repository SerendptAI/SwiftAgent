/**
 * Sanity is optional at build time. A checkout with no project configured — a
 * fresh clone, CI, or a preview branch — still has to typecheck, build, and
 * serve the site, so every consumer treats a missing project id as "the blog
 * has no posts" rather than throwing.
 */
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Pinning the API date freezes query behaviour against future Sanity changes. */
export const SANITY_API_VERSION = "2026-01-01";

export function isSanityConfigured() {
  return !!SANITY_PROJECT_ID;
}
