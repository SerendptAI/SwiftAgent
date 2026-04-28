"use client";

import { useEffect, useState } from "react";

/**
 * Resolves the visitor's ISO 3166-1 alpha-2 country code via ipapi.co.
 * Returns null while loading, empty string on failure (falls back to default pricing).
 */
export function useGeoCountry(): string | null {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://ipapi.co/country/", { signal: AbortSignal.timeout(3000) })
      .then((r) => r.text())
      .then((code) => {
        if (!cancelled) setCountry(code.trim().toUpperCase());
      })
      .catch(() => {
        if (!cancelled) setCountry("");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return country;
}
