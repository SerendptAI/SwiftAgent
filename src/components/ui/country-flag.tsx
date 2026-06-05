import { hasFlag } from "country-flag-icons";
import * as Flags from "country-flag-icons/react/3x2";
import * as FlagStrings from "country-flag-icons/string/3x2";

/**
 * Resolve a 2-letter country code to an inline SVG data URI, suitable for use
 * as an `<image>`/`<img>` source (e.g. inside an SVG chart label where the
 * `CountryFlag` component can't be rendered). Returns null for unknown codes.
 */
export function countryFlagDataUrl(code: string): string | null {
  const upper = code?.toUpperCase();
  if (!upper || upper.length !== 2 || !hasFlag(upper)) return null;
  const svg = (FlagStrings as Record<string, string>)[upper];
  if (!svg) return null;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function CountryFlag({ code }: { code: string }) {
  const upper = code?.toUpperCase();

  if (!upper || upper.length !== 2 || !hasFlag(upper)) {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-gray-100 text-[10px] font-bold text-gray-400">
        --
      </div>
    );
  }

  const Flag = (
    Flags as Record<
      string,
      React.ComponentType<{ title?: string; className?: string }>
    >
  )[upper];

  return (
    <Flag title={upper} className="h-5 w-7 shrink-0 rounded-sm object-cover" />
  );
}
