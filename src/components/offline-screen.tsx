"use client";

import { RefreshIcon } from "hugeicons-react";
import { useEffect, useRef, useState } from "react";

import { useOnlineStatus } from "@/hooks/use-online-status";

type Phase = "online" | "offline" | "reconnected";

function OfflineIllustration() {
  return (
    <svg
      width="438"
      height="108"
      viewBox="0 0 92 108"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M40.25 70.4375H0V107.812H40.25V70.4375Z" fill="#F25430" />
      <path
        d="M39.3588 31.97L81.9375 31.97V23.0029L39.3588 23.0029V31.97Z"
        fill="#242424"
      />
      <path
        d="M53.1875 7.1875H41.6875V17.2299H53.1875V7.1875Z"
        fill="#ED855F"
      />
      <path d="M86.25 38.8125H81.9375V107.812H86.25V38.8125Z" fill="#576355" />
      <path
        d="M42.6708 38.8153L83.375 38.8153V31.5847L42.6708 31.5847V38.8153Z"
        fill="#242424"
      />
      <path d="M81.9375 38.8153H92V31.6278H81.9375V38.8153Z" fill="#ED855F" />
      <path
        d="M79.0625 31.6278H89.125V24.4403H79.0625V31.6278Z"
        fill="#ED855F"
      />
      <path d="M60.375 5.75H48.875V23H60.375V5.75Z" fill="#ED855F" />
      <path d="M61.8125 0H44.5625V7.1875H61.8125V0Z" fill="#576355" />
      <path d="M69 4.3125H53.1875V8.625H69V4.3125Z" fill="#576355" />
      <path
        d="M37.0127 35.9835H48.875V17.2528H37.0127V35.9835Z"
        fill="#242424"
      />
      <path
        d="M48.6076 18.6903H41.6875V10.0653H23V18.6903H14.375V41.6903H10.0625V80.4597H43.125V67.5653H48.6076V18.6903Z"
        fill="#242424"
      />
      <path d="M60.375 14.3778H63.25V10.0653H60.375V14.3778Z" fill="#242424" />
      <path
        d="M53.1875 14.3778H58.9375V10.0653H53.1875V14.3778Z"
        fill="#242424"
      />
      <path
        d="M48.875 38.8125H44.5625V56.0625H48.875V38.8125Z"
        fill="#576355"
      />
      <path
        d="M44.5625 56.0653V67.5653H57.5V107.815H69V67.5653V56.0653H44.5625Z"
        fill="#945038"
      />
    </svg>
  );
}

export function OfflineScreen({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  const [phase, setPhase] = useState<Phase>("online");
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
      return;
    }

    if (phaseRef.current === "offline") {
      setPhase("reconnected");
      const t = setTimeout(() => setPhase("online"), 1500);
      timers.current = [t];
    }
  }, [isOnline]);

  if (phase === "online") return <>{children}</>;

  return (
    <div className="font-dm-mono flex min-h-[400px] flex-col items-center justify-center pt-28">
      {phase === "reconnected" ? (
        <>
          <p className="text-center text-[26px] leading-[134%] font-normal tracking-[-0.02em] text-black/60 uppercase">
            YOU&apos;RE BACK
          </p>
          <p className="mt-4 text-xs tracking-[0.25em] text-green-500 uppercase">
            CONNECTION RESTORED
          </p>
        </>
      ) : (
        <>
          <p className="text-center text-[26px] leading-[134%] font-normal tracking-[-0.02em] text-black/65 uppercase">
            YOU ARE OFFLINE
          </p>

          <div className="mt-[56px] h-[108px] w-[438px]">
            <OfflineIllustration />
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-[98px] inline-flex h-[38px] w-[326px] items-center justify-center gap-[13px] rounded-[13px] bg-[#006BE5] text-sm text-white transition-colors hover:bg-[#1E88E5]"
          >
            <RefreshIcon size={16} stroke="2" />
            RECONNECT
          </button>
        </>
      )}
    </div>
  );
}
