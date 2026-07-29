import { useEffect, useState } from "react";

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
    <label className="font-dm-mono flex h-9.5 items-center gap-3 rounded-[13px] border border-black bg-white px-5 text-base leading-[1.2] font-medium tracking-[10%] text-black">
      <span className="flex min-w-0 flex-1 items-center">
        {prefix && <span className="shrink-0">{prefix}</span>}
        <input
          type="text"
          inputMode="numeric"
          value={formatted}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, "");
            setDigits(digitsOnly);
            onChange(digitsOnly === "" ? 0 : Number(digitsOnly));
          }}
          className="w-full min-w-0 bg-transparent outline-none"
        />
      </span>
      <span className="shrink-0 text-sm text-black/60 uppercase">{suffix}</span>
    </label>
  );
}
