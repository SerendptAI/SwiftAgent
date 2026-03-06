"use client";

import {
  Mic,
  MicOff,
  MoreHorizontal,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { use, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// This is the main widget application that runs inside the iframe
export default function WidgetPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;

  const [callStatus, setCallStatus] = useState<"idle" | "ongoing">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Example timer for the "ongoing" state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "ongoing") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartCall = () => {
    setCallStatus("ongoing");
    // TODO: Make API call to backend brain here to initialize WebRTC token using the companyId
    console.log("Initializing call for company:", companyId);
  };

  const handleEndCall = () => {
    setCallStatus("idle");
  };

  // Handle iframe resizing safely as a side effect
  useEffect(() => {
    if (!window.parent) return;

    if (callStatus === "ongoing") {
      window.parent.postMessage(
        {
          type: "SWIFT_AGENT_WIDGET_RESIZE",
          width: "100vw",
          height: "100vh",
          pointerEvents: "auto",
        },
        "*",
      );
    } else {
      window.parent.postMessage(
        {
          type: "SWIFT_AGENT_WIDGET_RESIZE",
          width: "100vw",
          height: "72px",
          pointerEvents: "none", // The layout container pointer-events is none, buttons are auto
        },
        "*",
      );
    }
  }, [callStatus]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end font-sans">
      {/* 
        This div wraps the interactive parts. pointer-events-auto makes it clickable
        even if the iframe's background lets clicks pass through. 
      */}
      <div className="pointer-events-auto w-full">
        {/* --- FULL SCREEN CALL MODAL --- */}
        {callStatus === "ongoing" && (
          <div className="absolute bottom-[80px] left-1/2 w-[95%] max-w-[1200px] -translate-x-1/2 overflow-hidden rounded-4xl bg-white shadow-2xl transition-all duration-300">
            <div className="relative flex h-[600px] flex-col items-center justify-center p-8 text-center">
              {/* Top status indicator in modal */}
              <div className="absolute top-6 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">
                  Calling...
                </span>
              </div>

              {/* Central Glowing Orb (Placeholder for AI Avatar) */}
              <div className="mb-16 flex h-48 w-48 animate-pulse items-center justify-center rounded-full bg-linear-to-br from-orange-300 via-rose-300 to-blue-300 shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)]">
                {/* Visualizer bars or avatar would go here */}
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-10 flex w-full items-center justify-center gap-6">
                <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200">
                  <MoreHorizontal className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setIsDeafened(!isDeafened)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                >
                  {isDeafened ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                >
                  {isMuted ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </button>

                {/* End Call Button */}
                <button
                  onClick={handleEndCall}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f25430] text-white shadow-lg transition hover:scale-105 hover:bg-red-600 hover:shadow-xl"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- THE BANNER STRIP --- */}
        <div className="relative flex w-full flex-row items-center justify-between border-t-[3px] border-[#2196F3] bg-[#F5A623] px-4 py-3 shadow-md sm:px-6">
          <div className="font-dm-mono truncate pr-4 text-[10px] font-bold tracking-tight text-black sm:text-xs sm:tracking-wider md:text-sm">
            IF YOU HAVE ANY QUESTIONS, GET ON A CALL WITH OUR SWIFT AGENT.
          </div>

          <button
            onClick={callStatus === "idle" ? handleStartCall : undefined}
            className={cn(
              "flex shrink-0 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-6",
              callStatus === "ongoing"
                ? "cursor-default border-transparent"
                : "cursor-pointer",
            )}
          >
            {callStatus === "idle" ? (
              <>
                <Phone className="h-3 w-3 text-black sm:h-4 sm:w-4" />
                <span className="font-dm-mono text-xs font-bold tracking-tight text-black sm:text-sm">
                  REQUEST CALL
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {/* Tiny pulsing indicator */}
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <Phone className="h-3 w-3 animate-pulse text-gray-500 sm:h-4 sm:w-4" />
                </div>
                <span className="font-dm-mono text-xs font-bold tracking-tight text-black sm:text-sm">
                  ONGOING..{" "}
                  <span className="text-gray-500">
                    {formatTime(elapsedTime)}
                  </span>
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
