// ── IP Geolocation Service ──────────────────────────────────────────────────
//
// Resolves IP addresses to ISO 3166-1 alpha-2 country codes.
// Uses ip-api.com (free, no key, 45 req/min) with an in-memory cache
// so repeated lookups for the same IP don't hit the external API.

const cache = new Map<string, { code: string; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Batch-resolve country codes for multiple IPs.
 * ip-api.com supports batch requests (up to 100 IPs per call).
 */
export async function getCountriesByIps(
  ips: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const uncached: string[] = [];

  // Resolve from cache first
  for (const ip of ips) {
    const cached = cache.get(ip);
    if (cached && cached.expiresAt > Date.now()) {
      result.set(ip, cached.code);
    } else {
      uncached.push(ip);
    }
  }

  if (uncached.length === 0) return result;

  // ip-api.com batch endpoint (POST, up to 100 per request)
  const batches: string[][] = [];
  for (let i = 0; i < uncached.length; i += 100) {
    batches.push(uncached.slice(i, i + 100));
  }

  for (const batch of batches) {
    try {
      const res = await fetch(
        "http://ip-api.com/batch?fields=query,status,countryCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch.map((ip) => ({ query: ip }))),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (!res.ok) continue;

      const data: Array<{
        query: string;
        status: string;
        countryCode?: string;
      }> = await res.json();

      for (const entry of data) {
        const code =
          entry.status === "success" && entry.countryCode
            ? entry.countryCode
            : "";
        cache.set(entry.query, { code, expiresAt: Date.now() + CACHE_TTL_MS });
        result.set(entry.query, code);
      }
    } catch {
      // Silently fail — visitors will just have empty country codes
    }
  }

  return result;
}
