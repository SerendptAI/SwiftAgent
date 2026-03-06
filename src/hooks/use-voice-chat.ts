"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface VoiceChatOptions {
  companyId: string;
  onStatusChange?: (status: string) => void;
  onTranscript?: (text: string) => void;
  onReply?: (text: string) => void;
  onError?: (message: string) => void;
}

export function useVoiceChat({
  companyId,
  onStatusChange,
  onTranscript,
  onReply,
  onError,
}: VoiceChatOptions) {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setStream(null);
  }, []);

  const playAudioChunk = async (base64Data: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
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
      console.log("Requesting microphone access...");
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      setStream(s);
      setIsActive(true);
    } catch (err) {
      console.error("Failed to start voice chat:", err);
      onError?.("Microphone access denied or failed to initialize");
    }
  }, [onError]);

  const stop = useCallback(() => {
    console.log("Stopping voice chat...");
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "end" }));
    }
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    if (!isActive || !stream) return;

    const wssUrl = `wss://api.swiftagents.org/api/v1/voice/${companyId}/call`;
    console.log("Connecting to WebSocket:", wssUrl);

    const socket = new WebSocket(wssUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Opened successfully");
      socket.send(
        JSON.stringify({ type: "start", session_id: crypto.randomUUID() }),
      );

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (
          event.data.size > 0 &&
          socket.readyState === WebSocket.OPEN &&
          !isMuted
        ) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = (reader.result as string).split(",")[1];
            socket.send(JSON.stringify({ type: "audio", data: base64data }));
          };
          reader.readAsDataURL(event.data);
        }
      };
      mediaRecorder.start(250);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "status":
          onStatusChange?.(message.status);
          break;
        case "transcript":
          onTranscript?.(message.text);
          break;
        case "reply_text":
          onReply?.(message.text);
          break;
        case "audio":
          playAudioChunk(message.data);
          break;
        case "error":
          onError?.(message.message);
          break;
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket Error:", err);
      onError?.("Connection failed");
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
    stream,
    companyId,
    isMuted,
    onStatusChange,
    onTranscript,
    onReply,
    onError,
    cleanup,
  ]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
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
