"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { usePublicCompanyQuery } from "@/hooks/use-company";
import { useVoiceChat } from "@/hooks/use-voice-chat";
import { cn } from "@/lib/utils";
import { publicDashboardApi } from "@/services/dashboard";

import { ChatMsg, WidgetTab } from "./components/types";
import { WidgetBanner } from "./components/WidgetBanner";
import { WidgetCallTab } from "./components/WidgetCallTab";
import { WidgetChatTab } from "./components/WidgetChatTab";
import { WidgetHeader } from "./components/WidgetHeader";
import { WidgetMinimizedChat } from "./components/WidgetMinimizedChat";
import { WidgetMinimizedControls } from "./components/WidgetMinimizedControls";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Call/Chat tab state
  const [activeWidgetTab, setActiveWidgetTab] = useState<WidgetTab>("call");
  const [showHashInput, setShowHashInput] = useState(false);
  const [hashValue, setHashValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: 1,
      text: "Hello! How can I assist you today?",
      sender: "agent",
      time: "",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleHashSubmit = useCallback(() => {
    if (!hashValue.trim()) return;
    const msg: ChatMsg = {
      id: Date.now(),
      text: hashValue.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setHashValue("");
  }, [hashValue]);

  const handleSendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const msg: ChatMsg = {
      id: Date.now(),
      text: chatInput.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput("");
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, [chatInput]);

  const stopDialingAudio = useCallback(() => {
    if (dialingAudioRef.current) {
      dialingAudioRef.current.pause();
      dialingAudioRef.current.currentTime = 0;
    }
  }, []);

  const playTouchSound = useCallback(() => {
    touchAudioRef.current?.play().catch(() => {});
  }, []);

  const handleStatusChange = useCallback(
    (s: string) => {
      // When AI voice session is ready for the first time, keep showing "Calling" until dialing finishes (4s min)
      if (s.toLowerCase() === "ready" && !hasPlayedPickupRef.current) {
        hasPlayedPickupRef.current = true;
        isDialingPhaseRef.current = true;
        setStatusText("Calling");
        const elapsed = Date.now() - dialingStartTimeRef.current;
        const remaining = Math.max(0, 4000 - elapsed);
        setTimeout(() => {
          isDialingPhaseRef.current = false;
          stopDialingAudio();
          const pickupAudio = pickupAudioRef.current;
          if (pickupAudio) {
            pickupAudio.onended = () => {
              speakText("Hello, how can I help you?");
            };
            pickupAudio.play().catch(() => {});
          } else {
            speakText("Hello, how can I help you?");
          }
          setStatusText("Ready");
        }, remaining);
      } else if (isDialingPhaseRef.current) {
        return;
      } else {
        setStatusText(s);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopDialingAudio],
  );
  const handleTranscript = useCallback(() => {}, []);
  const handleSpeechStart = useCallback(() => {
    setErrorMessage(null);
  }, []);
  const handleReply = useCallback(() => {}, []);

  const handleError = useCallback(
    (err: Error | string) => {
      const msg = typeof err === "string" ? err : (err?.message ?? String(err));
      console.error("Voice Chat Error:", msg);
      setErrorMessage(msg);
      stopDialingAudio();
    },
    [stopDialingAudio],
  );

  const { isActive, isMuted, start, stop, toggleMute, speakText } =
    useVoiceChat({
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
      setErrorMessage(null);
      setIsMinimized(false);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

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

  const handleStartCall = useCallback(() => {
    setErrorMessage(null);
    hasPlayedPickupRef.current = false;
    isDialingPhaseRef.current = false;
    dialingStartTimeRef.current = Date.now();
    dialingAudioRef.current?.play().catch(() => {});
    start();
  }, [start]);

  const handleEndCall = useCallback(() => {
    playTouchSound();
    stopDialingAudio();
    stop();
  }, [playTouchSound, stopDialingAudio, stop]);

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
        {/* --- THE BANNER STRIP --- */}
        <WidgetBanner
          companyName={companyName}
          callStatus={callStatus as "idle" | "ongoing"}
          elapsedTime={elapsedTime}
          handleRequestCallClick={handleRequestCallClick}
        />

        {/* --- FULL SCREEN CALL/CHAT MODAL --- */}
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
              <button
                onClick={() => setIsMinimized(true)}
                className="animate-float-in absolute right-4 bottom-24 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition hover:scale-105 sm:top-auto sm:-right-4 sm:-bottom-20"
              >
                <Icons.phoneIncoming className="h-6 w-6 -rotate-90 text-black" />
              </button>

              {activeWidgetTab === "call" ? (
                <>
                  {/* Shared Header (Call/Chat toggle, Minimize) */}
                  <WidgetHeader
                    activeWidgetTab={activeWidgetTab}
                    setActiveWidgetTab={setActiveWidgetTab}
                  />

                  {/* Tab Content */}
                  <WidgetCallTab
                    companyName={companyName}
                    isMuted={isMuted}
                    statusText={statusText}
                    errorMessage={errorMessage}
                    showHashInput={showHashInput}
                    setShowHashInput={setShowHashInput}
                    hashValue={hashValue}
                    setHashValue={setHashValue}
                    handleHashSubmit={handleHashSubmit}
                    playTouchSound={playTouchSound}
                    toggleMute={toggleMute}
                    handleEndCall={handleEndCall}
                  />
                </>
              ) : (
                <WidgetChatTab
                  companyName={companyName}
                  chatMessages={chatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleSendChat={handleSendChat}
                  chatEndRef={chatEndRef}
                  setActiveWidgetTab={setActiveWidgetTab}
                  setIsMinimized={setIsMinimized}
                />
              )}
            </div>
          </div>
        )}

        {/* --- MINIMIZED WIDGET CONTROLS --- */}
        {callStatus === "ongoing" &&
          isMinimized &&
          activeWidgetTab === "call" && (
            <WidgetMinimizedControls
              isMuted={isMuted}
              handleEndCall={handleEndCall}
              playTouchSound={playTouchSound}
              toggleMute={toggleMute}
              setIsMinimized={setIsMinimized}
            />
          )}

        {/* --- MINIMIZED CHAT WIDGET --- */}
        {callStatus === "ongoing" &&
          isMinimized &&
          activeWidgetTab === "chat" && (
            <WidgetMinimizedChat
              companyName={companyName}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendChat={handleSendChat}
              chatEndRef={chatEndRef}
              setIsMinimized={setIsMinimized}
            />
          )}
      </div>
    </div>
  );
}
