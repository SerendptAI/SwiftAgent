"use client";

import {
  Mic,
  MicOff,
  MoreHorizontal,
  Phone,
  PhoneOff,
  Volume2,
} from "lucide-react";
import { use, useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { useVoiceChat } from "@/hooks/use-voice-chat";
import { cn } from "@/lib/utils";

// This is the main widget application that runs inside the iframe
export default function WidgetPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;

  console.log("WidgetPage rendering for companyId:", companyId);

  return <WidgetContent companyId={companyId} />;
}

function WidgetContent({ companyId }: { companyId: string }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [statusText, setStatusText] = useState("Idle");
  const [transcript, setTranscript] = useState("");
  const [agentReply, setAgentReply] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);

  const handleStatusChange = useCallback((s: string) => setStatusText(s), []);
  const handleTranscript = useCallback((t: string) => setTranscript(t), []);
  const handleSpeechStart = useCallback(() => {
    setTranscript("");
    setAgentReply("");
    setErrorMessage(null);
  }, []);
  const handleReply = useCallback((r: string) => setAgentReply(r), []);
  const handleError = useCallback((err: Error | string) => {
    const msg = typeof err === "string" ? err : (err?.message ?? String(err));
    console.error("Voice Chat Error:", msg);
    setErrorMessage(msg);
  }, []);

  const { isActive, isMuted, start, stop, toggleMute } = useVoiceChat({
    companyId,
    onStatusChange: handleStatusChange,
    onTranscript: handleTranscript,
    onSpeechStart: handleSpeechStart,
    onReply: handleReply,
    onError: handleError,
    visualizerRef,
  });

  const callStatus = isActive ? "ongoing" : "idle";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "ongoing") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
      setTranscript("");
      setAgentReply("");
      setErrorMessage(null);
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

  // Resize logic inside the component that knows about isActive
  useEffect(() => {
    if (!window.parent) return;

    if (isActive) {
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
          pointerEvents: "auto",
        },
        "*",
      );
    }
  }, [isActive]);

  const getFriendlyStatus = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "connecting":
        return "Connecting...";
      case "ready":
        return "Listening";
      case "thinking":
        return "Thinking...";
      case "speaking":
        return "Speaking";
      case "error":
        return "Error";
      case "idle":
        return "Ended";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start font-sans">
      <div className="pointer-events-auto w-full">
        {/* --- THE BANNER STRIP (Moved to top) --- */}
        <div className="relative flex w-full flex-row items-center justify-between bg-[#F2B035] px-4 py-3 shadow-md sm:px-6">
          <div className="font-dm-mono truncate pr-4 text-[10px] font-bold tracking-tight text-black uppercase sm:text-xs sm:tracking-wider md:text-sm">
            If you have any questions or inquiries, please feel free to get on a
            call with our Swift Agent.
          </div>

          <button
            onClick={callStatus === "idle" ? start : undefined}
            className={cn(
              "flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-[-6px_6px_0_0_#000000] transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-6",
              callStatus === "ongoing"
                ? "cursor-default border-transparent"
                : "cursor-pointer",
            )}
          >
            {callStatus === "idle" ? (
              <>
                <Icons.phoneIncoming className="h-3 w-3 text-black sm:h-4 sm:w-4" />
                <span className="font-dm-mono text-xs font-bold tracking-tight text-black sm:text-sm">
                  REQUEST CALL
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
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

        {/* --- FULL SCREEN CALL MODAL --- */}
        {callStatus === "ongoing" && (
          <div className="absolute top-[80px] left-1/2 w-[95%] max-w-[1200px] -translate-x-1/2 overflow-hidden rounded-4xl bg-white shadow-2xl transition-all duration-300">
            <div className="relative flex h-[600px] flex-col items-center justify-center p-8 text-center">
              <div className="absolute top-6 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400 uppercase">
                  {getFriendlyStatus(statusText)}
                </span>
              </div>

              <div className="absolute top-20 w-full px-12">
                <div className="mx-auto max-w-lg space-y-4">
                  {errorMessage && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 font-mono text-sm text-red-700">
                      {errorMessage}
                    </p>
                  )}
                  {transcript && (
                    <p className="font-dm-mono text-sm leading-relaxed text-gray-500 italic">
                      &quot;{transcript}&quot;
                    </p>
                  )}
                  {agentReply && (
                    <p className="font-sans text-lg leading-tight font-medium text-black">
                      {agentReply}
                    </p>
                  )}
                </div>
              </div>

              <div
                ref={visualizerRef}
                className="mt-12 flex h-48 w-48 items-center justify-center rounded-full bg-linear-to-br from-orange-300 via-rose-300 to-blue-300 shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] transition-transform duration-75"
              ></div>

              <div className="absolute bottom-10 flex w-full items-center justify-center gap-6">
                <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200">
                  <MoreHorizontal className="h-6 w-6" />
                </button>
                <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200">
                  <Volume2 className="h-6 w-6" />
                </button>
                <button
                  onClick={toggleMute}
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full transition",
                    isMuted
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  {isMuted ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </button>

                <button
                  onClick={stop}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f25430] text-white shadow-lg transition hover:scale-105 hover:bg-red-600 hover:shadow-xl"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
