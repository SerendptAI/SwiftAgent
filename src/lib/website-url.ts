/**
 * Fold a typed company website into something the backend scraper can fetch.
 * The shared FormInput uppercases as the user types and hosts are
 * case-insensitive, so the value is always lowercased before it leaves the
 * browser. A bare domain gets an https scheme.
 */
export function normalizeWebsiteUrl(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return "";
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** True when the value resolves to an http(s) URL with a dotted host. */
export function isValidWebsiteUrl(raw: string): boolean {
  const normalized = normalizeWebsiteUrl(raw);
  if (!normalized) return false;
  try {
    const { protocol, hostname } = new URL(normalized);
    return (
      (protocol === "http:" || protocol === "https:") &&
      hostname.includes(".") &&
      !hostname.startsWith(".") &&
      !hostname.endsWith(".")
    );
  } catch {
    return false;
  }
}
