/* eslint-disable @next/next/no-img-element */
"use client";

import type { RefObject } from "react";

import { cn } from "@/lib/utils";

/** The player is inline in the page, blown up over it, or docked in a corner. */
export type PlayerMode = "inline" | "fullscreen" | "mini";

const RING_RADIUS = 17;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 21" fill="none" className={cn("shrink-0", className)}>
      <path
        d="M15.7521 7.89537C17.5345 9.08271 17.5345 11.7015 15.7521 12.8888L4.66325 20.2759C2.66952 21.6041 0 20.1748 0 17.7792V3.00496C0 0.609334 2.66952 -0.819931 4.66325 0.50824L15.7521 7.89537Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PauseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn("shrink-0", className)}>
      <path
        d="M3.33333 5.83333C3.33333 4.65482 3.33333 4.06557 3.69945 3.69945C4.06557 3.33333 4.65482 3.33333 5.83333 3.33333C7.01184 3.33333 7.6011 3.33333 7.96722 3.69945C8.33333 4.06557 8.33333 4.65482 8.33333 5.83333V14.1667C8.33333 15.3452 8.33333 15.9344 7.96722 16.3006C7.6011 16.6667 7.01184 16.6667 5.83333 16.6667C4.65482 16.6667 4.06557 16.6667 3.69945 16.3006C3.33333 15.9344 3.33333 15.3452 3.33333 14.1667V5.83333Z"
        fill="currentColor"
      />
      <path
        d="M11.6667 5.83333C11.6667 4.65482 11.6667 4.06557 12.0327 3.69945C12.3989 3.33333 12.9882 3.33333 14.1667 3.33333C15.3452 3.33333 15.9344 3.33333 16.3006 3.69945C16.6667 4.06557 16.6667 4.65482 16.6667 5.83333V14.1667C16.6667 15.3452 16.6667 15.9344 16.3006 16.3006C15.9344 16.6667 15.3452 16.6667 14.1667 16.6667C12.9882 16.6667 12.3989 16.6667 12.0327 16.3006C11.6667 15.9344 11.6667 15.3452 11.6667 14.1667V5.83333Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Transport control for a use case: a black track ring that the accent colour
 * fills in as the clip plays, wrapped around a play/pause glyph.
 */
export function ProgressDisc({
  playing,
  progress,
  accentColor,
  className,
}: {
  playing: boolean;
  progress: number;
  accentColor: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center",
        className,
      )}
    >
      <svg viewBox="0 0 40 40" className="absolute size-full -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={RING_RADIUS}
          fill="none"
          stroke="black"
          strokeWidth="6"
        />
        {playing && (
          <circle
            cx="20"
            cy="20"
            r={RING_RADIUS}
            fill="none"
            stroke={accentColor}
            strokeWidth="6"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
          />
        )}
      </svg>
      {playing ? (
        <PauseGlyph className="relative size-5 text-black" />
      ) : (
        <PlayGlyph className="relative ml-0.5 h-[13px] w-[11px] text-black" />
      )}
    </span>
  );
}

function ExpandGlyph() {
  return (
    <svg viewBox="0 0 60 60" fill="none" className="size-full">
      <circle cx="30" cy="30" r="29.5" fill="white" stroke="black" />
      <path
        d="M33.7917 39.75C35.3036 39.75 36.0594 39.75 36.6745 39.5635C38.0595 39.1433 39.1433 38.0595 39.5635 36.6745C39.75 36.0594 39.75 35.3036 39.75 33.7917M39.75 26.2083C39.75 24.6965 39.75 23.9405 39.5635 23.3254C39.1433 21.9405 38.0595 20.8567 36.6745 20.4366C36.0594 20.25 35.3036 20.25 33.7917 20.25M26.2083 39.75C24.6965 39.75 23.9405 39.75 23.3254 39.5635C21.9405 39.1433 20.8567 38.0595 20.4366 36.6745C20.25 36.0594 20.25 35.3036 20.25 33.7917M20.25 26.2083C20.25 24.6965 20.25 23.9405 20.4366 23.3254C20.8567 21.9405 21.9405 20.8567 23.3254 20.4366C23.9405 20.25 24.6965 20.25 26.2083 20.25"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseStudyVideo({
  videoRef,
  video,
  mockup,
  name,
  aspectClass,
  mode,
  onExpand,
  onTimeUpdate,
  onPlayingChange,
  onVideoError,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  video?: string;
  mockup: string;
  name: string;
  aspectClass: string;
  mode: PlayerMode;
  onExpand: () => void;
  onTimeUpdate: (progress: number) => void;
  onPlayingChange: (playing: boolean) => void;
  onVideoError: () => void;
}) {
  // A portrait clip at half the content width is taller than the viewport, which
  // would leave the pinned column nothing to scroll against, so inline portrait
  // is sized from its height and the width follows the aspect ratio.
  const portrait = aspectClass !== "aspect-video";
  const sizing =
    mode === "fullscreen"
      ? "max-h-full w-auto max-w-full"
      : mode === "mini"
        ? cn("w-full", aspectClass)
        : cn("w-full", aspectClass, portrait && "lg:h-[76vh] lg:w-auto");

  return (
    <div
      className={cn(
        "relative",
        mode === "inline" && portrait ? "mx-auto w-full lg:w-fit" : "w-full",
      )}
    >
      {video ? (
        <video
          // Remount on change so the new source actually loads and plays.
          key={video}
          ref={videoRef}
          src={video}
          className={cn(
            "mx-auto object-contain",
            mode === "mini" ? "rounded-xl" : "rounded-2xl",
            sizing,
          )}
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={(event) => {
            const el = event.currentTarget;
            onTimeUpdate(el.duration ? el.currentTime / el.duration : 0);
          }}
          onPlay={() => onPlayingChange(true)}
          onPause={() => onPlayingChange(false)}
          onError={onVideoError}
        />
      ) : (
        <img
          src={mockup}
          alt={`${name} app screenshot`}
          className="aspect-571/701 w-full object-cover"
        />
      )}

      {mode === "inline" && video && (
        <button
          type="button"
          onClick={onExpand}
          aria-label="Expand to fullscreen"
          className="absolute right-4 bottom-4 size-11 cursor-pointer transition-transform hover:scale-105 md:size-[60px]"
        >
          <ExpandGlyph />
        </button>
      )}
    </div>
  );
}
