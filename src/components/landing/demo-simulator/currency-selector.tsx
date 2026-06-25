import { cn } from "@/lib/utils";

import { CURRENCIES, CurrencyCode } from "./utils";

export interface CurrencySelectorProps {
  currency: CurrencyCode;
  currencyOpen: boolean;
  onSelect: (code: CurrencyCode) => void;
  onToggle: () => void;
}

export function CurrencySelector({
  currency,
  currencyOpen,
  onSelect,
  onToggle,
}: CurrencySelectorProps) {
  return (
    <div className="mb-6 flex items-center justify-end gap-5">
      <span className="font-dm-mono xs:text-lg -mb-1 text-base leading-[1.59] font-medium tracking-[10%] text-black uppercase md:text-xl">
        CURRENCY
      </span>
      <div className="relative">
        <button
          onClick={onToggle}
          className="font-greed-narrow flex items-center gap-2.5 border border-black bg-[#F2B035] px-8 py-1 text-3xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase shadow-[-4px_4px_0px_0px_#000000] transition-shadow md:text-4xl"
        >
          {currency}
          <span>
            <svg
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.52637 13.5L19.0526 0H8.7738e-05L9.52637 13.5Z"
                fill="black"
              />
            </svg>
          </span>
        </button>

        {currencyOpen && (
          <div className="absolute top-[calc(100%+4px)] right-0 z-20 mt-1 w-full border border-black bg-white shadow-md">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => onSelect(c.code)}
                className={cn(
                  "font-dm-mono block w-full cursor-pointer px-5 py-2.5 text-left text-sm leading-[1.2] font-medium tracking-[10%] text-black uppercase md:text-base lg:text-lg xl:text-xl",
                  {
                    "hover:bg-black/10": c.code !== currency,
                    "bg-[#F2B035] text-black": c.code === currency,
                  },
                )}
              >
                {c.code}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
