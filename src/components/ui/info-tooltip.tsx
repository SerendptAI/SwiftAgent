"use client";

import { Info } from "lucide-react";
import { useState } from "react";

export function InfoTooltip({
  text,
  className = "h-4 w-4",
}: {
  text: string;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        className="text-gray-400 transition-colors hover:text-gray-600"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((p) => !p)}
      >
        <Info className={className} />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs leading-relaxed whitespace-nowrap text-white shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
