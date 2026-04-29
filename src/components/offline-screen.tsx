"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useOnlineStatus } from "@/hooks/use-online-status";

type Phase = "offline" | "reconnected" | "hidden";

export function OfflineScreen() {
  const isOnline = useOnlineStatus();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [visible, setVisible] = useState(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (!isOnline) {
      setPhase("offline");
      setVisible(true);
      return;
    }

    if (phaseRef.current === "offline") {
      setPhase("reconnected");
      const t1 = setTimeout(() => setVisible(false), 1200);
      const t2 = setTimeout(() => setPhase("hidden"), 1500);
      timers.current = [t1, t2];
    }
  }, [isOnline]);

  if (phase === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-9998 flex flex-col bg-white transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Logo */}
      <div className="flex justify-center px-8 py-5">
        <div className="relative h-14 w-14">
          <Image
            src="/images/newlogo.svg"
            alt="SwiftAgent"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 pb-16">
        <div className="text-center">
          {phase === "reconnected" ? (
            <>
              <h1 className="font-greed-narrow mb-3 text-5xl leading-none font-bold tracking-tight text-black">
                YOU&apos;RE BACK
              </h1>

              <p className="font-dm-mono text-xs tracking-[0.25em] text-green-500 uppercase">
                CONNECTION RESTORED
              </p>
            </>
          ) : (
            <>
              <h1 className="font-greed-narrow mb-3 text-5xl leading-none font-bold tracking-tight text-black">
                YOU&apos;RE OFFLINE
              </h1>
              <p className="font-dm-mono text-xs leading-snug tracking-[0.15em] text-gray-400 uppercase">
                Check your network and try again.
                <br />
                We&apos;ll reconnect automatically.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
