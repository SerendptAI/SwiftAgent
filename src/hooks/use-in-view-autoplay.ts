"use client";

import { useEffect, useRef } from "react";

export function useInViewAutoplay(threshold = 0.25) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            video.load();
            video.play().catch(() => {});
            observer.disconnect();
          }
        });
      },
      { threshold },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [threshold]);

  return videoRef;
}
