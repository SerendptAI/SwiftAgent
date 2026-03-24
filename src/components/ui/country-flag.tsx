import { countryCodeToEmoji } from "@/lib/country";

export function CountryFlag({ code }: { code: string }) {
  if (!code || code.length !== 2) {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-gray-100 text-[10px] font-bold text-gray-400">
        --
      </div>
    );
  }
  return (
    <span className="shrink-0 text-2xl leading-none" title={code.toUpperCase()}>
      {countryCodeToEmoji(code)}
    </span>
  );
}
