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
