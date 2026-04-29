import { hasFlag } from "country-flag-icons";
import * as Flags from "country-flag-icons/react/3x2";

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
