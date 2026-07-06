import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  prefix?: string;
}

export function NumberInput({
  value,
  onChange,
  suffix,
  prefix,
}: NumberInputProps) {
  const [digits, setDigits] = useState(String(value));

  useEffect(() => {
    if (Number(digits || 0) !== value) setDigits(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = digits === "" ? "" : Number(digits).toLocaleString("en-US");

  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="font-dm-mono absolute left-5 z-2 my-auto shrink-0 text-base leading-[1.2] font-medium tracking-[10%] text-black">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={formatted}
        onChange={(e) => {
          const digitsOnly = e.target.value.replace(/\D/g, "");
          setDigits(digitsOnly);
          onChange(digitsOnly === "" ? 0 : Number(digitsOnly));
        }}
        className={cn(
          "font-dm-mono z-1 h-9.5 w-full min-w-0 shrink-0 rounded-[13px] border border-black bg-white px-5 text-base leading-[1.2] font-medium tracking-[10%] text-black outline-none",
          prefix && "pl-8",
        )}
        style={{ paddingRight: `${suffix.length * 0.55 + 1.25}rem` }}
      />
      <span className="font-dm-mono absolute right-5 z-2 my-auto shrink-0 text-sm leading-[1.2] tracking-[10%] text-black/60 uppercase">
        {suffix}
      </span>
    </div>
  );
}
