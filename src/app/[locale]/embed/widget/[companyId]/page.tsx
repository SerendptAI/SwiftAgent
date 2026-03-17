"use client";
import { MicOff, MoreHorizontal, Phone } from "lucide-react";
import Image from "next/image";
import { use, useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { usePublicCompanyQuery } from "@/hooks/use-company";
import { useVoiceChat } from "@/hooks/use-voice-chat";
import { cn } from "@/lib/utils";
import { publicDashboardApi } from "@/services/dashboard";

// Preload feedback audio elements
function createAudio(src: string): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
}

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
  const {
    data: company,
    isLoading,
    error: queryError,
  } = usePublicCompanyQuery(companyId);
  const companyName = company?.name;

  useEffect(() => {
    console.log("------------------ WidgetContent Log ------------------");
    console.log("companyId    :", companyId);
    console.log("isLoading    :", isLoading);
    console.log("company      :", company);
    console.log("companyName  :", companyName);
    console.log("queryError   :", queryError);
    if (queryError) console.error("WidgetContent Query Error:", queryError);
    console.log("-------------------------------------------------------");
  }, [companyId, isLoading, company, companyName, queryError]);

  // Audio feedback refs
  const dialingAudioRef = useRef<HTMLAudioElement | null>(null);
  const pickupAudioRef = useRef<HTMLAudioElement | null>(null);
  const touchAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedPickupRef = useRef(false);
  const dialingStartTimeRef = useRef(0);
  const isDialingPhaseRef = useRef(false);

  useEffect(() => {
    dialingAudioRef.current = createAudio("/audio/dialing.mp3");
    pickupAudioRef.current = createAudio("/audio/pick_audio.aac");
    touchAudioRef.current = createAudio("/audio/touch_audio.aac");
    // Loop the dialing sound so it plays continuously until connected
    if (dialingAudioRef.current) dialingAudioRef.current.loop = true;
  }, []);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [statusText, setStatusText] = useState("Idle");
  const [transcript, setTranscript] = useState("");
  const [agentReply, setAgentReply] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStatusChange = useCallback((s: string) => {
    // When AI voice session is ready for the first time, keep showing "Calling" until dialing finishes (4s min)
    if (s.toLowerCase() === "ready" && !hasPlayedPickupRef.current) {
      hasPlayedPickupRef.current = true;
      isDialingPhaseRef.current = true;
      setStatusText("Calling");
      const elapsed = Date.now() - dialingStartTimeRef.current;
      const remaining = Math.max(0, 4000 - elapsed);
      setTimeout(() => {
        isDialingPhaseRef.current = false;
        if (dialingAudioRef.current) {
          dialingAudioRef.current.pause();
          dialingAudioRef.current.currentTime = 0;
        }
        pickupAudioRef.current?.play().catch(() => {});
        setStatusText("Ready");
      }, remaining);
    } else if (isDialingPhaseRef.current) {
      // Suppress any status updates while dialing is still playing
      return;
    } else {
      setStatusText(s);
    }
  }, []);
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
    // Stop dialing sound on error
    if (dialingAudioRef.current) {
      dialingAudioRef.current.pause();
      dialingAudioRef.current.currentTime = 0;
    }
  }, []);

  const { isActive, isMuted, start, stop, toggleMute } = useVoiceChat({
    companyId,
    onStatusChange: handleStatusChange,
    onTranscript: handleTranscript,
    onSpeechStart: handleSpeechStart,
    onReply: handleReply,
    onError: handleError,
  });

  const callStatus = isActive ? "ongoing" : "idle";

  // Log visitor when the widget is first loaded
  useEffect(() => {
    const logVisitorIfNew = async () => {
      // Basic check to see if we already logged them in this session to prevent spamming
      const sessionKey = `swift_agent_visited_${companyId}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        if (data.ip) {
          await publicDashboardApi.logVisitor(companyId, data.ip);
          sessionStorage.setItem(sessionKey, "true");
          console.log("Visitor logged successfully.");
        }
      } catch (err) {
        console.error("Failed to log visitor:", err);
      }
    };

    logVisitorIfNew();
  }, [companyId]);

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
      setIsMinimized(false);
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

    const isMobile = window.innerWidth < 640;
    const bannerHeight = isMobile ? "56px" : "72px";

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
          height: bannerHeight,
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
      case "calling":
        return "Calling...";
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
        return s;
    }
  };

  const handleStartCall = useCallback(() => {
    setErrorMessage(null);
    hasPlayedPickupRef.current = false;
    isDialingPhaseRef.current = false;
    dialingStartTimeRef.current = Date.now();
    // Play dialing sound while AI session initializes
    dialingAudioRef.current?.play().catch(() => {});
    start();
  }, [start]);

  const handleRequestCallClick = useCallback(() => {
    if (callStatus === "idle") {
      handleStartCall();
    }
  }, [callStatus, handleStartCall]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 flex flex-col items-center justify-start font-sans",
        isActive ? "pointer-events-none inset-0" : "pointer-events-auto",
      )}
    >
      <div className="pointer-events-auto z-[100] w-full">
        {/* --- THE BANNER STRIP (Moved to top) --- */}
        <div className="relative z-[100] flex w-full flex-row items-center justify-between overflow-hidden bg-[#F2B035] px-3 py-2 shadow-md sm:px-6 sm:py-3">
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .widget-marquee {
              display: inline-block;
              white-space: nowrap;
              animation: marquee 18s linear infinite;
            }
          `}</style>
          <div className="font-dm-mono max-w-[70%] min-w-0 flex-1 overflow-hidden pr-2 text-[9px] font-normal tracking-tight text-black uppercase sm:max-w-[85%] sm:pr-4 sm:text-xs sm:tracking-wider md:text-sm">
            <span className="widget-marquee">
              If you have any questions or inquiries, please feel free to get on
              a call with our {companyName}
              .&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you have any questions or
              inquiries, please feel free to get on a call with our{" "}
              {companyName}.
            </span>
          </div>

          <button
            type="button"
            onClick={handleRequestCallClick}
            className={cn(
              "relative z-[101] flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-[-4px_4px_0_0_#000000] transition-all hover:-translate-y-0.5 hover:shadow-md sm:gap-2 sm:px-6 sm:py-2 sm:shadow-[-6px_6px_0_0_#000000]",
              callStatus === "ongoing"
                ? "cursor-default border-transparent"
                : "cursor-pointer",
            )}
          >
            {callStatus === "idle" ? (
              <>
                <Icons.phoneIncoming className="h-3 w-3 text-black sm:h-4 sm:w-4" />
                <span className="font-dm-mono text-xs font-bold tracking-tight text-black sm:text-sm">
                  REQUEST A CALL
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Icons.widgetphone className="h-6 w-6 animate-pulse text-gray-500 sm:h-4 sm:w-4" />
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
          <div
            className={cn(
              "pointer-events-auto fixed inset-0 z-50 flex items-start justify-center pt-[56px] sm:pt-[76px]",
              !isMinimized
                ? "animate-fade-in backdrop-blur-sm"
                : "pointer-events-none",
            )}
          >
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(40px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes scaleIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
              }
              @keyframes floatIn {
                from { opacity: 0; transform: translateY(20px) scale(0.5); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .animate-fade-in {
                animation: fadeIn 0.4s ease-out forwards;
                background-color: #000000A6;
              }
              .animate-slide-up {
                animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .animate-scale-in {
                animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
                opacity: 0;
              }
              .animate-float-in {
                animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
                opacity: 0;
              }
              .animate-control-1 { animation: floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
              .animate-control-2 { animation: floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; opacity: 0; }
              .animate-control-3 { animation: floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards; opacity: 0; }
              .animate-control-4 { animation: floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards; opacity: 0; }
              .widget-container {
                transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
              }
              .widget-minimized {
                transform: scale(0) translate(50vw, 50vh);
                opacity: 0;
                pointer-events: none;
              }
            `}</style>
            <div
              className={cn(
                "widget-container relative h-full max-h-[calc(100vh-56px)] w-full overflow-visible rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[calc(100vh-100px)] sm:w-[95%] sm:max-w-[1200px] sm:rounded-4xl",
                isMinimized ? "widget-minimized" : "animate-slide-up",
              )}
            >
              {/* Floating call icon on the modal */}
              <button
                onClick={() => {
                  setIsMinimized(true);
                }}
                className="animate-float-in absolute top-6 right-6 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition hover:scale-105 sm:top-auto sm:-right-4 sm:-bottom-20"
              >
                <Icons.phoneIncoming className="h-6 w-6 -rotate-90 text-black" />
              </button>
              <div className="relative flex h-full min-h-[400px] flex-col items-center justify-between py-14 text-center sm:h-[600px] sm:px-8">
                <div className="flex w-full flex-col items-center gap-4 sm:gap-8">
                  <div className="animate-float-in flex flex-col items-center gap-2">
                    <div className="text-xl font-semibold text-gray-400 uppercase sm:text-sm">
                      {companyName ? `${companyName}  ` : ""}
                    </div>
                    <div
                      className={cn(
                        "text-xs font-semibold uppercase sm:text-sm",
                        isMuted ? "text-red-500" : "text-gray-400",
                      )}
                    >
                      {isMuted ? "Muted" : getFriendlyStatus(statusText)}
                    </div>
                  </div>

                  <div className="w-full px-4 sm:px-12">
                    <div className="mx-auto max-w-lg space-y-3 sm:space-y-4">
                      {errorMessage && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 font-mono text-xs text-red-700 sm:text-sm">
                          {errorMessage}
                        </p>
                      )}
                      {transcript && (
                        <p className="font-dm-mono text-xs leading-relaxed text-gray-500 italic sm:text-sm">
                          &quot;{transcript}&quot;
                        </p>
                      )}
                      {agentReply && (
                        <p className="font-sans text-base leading-tight font-medium text-black sm:text-lg">
                          {agentReply}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="animate-scale-in flex flex-1 items-center justify-center py-6">
                  <div className="flex h-48 w-48 items-center justify-center rounded-full">
                    <Image
                      src="/images/aiblock.svg"
                      alt="Phone"
                      width={192}
                      height={192}
                      className="h-full w-full"
                    />
                  </div>
                </div>

                <div className="flex w-full items-center justify-center gap-6 sm:gap-16">
                  <button
                    onClick={() => {
                      touchAudioRef.current?.play().catch(() => {});
                    }}
                    className="animate-control-1 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 sm:h-16 sm:w-16"
                  >
                    <MoreHorizontal className="h-6 w-6 sm:h-7 sm:w-7" />
                  </button>
                  <button
                    onClick={() => {
                      touchAudioRef.current?.play().catch(() => {});
                    }}
                    className="animate-control-2 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 sm:h-16 sm:w-16"
                  >
                    <Icons.Speaker className="h-6 w-6 sm:h-7 sm:w-7" />
                  </button>
                  <button
                    onClick={() => {
                      touchAudioRef.current?.play().catch(() => {});
                      toggleMute();
                    }}
                    className={cn(
                      "animate-control-3 flex h-14 w-14 items-center justify-center rounded-full transition sm:h-16 sm:w-16",
                      isMuted
                        ? "bg-[#FBCDC3] text-[red-600] hover:bg-red-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {isMuted ? (
                      <Icons.micoff className="h-6 w-6 sm:h-7 sm:w-7" />
                    ) : (
                      <Icons.mic className="h-6 w-6 sm:h-7 sm:w-7" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      // Play button sound on end call
                      touchAudioRef.current?.play().catch(() => {});
                      // Stop dialing sound if still playing
                      if (dialingAudioRef.current) {
                        dialingAudioRef.current.pause();
                        dialingAudioRef.current.currentTime = 0;
                      }
                      stop();
                    }}
                    className="animate-control-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f25430] text-white shadow-lg transition hover:scale-105 hover:bg-red-600 hover:shadow-xl sm:h-16 sm:w-16"
                  >
                    <Icons.phonedown className="h-6 w-6 sm:h-7 sm:w-7" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MINIMIZED WIDGET --- */}
        {callStatus === "ongoing" && isMinimized && (
          <div className="pointer-events-none fixed right-0 bottom-0 z-50 h-full w-full">
            {/* Main Restore Button - Bottom Right */}
            <button
              onClick={() => {
                setIsMinimized(false);
              }}
              className="animate-float-in pointer-events-auto absolute z-30 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] sm:h-[72px] sm:w-[72px]"
              style={{ bottom: "30px", right: "30px" }}
              title="Expand Call"
            >
              <Icons.phoneIncoming className="h-7 w-7 animate-pulse text-black sm:h-8 sm:w-8" />
            </button>

            {/* End Call - Top Right (~75 deg arc) */}
            <button
              onClick={() => {
                touchAudioRef.current?.play().catch(() => {});
                if (dialingAudioRef.current) {
                  dialingAudioRef.current.pause();
                  dialingAudioRef.current.currentTime = 0;
                }
                stop();
              }}
              className="animate-control-1 pointer-events-auto absolute z-20 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#f25430] text-white shadow-lg transition hover:scale-105 hover:bg-red-600 hover:shadow-xl sm:h-[56px] sm:w-[56px]"
              style={{ bottom: "145px", right: "15px" }}
              title="End Call"
            >
              <Icons.phonedown className="h-6 w-6" />
            </button>

            {/* Mute - Top Left (~120 deg arc) */}
            <button
              onClick={() => {
                touchAudioRef.current?.play().catch(() => {});
                toggleMute();
              }}
              className={cn(
                "animate-control-2 pointer-events-auto absolute z-20 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full shadow-lg transition hover:scale-105 hover:shadow-xl sm:h-[56px] sm:w-[56px]",
                isMuted
                  ? "bg-[#FBCDC3] text-red-600 hover:bg-red-200"
                  : "bg-[#fce5e1] text-gray-700 hover:bg-[#faccd0]",
              )}
              style={{ bottom: "136px", right: "83px" }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <Icons.micoff className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Icons.mic className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>

            {/* Speaker - Left (~165 deg arc) */}
            <button
              onClick={() => {
                touchAudioRef.current?.play().catch(() => {});
              }}
              className="animate-control-3 pointer-events-auto absolute z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:scale-105 hover:bg-gray-50 hover:shadow-xl sm:h-12 sm:w-12"
              style={{ bottom: "85px", right: "129px" }}
              title="Speaker"
            >
              <Icons.Speaker className="h-5 w-5" />
            </button>

            {/* More - Bottom Left (~210 deg arc) */}
            <button
              onClick={() => {
                touchAudioRef.current?.play().catch(() => {});
              }}
              className="animate-control-4 pointer-events-auto absolute z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-gray-700 shadow-md transition hover:scale-105 hover:bg-gray-200 sm:h-12 sm:w-12"
              style={{ bottom: "17px", right: "120px" }}
              title="More Options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
