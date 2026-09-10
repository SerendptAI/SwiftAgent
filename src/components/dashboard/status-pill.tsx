import { cn } from "@/lib/utils";

export type PillTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASS: Record<PillTone, string> = {
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-[#006BE5]/10 text-[#0055B8]",
  neutral: "bg-gray-100 text-gray-500",
};

export function StatusPill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: PillTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-dm-mono inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
