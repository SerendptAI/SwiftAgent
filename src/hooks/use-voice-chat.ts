"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface VoiceChatOptions {
  companyId: string;
  onStatusChange?: (status: string) => void;
  onTranscript?: (text: string) => void;
  onSpeechStart?: () => void;
  onReply?: (text: string) => void;
  onError?: (message: string) => void;
}

// Browser SpeechRecognition types (not in all TS libs)
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((event: {
        results: SpeechRecognitionResultList;
        resultIndex: number;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function getAudioContext(): AudioContext {
  return new (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  )();
}

export function useVoiceChat({
  companyId,
  onStatusChange,
  onTranscript,
  onSpeechStart,
  onReply,
  onError,
}: VoiceChatOptions) {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const statusRef = useRef<string>("Idle");
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for callbacks and state to avoid useEffect dependency churn
  const onStatusChangeRef = useRef(onStatusChange);
  const onTranscriptRef = useRef(onTranscript);
  const onSpeechStartRef = useRef(onSpeechStart);
  const onReplyRef = useRef(onReply);
  const onErrorRef = useRef(onError);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
    onTranscriptRef.current = onTranscript;
    onSpeechStartRef.current = onSpeechStart;
    onReplyRef.current = onReply;
    onErrorRef.current = onError;
    isMutedRef.current = isMuted;
  }, [onStatusChange, onTranscript, onSpeechStart, onReply, onError, isMuted]);

  const THINKING_TIMEOUT_MS = 30_000;

  const startRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.start();
      } catch {
        // Already started — ignore
      }
    }
  }, []);

  const handleStatusChange = useCallback(
    (status: string) => {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }

      statusRef.current = status;
      onStatusChangeRef.current?.(status);

      if (status.toLowerCase() === "thinking") {
        thinkingTimeoutRef.current = setTimeout(() => {
          if (statusRef.current.toLowerCase() === "thinking") {
            console.warn("Thinking timeout reached, recovering to Ready");
            statusRef.current = "Ready";
            onStatusChangeRef.current?.("Ready");
            startRecognition();
          }
        }, THINKING_TIMEOUT_MS);
      }
    },
    [startRecognition],
  );

  const sendMessage = useCallback((data: Record<string, unknown>) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  }, []);

  const cleanup = useCallback(() => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
  }, []);

  const playAudioChunk = async (base64Data: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = getAudioContext();
      nextStartTimeRef.current = audioContextRef.current.currentTime;
    }

    try {
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(
        bytes.buffer,
      );
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      const startTime = Math.max(
        nextStartTimeRef.current,
        audioContextRef.current.currentTime,
      );
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;
    } catch (err) {
      console.error("Error playing audio chunk:", err);
    }
  };

  const start = useCallback(async () => {
    try {
      handleStatusChange("Connecting");
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
      setIsActive(true);
    } catch (err) {
      console.error("Failed to start voice chat:", err);
      onErrorRef.current?.("Microphone access denied or failed to initialize");
      handleStatusChange("Error");
    }
  }, [handleStatusChange]);

  const stop = useCallback(() => {
    console.log("Stopping voice chat...");
    sendMessage({ type: "end" });
    cleanup();
    handleStatusChange("Idle");
  }, [cleanup, handleStatusChange, sendMessage]);

  // Main effect: connect WebSocket + start SpeechRecognition when active
  useEffect(() => {
    if (!isActive) return;

    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      onErrorRef.current?.("Speech recognition not supported in this browser");
      handleStatusChange("Error");
      return;
    }

    const wssUrl = `wss://api.swiftagents.org/api/v1/voice/${companyId}/call`;
    console.log("Connecting to WebSocket:", wssUrl);

    const socket = new WebSocket(wssUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Opened successfully");
      handleStatusChange("Ready");

      socket.send(
        JSON.stringify({
          type: "start",
          session_id: crypto.randomUUID(),
        }),
      );

      // Set up SpeechRecognition for client-side STT
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      let hasSpokenThisTurn = false;

      recognition.onresult = (event) => {
        if (isMutedRef.current) return;
        if (statusRef.current.toLowerCase() !== "ready") return;

        if (!hasSpokenThisTurn) {
          hasSpokenThisTurn = true;
          onSpeechStartRef.current?.();
        }

        const result = event.results[0];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) {
            console.log("STT final:", text);
            onTranscriptRef.current?.(text);
            sendMessage({ type: "user_text", text });
            handleStatusChange("Thinking");
            hasSpokenThisTurn = false;
          }
        } else {
          onTranscriptRef.current?.(result[0].transcript);
        }
      };

      recognition.onend = () => {
        hasSpokenThisTurn = false;
        if (
          statusRef.current.toLowerCase() === "ready" &&
          !isMutedRef.current &&
          socketRef.current?.readyState === WebSocket.OPEN
        ) {
          try {
            recognition.start();
          } catch {
            // Already started
          }
        }
      };

      recognition.onerror = (event) => {
        if (event.error !== "no-speech" && event.error !== "aborted") {
          console.error("Speech recognition error:", event.error);
        }
      };

      recognition.start();
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WS Received:", message.type, message);
      switch (message.type) {
        case "status": {
          const newStatus = message.status as string;
          handleStatusChange(newStatus);
          if (newStatus.toLowerCase() === "ready") {
            startRecognition();
          }
          break;
        }
        case "reply_text":
          onReplyRef.current?.(message.text);
          break;
        case "audio":
          playAudioChunk(message.data);
          break;
        case "error": {
          console.error("Voice chat error:", message);
          const parts = [
            message.message,
            message.detail,
            message.reason,
            message.code != null ? `code: ${message.code}` : "",
          ].filter(Boolean);
          const fullMessage =
            parts.length > 0 ? parts.join(" — ") : JSON.stringify(message);
          onErrorRef.current?.(fullMessage);
          break;
        }
      }
    };

    socket.onerror = () => {
      onErrorRef.current?.("Connection failed");
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
      setIsActive(false);
      cleanup();
    };

    return () => {
      console.log("Cleaning up WebSocket effect");
      socket.close();
    };
  }, [
    isActive,
    companyId,
    handleStatusChange,
    cleanup,
    sendMessage,
    startRecognition,
  ]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      const recognition = recognitionRef.current;
      if (recognition) {
        if (newMuted) {
          recognition.abort();
        } else if (statusRef.current.toLowerCase() === "ready") {
          try {
            recognition.start();
          } catch {
            // Already started
          }
        }
      }
      return newMuted;
    });
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    isActive,
    isMuted,
    start,
    stop,
    toggleMute,
  };
}
