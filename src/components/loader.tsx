"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const COLORS = ["#000000", "#F97316", "#A855F7", "#EAB308"] as const;

export const Loader = () => {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div
        className="flex h-28 w-28 items-center justify-center transition-none"
        style={{ backgroundColor: COLORS[colorIndex] }}
      >
        <div className="relative h-20 w-20">
          <Image
            src="/images/mask.svg"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};
