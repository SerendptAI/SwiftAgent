"use client";

import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  CaseStudyVideo,
  DockedPlayer,
  type PlayerMode,
  PlayGlyph,
  ProgressDisc,
} from "@/components/landing/case-study-player";
import type { CaseStudy } from "@/lib/case-studies";
import { DEFAULT_ACCENT_COLOR, getCaseStudyPath } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

/**
 * On mobile every block is a flex sibling so the clip can sit between the use
 * cases; the text column keeps an order past any the clip can take, which puts
 * the clip on the left once the column collapses back into a single box at lg.
 */
const TEXT_COLUMN_ORDER = 99;

/**
 * Shared look for the copy that partners author as markup — use case bodies and
 * the sign-off. Tailwind's preflight strips list markers, so `ul` opts back in;
 * `blockquote` is the stack of example prompts a user would type.
 */
const RICH_TEXT = cn(
  "font-stolzl text-base leading-[1.76] tracking-[2%] text-black md:text-lg",
  "[&_p+p]:mt-3",
  "[&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul+p]:mt-3 [&_li]:mt-1",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-black/15 [&_blockquote]:pl-4",
  "[&_blockquote_p+p]:mt-1",
);

function ShareIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z"
        stroke="black"
        strokeWidth="1.5"
      />
      <path
        d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z"
        stroke="black"
        strokeWidth="1.5"
      />
      <path
        d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z"
        stroke="black"
        strokeWidth="1.5"
      />
      <path
        d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495"
        stroke="black"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ShareButton({ caseStudyId }: { caseStudyId: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${getCaseStudyPath(caseStudyId)}`,
      );
      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing to do
    }
  };

  return (
    <button
      aria-label={copied ? "Link copied" : "Copy case study link"}
      onClick={handleShare}
      className="mt-1 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#EDEDED] transition-all duration-200 hover:bg-[#EDEDED]"
    >
      {copied ? <Check className="h-5 w-5 text-black" /> : <ShareIcon />}
    </button>
  );
}

export function CaseStudyDetail({
  caseStudy,
  showFullCaseStudyLink = false,
}: {
  caseStudy: CaseStudy;
  showFullCaseStudyLink?: boolean;
}) {
  const t = useTranslations("common.caseStudies");
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [unplayableVideo, setUnplayableVideo] = useState<string | null>(null);
  const [mode, setMode] = useState<PlayerMode>("inline");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [miniDismissed, setMiniDismissed] = useState(false);

  /** Whether the in-page clip has been scrolled past. */
  const [scrolledPast, setScrolledPast] = useState(false);

  /**
   * Going fullscreen lifts the clip out of the layout, which would shorten the
   * page under the reader; the slot holds the height it had so returning lands
   * on the same scroll position.
   */
  const [reservedHeight, setReservedHeight] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const active = caseStudy.useCases[activeUseCase];
  const activeVideo = active?.video;
  const isVideoPlayable =
    Boolean(activeVideo) && activeVideo !== unplayableVideo;
  const aspectClass = caseStudy.videoAspect ?? "aspect-video";

  const showDocked =
    scrolledPast &&
    mode === "inline" &&
    playing &&
    !miniDismissed &&
    isVideoPlayable;

  const enterFullscreen = useCallback(() => {
    setReservedHeight(slotRef.current?.getBoundingClientRect().height ?? null);
    setMode("fullscreen");
  }, []);

  const exitFullscreen = useCallback(() => {
    setReservedHeight(null);
    setMode("inline");
  }, []);

  const selectUseCase = (index: number) => {
    if (index === activeUseCase) {
      const el = videoRef.current;
      if (!el) return;
      if (el.paused) void el.play();
      else el.pause();
      return;
    }
    setActiveUseCase(index);
    setProgress(0);
    setMiniDismissed(false);
  };

  // timeupdate fires many times a second; re-rendering the whole page for a
  // ring that is 40px wide is what makes scrolling stutter, so sub-half-percent
  // moves bail out of the render entirely.
  const handleTimeUpdate = useCallback((next: number) => {
    setProgress((prev) => (Math.abs(next - prev) < 0.005 ? prev : next));
  }, []);

  /**
   * A zero-height marker at the top of the slot, rather than the slot itself,
   * so the crossing stays clean even when the clip is taller than the viewport.
   */
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPast(!entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px" },
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  const returnToClip = useCallback(() => {
    slotRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    if (mode !== "fullscreen") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") exitFullscreen();
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [mode, exitFullscreen]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-18">
      {/* Pinned beside the list so the clip stays put while the use cases scroll. */}
      <div
        ref={slotRef}
        style={{
          order: activeUseCase * 2 + 3,
          height: reservedHeight ?? undefined,
        }}
        className={cn(
          "lg:w-1/2 lg:shrink-0 lg:self-start",
          // Sticky positioning creates a stacking context, which would trap the
          // detached player underneath the navbar and the use-case list, so the
          // pin only applies while the player is actually in the page.
          mode === "inline" && "lg:sticky lg:top-36",
        )}
      >
        <div ref={markerRef} aria-hidden className="h-px w-full" />
        <div
          className={cn(
            mode === "inline" && "relative",
            // Above the navbar, which sits at z-100.
            mode === "fullscreen" &&
              "fixed inset-0 z-200 flex flex-col items-center justify-center gap-5 bg-black px-4 py-16 md:px-8",
          )}
        >
          {mode === "fullscreen" && (
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 md:px-9">
              <p className="font-dm-mono truncate pr-4 text-xs font-medium tracking-[10%] text-white uppercase md:text-[15px]">
                {active?.title}
              </p>
              <button
                type="button"
                onClick={exitFullscreen}
                aria-label="Exit fullscreen"
                className="shrink-0 cursor-pointer text-white transition-opacity hover:opacity-70"
              >
                <ChevronDown className="size-8 md:size-10" />
              </button>
            </div>
          )}

          {/* 557px matches the device in the design, and lines the clip up with
              the control bar below it. */}
          <div
            className={cn(
              mode === "fullscreen" &&
                "flex min-h-0 w-full max-w-[557px] flex-1 items-center justify-center",
            )}
          >
            <CaseStudyVideo
              videoRef={videoRef}
              video={isVideoPlayable ? activeVideo : undefined}
              mockup={caseStudy.mockup}
              name={caseStudy.name}
              aspectClass={aspectClass}
              mode={mode}
              onExpand={enterFullscreen}
              onTimeUpdate={handleTimeUpdate}
              onPlayingChange={setPlaying}
              onVideoError={() => setUnplayableVideo(activeVideo ?? null)}
            />
          </div>

          {mode === "fullscreen" && (
            <button
              type="button"
              onClick={exitFullscreen}
              className="flex w-full max-w-[557px] shrink-0 cursor-pointer items-center gap-3 rounded-[10px] border border-black bg-[#F6F4EF] px-3 py-2 text-left shadow-[-3px_4px_0px_0px_#000000]"
            >
              <ProgressDisc
                playing={playing}
                progress={progress}
                accentColor={DEFAULT_ACCENT_COLOR}
              />
              <span className="font-dm-mono truncate text-sm font-medium tracking-[10%] text-black uppercase md:text-xl">
                {active?.title}
              </span>
              <ChevronDown className="ml-auto size-6 shrink-0 text-black md:size-8" />
            </button>
          )}
        </div>
      </div>

      {showDocked && activeVideo && (
        <DockedPlayer
          video={activeVideo}
          sourceRef={videoRef}
          playing={playing}
          progress={progress}
          accentColor={DEFAULT_ACCENT_COLOR}
          onReturn={returnToClip}
          onClose={() => setMiniDismissed(true)}
        />
      )}

      <div
        style={{ order: TEXT_COLUMN_ORDER }}
        className="contents lg:block lg:w-1/2"
      >
        <div className="order-1 flex flex-col justify-start">
          <div className="mb-6 flex items-center gap-6">
            <h3 className="font-greed-narrow text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase sm:text-5xl md:text-[56px] lg:text-[66px]">
              {caseStudy.name}
            </h3>
            <ShareButton caseStudyId={caseStudy.id} />
          </div>

          <div
            className="font-stolzl mb-8 text-sm leading-[1.66] tracking-[2%] text-black/80 md:text-base lg:text-lg"
            dangerouslySetInnerHTML={{ __html: caseStudy.description }}
          />

          <p className="font-dm-mono text-base leading-[1.2] font-medium tracking-[10%] text-black uppercase md:text-lg">
            {t("howWeHelp")}
          </p>
        </div>

        {caseStudy.useCases.map((useCase, index) => {
          const isActive = activeUseCase === index;

          return (
            <div
              key={useCase.title}
              style={{ order: (index + 1) * 2 }}
              className="lg:mt-8"
            >
              <button
                type="button"
                onClick={() => selectUseCase(index)}
                disabled={!useCase.video}
                aria-pressed={isActive}
                className={cn(
                  "mb-4 flex w-full items-center gap-3 rounded-[10px] border border-black bg-[#F6F4EF] px-3 py-2 text-left transition-transform md:mb-6",
                  useCase.video
                    ? "cursor-pointer hover:translate-x-[-1px] hover:translate-y-[1px]"
                    : "cursor-default",
                  isActive
                    ? "shadow-[-1px_2px_0px_0px_#000000]"
                    : "shadow-[-3px_4px_0px_0px_#000000]",
                )}
              >
                {isActive && isVideoPlayable ? (
                  <ProgressDisc
                    playing={playing}
                    progress={progress}
                    accentColor={DEFAULT_ACCENT_COLOR}
                  />
                ) : (
                  <PlayGlyph className="mx-2.5 h-[26px] w-[22px] text-black" />
                )}
                <span className="font-dm-mono text-sm font-medium tracking-[10%] text-black uppercase md:text-base lg:text-lg">
                  {useCase.title}
                </span>
              </button>
              <div
                className={cn(RICH_TEXT, "px-1")}
                dangerouslySetInnerHTML={{ __html: useCase.description }}
              />
            </div>
          );
        })}

        {caseStudy.closing && (
          <div
            style={{ order: (caseStudy.useCases.length + 1) * 2 }}
            className={cn(RICH_TEXT, "px-1 lg:mt-8")}
            dangerouslySetInnerHTML={{ __html: caseStudy.closing }}
          />
        )}

        {showFullCaseStudyLink && (
          <div
            style={{ order: (caseStudy.useCases.length + 2) * 2 }}
            className="lg:mt-8"
          >
            <Link
              href={getCaseStudyPath(caseStudy.id)}
              className="font-dm-mono ml-1 flex w-fit items-center gap-3 rounded-[10px] border border-black bg-[#F6F4EF] px-4 py-2.5 text-sm font-medium tracking-[10%] text-black uppercase shadow-[-3px_4px_0px_0px_#000000] transition-transform hover:translate-x-[-1px] hover:translate-y-[1px] hover:shadow-[-2px_3px_0px_0px_#000000] md:text-base"
            >
              View full case study →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
