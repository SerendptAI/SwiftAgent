"use client";

import { useCallback, useEffect, useRef } from "react";

/** Create an Audio element with preload. Returns null during SSR. */
function createAudio(src: string): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
}

interface UseWidgetAudioReturn {
  dialingAudioRef: React.RefObject<HTMLAudioElement | null>;
  pickupAudioRef: React.RefObject<HTMLAudioElement | null>;
  playTouchSound: () => void;
  stopDialingAudio: () => void;
}

export function useWidgetAudio(): UseWidgetAudioReturn {
  const dialingAudioRef = useRef<HTMLAudioElement | null>(null);
  const pickupAudioRef = useRef<HTMLAudioElement | null>(null);
  const touchAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    dialingAudioRef.current = createAudio("/audio/dialing.mp3");
    pickupAudioRef.current = createAudio("/audio/pick_audio.aac");
    touchAudioRef.current = createAudio("/audio/touch_audio.aac");
    if (dialingAudioRef.current) dialingAudioRef.current.loop = true;
  }, []);

  const stopDialingAudio = useCallback(() => {
    if (dialingAudioRef.current) {
      dialingAudioRef.current.pause();
      dialingAudioRef.current.currentTime = 0;
    }
  }, []);

  const playTouchSound = useCallback(() => {
    touchAudioRef.current?.play().catch(() => {});
  }, []);

  return { dialingAudioRef, pickupAudioRef, playTouchSound, stopDialingAudio };
}
