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
  // DM Mono is monospaced and the label adds 10% tracking, so the field can be
  // sized to exactly the characters it holds rather than to a fixed column.
  const chars = Math.max(formatted.length, 1);

  return (
    <label className="flex h-9.5 items-center gap-2 rounded-[13px] border border-black bg-white px-4 text-base leading-[1.2] font-medium tracking-[2%] text-black">
      {/*
        The number is the field's content and the suffix only labels its unit,
        so the number keeps its full width and the suffix is what gives way.
        With the two reversed a long translated suffix ("/agente humano" for
        "/human agents") squeezed the input until the amount itself was cut
        off mid-digit.
      */}
      <span className="flex shrink-0 items-center">
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
          style={{ width: `calc(${chars}ch + ${chars * 0.1}em)` }}
          className="bg-transparent outline-none"
        />
      </span>
      <span className="min-w-0 truncate text-sm text-black/60 capitalize">
        {suffix}
      </span>
    </label>
  );
}
