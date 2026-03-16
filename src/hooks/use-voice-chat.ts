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
  const [stream, setStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const statusRef = useRef<string>("Idle");
  const rafIdRef = useRef<number | null>(null);
  const restartMediaRecorderRef = useRef<(() => void) | null>(null);

  // Refs for callbacks and state to avoid useEffect dependency churn
  const onStatusChangeRef = useRef(onStatusChange);
  const onTranscriptRef = useRef(onTranscript);
  const onSpeechStartRef = useRef(onSpeechStart);
  const onReplyRef = useRef(onReply);
  const onErrorRef = useRef(onError);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);
  useEffect(() => {
    onSpeechStartRef.current = onSpeechStart;
  }, [onSpeechStart]);
  useEffect(() => {
    onReplyRef.current = onReply;
  }, [onReply]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const handleStatusChange = useCallback((status: string) => {
    statusRef.current = status;
    onStatusChangeRef.current?.(status);
  }, []);

  const cleanup = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
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
    restartMediaRecorderRef.current = null;
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
      handleStatusChange("Connecting");
      console.log("Requesting microphone access...");
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      setStream(s);
      setIsActive(true);
    } catch (err) {
      console.error("Failed to start voice chat:", err);
      onErrorRef.current?.("Microphone access denied or failed to initialize");
      handleStatusChange("Error");
    }
  }, [handleStatusChange]);

  const stop = useCallback(() => {
    console.log("Stopping voice chat...");
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "end" }));
    }
    cleanup();
    handleStatusChange("Idle");
  }, [cleanup, handleStatusChange]);

  useEffect(() => {
    if (!isActive || !stream) return;

    const wssUrl = `wss://api.swiftagents.org/api/v1/voice/${companyId}/call`;
    console.log("Connecting to WebSocket:", wssUrl);

    const socket = new WebSocket(wssUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Opened successfully");
      handleStatusChange("Ready");
      const recorderOptions = (() => {
        if (typeof MediaRecorder === "undefined") return {};
        const prefer = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/ogg;codecs=opus",
          "audio/mp4",
          "audio/aac",
        ];
        for (const m of prefer) {
          if (MediaRecorder.isTypeSupported(m)) return { mimeType: m };
        }
        return {};
      })();

      let chunksSentThisUtterance = 0;
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;

      socket.send(
        JSON.stringify({
          type: "start",
          session_id: crypto.randomUUID(),
          mime_type: mediaRecorder.mimeType,
        }),
      );

      // Audio analysis for volume meter
      const audioContext = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let silenceStartTime: number | null = null;
      let hasSpoken = false;

      const updateVolume = () => {
        if (!isActive) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Silence detection (VAD)
        const SILENCE_THRESHOLD = 12; // Increased from 8 to ignore quiet noise
        const SILENCE_DURATION = 1500;
        const currentStatus = statusRef.current.toLowerCase();

        // ONLY detect silence if the AI is listening (Ready)
        if (currentStatus === "ready") {
          if (average > SILENCE_THRESHOLD) {
            if (!hasSpoken) {
              console.log(
                "VAD: Speech started (vol:",
                Math.round(average),
                ")",
              );
              onSpeechStart?.();
            }
            hasSpoken = true;
            silenceStartTime = null;
          } else if (hasSpoken) {
            if (silenceStartTime === null) {
              silenceStartTime = Date.now();
            } else if (Date.now() - silenceStartTime > SILENCE_DURATION) {
              console.log(
                "VAD: Silence detected (1.5s), triggering stop_audio",
              );
              if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN
              ) {
                socketRef.current.send(JSON.stringify({ type: "stop_audio" }));
                handleStatusChange("Thinking");
              }
              hasSpoken = false;
              silenceStartTime = null;
            }
          }
        } else {
          // If we are not in "ready" state, reset VAD state to be ready for next turn
          if (hasSpoken) {
            console.log(
              "VAD: Resetting hasSpoken because status is",
              currentStatus,
            );
            hasSpoken = false;
            silenceStartTime = null;
          }
        }

        rafIdRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      const setupMediaRecorder = (recorder: MediaRecorder) => {
        recorder.ondataavailable = (event) => {
          const currentStatus = statusRef.current.toLowerCase();
          if (
            event.data.size > 0 &&
            socket.readyState === WebSocket.OPEN &&
            !isMutedRef.current &&
            currentStatus === "ready" // Gating: Only send audio if AI is ready/listening
          ) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = (reader.result as string).split(",")[1];
              socket.send(JSON.stringify({ type: "audio", data: base64data }));
              chunksSentThisUtterance++;
              if (chunksSentThisUtterance % 10 === 1) {
                console.log(
                  "VAD: Sent audio chunk",
                  chunksSentThisUtterance,
                  "this utterance",
                );
              }
            };
            reader.readAsDataURL(event.data);
          } else if (event.data.size > 0 && currentStatus !== "ready") {
            // Log dropped chunks occasionally to avoid spam but confirm behavior
            if (Math.random() < 0.1) {
              console.log(
                "VAD: Dropping audio chunk while status is",
                currentStatus,
              );
            }
          }
        };
      };

      setupMediaRecorder(mediaRecorder);
      mediaRecorder.start(250);

      // Restart MediaRecorder for each new utterance so the server gets a clean segment (fixes 2nd+ transcription)
      restartMediaRecorderRef.current = () => {
        const mr = mediaRecorderRef.current;
        if (mr && mr.state !== "inactive") {
          mr.stop();
        }
        chunksSentThisUtterance = 0;
        const newMr = new MediaRecorder(stream, recorderOptions);
        mediaRecorderRef.current = newMr;
        setupMediaRecorder(newMr);
        newMr.start(250);
        console.log("VAD: MediaRecorder restarted for new utterance");
      };

      return () => {
        cleanup();
      };
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WS Received:", message.type, message);
      switch (message.type) {
        case "status": {
          const prevStatus = statusRef.current.toLowerCase();
          const newStatus = message.status as string;
          const newStatusLower = newStatus.toLowerCase();

          // When leaving "ready" (thinking/transcribing/speaking), stop recording so we don't capture background or AI TTS
          if (newStatusLower !== "ready" && prevStatus === "ready") {
            const mr = mediaRecorderRef.current;
            if (mr && mr.state !== "inactive") {
              mr.stop();
            }
          }

          // When server is ready for a new utterance after replying, signal new segment and restart recorder (fixes 2nd+ transcription)
          if (
            newStatusLower === "ready" &&
            prevStatus !== "ready" &&
            prevStatus !== "connecting" &&
            prevStatus !== "idle"
          ) {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
              const recorder = mediaRecorderRef.current;
              socketRef.current.send(
                JSON.stringify({
                  type: "start_audio",
                  mime_type: recorder?.mimeType,
                }),
              );
            }
            restartMediaRecorderRef.current?.();
          }
          handleStatusChange(newStatus);
          break;
        }
        case "transcript":
          onTranscriptRef.current?.(message.text);
          break;
        case "reply_text":
          onReplyRef.current?.(message.text);
          break;
        case "audio":
          playAudioChunk(message.data);
          break;
        case "error": {
          // Log full payload so we can see the actual reason from the server
          console.error("Voice chat error (full payload):", message);
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

    socket.onerror = (err) => {
      console.error("WebSocket Error:", err);
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
  }, [isActive, stream, companyId, handleStatusChange, cleanup, onSpeechStart]);

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
