import "./widget.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { Icons } from "./components/icons";
import { WidgetTab } from "./components/types";
import { WidgetBanner } from "./components/WidgetBanner";
import { WidgetCallTab } from "./components/WidgetCallTab";
import { WidgetChatTab } from "./components/WidgetChatTab";
import { WidgetHeader } from "./components/WidgetHeader";
import { WidgetMinimizedChat } from "./components/WidgetMinimizedChat";
import { WidgetMinimizedControls } from "./components/WidgetMinimizedControls";
import { useCallTimer } from "./hooks/use-call-timer";
import { usePublicCompanyQuery } from "./hooks/use-public-company";
import { useVisitorLog } from "./hooks/use-visitor-log";
import { useVoiceChat } from "./hooks/use-voice-chat";
import { useWidgetAudio } from "./hooks/use-widget-audio";
import { useWidgetChat } from "./hooks/use-widget-chat";
import { initApiClients } from "./lib/api-client";
import { cn } from "./lib/cn";

// --- Query Client ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

// --- Main Widget Component ---

function WidgetContent({ companyId }: { companyId: string }) {
  const { data: company } = usePublicCompanyQuery(companyId);
  const companyName = company?.name;

  const { dialingAudioRef, pickupAudioRef, playTouchSound, stopDialingAudio } =
    useWidgetAudio();

  const chat = useWidgetChat({ companyId });

  useVisitorLog(companyId);

  const [isMinimized, setIsMinimized] = useState(false);
  const [statusText, setStatusText] = useState("Idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeWidgetTab, setActiveWidgetTab] = useState<WidgetTab>("call");

  const hasPlayedPickupRef = useRef(false);
  const dialingStartTimeRef = useRef(0);
  const isDialingPhaseRef = useRef(false);

  const handleStatusChange = useCallback(
    (s: string) => {
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
    [stopDialingAudio, pickupAudioRef],
  );

  const handleSpeechStart = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleError = useCallback(
    (err: Error | string) => {
      const msg = typeof err === "string" ? err : (err?.message ?? String(err));
      console.error("Voice Chat Error:", msg);
      setErrorMessage(msg);
      stopDialingAudio();
    },
    [stopDialingAudio],
  );

  const {
    isActive,
    isMuted,
    start,
    stop,
    toggleMute,
    speakText,
    pause,
    resume,
  } = useVoiceChat({
    companyId,
    onStatusChange: handleStatusChange,
    onTranscript: useCallback(() => {}, []),
    onSpeechStart: handleSpeechStart,
    onReply: useCallback(() => {}, []),
    onError: handleError,
  });

  const callStatus = isActive ? "ongoing" : "idle";
  const elapsedTime = useCallTimer(isActive);

  useEffect(() => {
    if (!isActive) {
      setErrorMessage(null);
      setIsMinimized(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    if (activeWidgetTab === "chat") {
      pause();
    } else {
      resume();
    }
  }, [activeWidgetTab, isActive, pause, resume]);

  // Resize iframe via postMessage
  useEffect(() => {
    if (!window.parent) return;
    const isMobile = window.innerWidth < 640;
    const bannerHeight = isMobile ? "56px" : "72px";

    window.parent.postMessage(
      {
        type: "SWIFT_AGENT_WIDGET_RESIZE",
        width: "100vw",
        height: isActive ? "100vh" : bannerHeight,
        pointerEvents: "auto",
      },
      "*",
    );
  }, [isActive]);

  const handleStartCall = useCallback(() => {
    setErrorMessage(null);
    hasPlayedPickupRef.current = false;
    isDialingPhaseRef.current = false;
    dialingStartTimeRef.current = Date.now();
    dialingAudioRef.current?.play().catch(() => {});
    start();
  }, [start, dialingAudioRef]);

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
        <WidgetBanner
          companyName={companyName}
          callStatus={callStatus as "idle" | "ongoing"}
          elapsedTime={elapsedTime}
          handleRequestCallClick={handleRequestCallClick}
        />

        {callStatus === "ongoing" && (
          <div
            className={cn(
              "pointer-events-auto fixed inset-0 z-50 flex items-start justify-center pt-[56px] sm:pt-[76px]",
              !isMinimized
                ? "widget-animate-fade-in backdrop-blur-sm"
                : "pointer-events-none",
            )}
          >
            <div
              className={cn(
                "widget-container relative h-full max-h-[calc(100vh-56px)] w-full overflow-visible rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[calc(100vh-100px)] sm:w-[95%] sm:max-w-[1200px] sm:rounded-4xl",
                isMinimized ? "widget-minimized" : "widget-animate-slide-up",
              )}
            >
              <button
                onClick={() => setIsMinimized(true)}
                className="widget-animate-float-in absolute right-4 bottom-24 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition hover:scale-105 sm:top-auto sm:-right-4 sm:-bottom-20"
              >
                <Icons.phoneIncoming className="h-6 w-6 -rotate-90 text-black" />
              </button>

              {activeWidgetTab === "call" ? (
                <>
                  <WidgetHeader
                    activeWidgetTab={activeWidgetTab}
                    setActiveWidgetTab={setActiveWidgetTab}
                  />
                  <WidgetCallTab
                    companyName={companyName}
                    isMuted={isMuted}
                    statusText={statusText}
                    errorMessage={errorMessage}
                    showHashInput={chat.showHashInput}
                    setShowHashInput={chat.setShowHashInput}
                    hashValue={chat.hashValue}
                    setHashValue={chat.setHashValue}
                    handleHashSubmit={() => {
                      chat.handleHashSubmit();
                      setActiveWidgetTab("chat");
                    }}
                    playTouchSound={playTouchSound}
                    toggleMute={toggleMute}
                    handleEndCall={handleEndCall}
                  />
                </>
              ) : (
                <WidgetChatTab
                  companyName={companyName}
                  chatMessages={chat.chatMessages}
                  chatInput={chat.chatInput}
                  setChatInput={chat.setChatInput}
                  handleSendChat={chat.handleSendChat}
                  isChatLoading={chat.isChatLoading}
                  chatThinkingText={chat.chatThinkingText}
                  chatEndRef={chat.chatEndRef}
                  setActiveWidgetTab={setActiveWidgetTab}
                  setIsMinimized={setIsMinimized}
                />
              )}
            </div>
          </div>
        )}

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

        {callStatus === "ongoing" &&
          isMinimized &&
          activeWidgetTab === "chat" && (
            <WidgetMinimizedChat
              companyName={companyName}
              chatMessages={chat.chatMessages}
              chatInput={chat.chatInput}
              setChatInput={chat.setChatInput}
              handleSendChat={chat.handleSendChat}
              isChatLoading={chat.isChatLoading}
              chatThinkingText={chat.chatThinkingText}
              chatEndRef={chat.chatEndRef}
              setIsMinimized={setIsMinimized}
            />
          )}
      </div>
    </div>
  );
}

// --- App wrapper with providers ---

function App({ companyId }: { companyId: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetContent companyId={companyId} />
    </QueryClientProvider>
  );
}

// --- Mount logic ---
// The loader script creates a container and passes config via data attributes or globals.

function mount() {
  // Find the script tag that loaded this bundle
  const script =
    document.currentScript ??
    document.querySelector<HTMLScriptElement>("script[data-company-id]");

  const companyId = script?.getAttribute("data-company-id") ?? "";
  if (!companyId) {
    console.error("[SwiftAgent Widget] Missing data-company-id attribute");
    return;
  }

  // Derive the base URL from the script's src
  const scriptSrc = script?.getAttribute("src") ?? "";
  let baseUrl = "";
  try {
    const url = new URL(scriptSrc, window.location.href);
    baseUrl = url.origin;
  } catch {
    baseUrl = window.location.origin;
  }

  // Initialize API clients
  initApiClients(baseUrl);

  // Create mount point
  const container = document.createElement("div");
  container.id = "swift-agent-widget-root";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<App companyId={companyId} />);
}

// Auto-mount when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
