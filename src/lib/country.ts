/** Convert a 2-letter ISO country code to its emoji flag (e.g. "NG" → 🇳🇬). */
export function countryCodeToEmoji(code: string): string {
  const upper = code.toUpperCase();
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(
    upper.charCodeAt(0) + offset,
    upper.charCodeAt(1) + offset,
  );
}

/** Get the full country name from a 2-letter ISO code using Intl API. */
export function getCountryName(code: string): string {
  if (!code || code.length !== 2) return "Unknown";
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(
        code.toUpperCase(),
      ) || code.toUpperCase()
    );
  } catch {
    return code.toUpperCase();
  }
}
