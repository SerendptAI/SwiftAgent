import { cn } from "@/lib/utils";

export interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  width?: string;
}

export function NumberInput({
  value,
  onChange,
  suffix,
  width = "w-16",
}: NumberInputProps) {
  return (
    <div className="relative flex items-center">
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="font-dm-mono z-1 h-9.5 w-full shrink-0 [appearance:textfield] rounded-[13px] border border-black bg-white px-5 text-base leading-[1.2] font-medium tracking-[10%] text-black outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span
        className={cn(
          "font-dm-mono absolute right-5 z-2 my-auto shrink-0 text-sm leading-[1.2] tracking-[10%] text-black/60 uppercase",
          width,
        )}
      >
        {suffix}
      </span>
    </div>
  );
}
