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

  useEffect(() => {
    console.log("useVoiceChat hook MOUNTED");
    return () => console.log("useVoiceChat hook UNMOUNTED");
  }, []);

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
      mediaRecorderRef.current.stop();
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

      // Schedule playback
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted, stream obtained");
      setIsActive(true);

      // Using the endpoint provided by the user
      // Forced wss:// because the external API requires it regardless of local protocol
      const wssUrl = `wss://api.swiftagents.org/api/v1/voice/${companyId}/call`;
      const wsUrl = `ws://api.swiftagents.org/api/v1/voice/${companyId}/call`;

      console.log("Attempting WebSocket connection (preferring WSS)...");

      let socket: WebSocket;
      try {
        console.log("Connecting to WSS:", wssUrl);
        socket = new WebSocket(wssUrl);
      } catch (e) {
        console.warn(
          "WSS Constructor failed instantly, falling back to WS:",
          e,
        );
        socket = new WebSocket(wsUrl);
      }

      socketRef.current = socket;

      console.log(
        "WebSocket instance created, state:",
        socket.readyState,
        "(0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)",
      );

      socket.onopen = () => {
        console.log("WebSocket Connection Opened");
        const sessionId = crypto.randomUUID();
        console.log("Sending start message with session_id:", sessionId);
        socket.send(JSON.stringify({ type: "start", session_id: sessionId }));

        // Start recording once socket is open
        console.log("Starting MediaRecorder...");
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
          if (
            event.data.size > 0 &&
            socket.readyState === WebSocket.OPEN &&
            !isMuted
          ) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = (reader.result as string).split(",")[1];
              // console.log("Sending audio chunk to server...");
              socket.send(JSON.stringify({ type: "audio", data: base64data }));
            };
            reader.readAsDataURL(event.data);
          }
        };

        mediaRecorder.start(250); // Send 250ms chunks
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("WebSocket Message Received:", message.type);
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
        onError?.("WebSocket connection failed");
        cleanup();
      };

      socket.onclose = () => {
        console.log("WebSocket Closed");
        cleanup();
      };
    } catch (err) {
      console.error("Failed to start voice chat:", err);
      onError?.("Microphone access denied or failed to initialize");
      setIsActive(false);
    }
  }, [
    companyId,
    cleanup,
    isMuted,
    onStatusChange,
    onTranscript,
    onReply,
    onError,
  ]);

  const stop = useCallback(() => {
    console.log("Stopping voice chat...");
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending end message to server");
      socketRef.current.send(JSON.stringify({ type: "end" }));
    }
    cleanup();
  }, [cleanup]);

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
