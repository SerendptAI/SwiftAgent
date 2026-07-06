import { Copy } from "lucide-react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        void navigator.clipboard?.writeText(value);
      }}
      className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-black/45 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <Copy className="h-4 w-4" />
    </button>
  );
}
