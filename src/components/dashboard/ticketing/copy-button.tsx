"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const COPIED_FEEDBACK_MS = 2000;

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(value);
    setCopied(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => setCopied(false),
      COPIED_FEEDBACK_MS,
    );
  };

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : label}
      onClick={handleCopy}
      className="inline-flex h-6 w-6 cursor-pointer items-center justify-center text-black/45 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      {copied ? (
        <Check className="h-4 w-4 text-[#00B37E]" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}
