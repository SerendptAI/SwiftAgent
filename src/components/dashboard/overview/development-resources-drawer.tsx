"use client";

import { ChevronDown, Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { videoPosterUrl, videoUrl } from "@/lib/cloudinary";

const DRAWER_TRANSITION_MS = 520;

/**
 * Grouping the file with its poster and caption track keeps a recording whose
 * pieces have drifted apart unrepresentable — the clips are silent, so the
 * track is the only way the content reaches a screen reader, and the poster is
 * the only thing on the card that says what the clip shows.
 */
interface TutorialRecording {
  src: string;
  poster: string;
  captions: string;
}

/** A tutorial with no `recording` has not been shot yet: it reads "coming soon". */
interface TutorialVideo {
  title: string;
  recording?: TutorialRecording;
}

type RecordedTutorial = TutorialVideo & { recording: TutorialRecording };

/** One id drives the clip, the still cut from it, and its caption track. */
function recordingFor(id: string): TutorialRecording {
  return {
    src: videoUrl(`tutorials/${id}`),
    poster: videoPosterUrl(`tutorials/${id}`),
    captions: `/videos/tutorials/${id}.en.vtt`,
  };
}

const VIDEOS: TutorialVideo[] = [
  { title: "How to login", recording: recordingFor("how-to-login") },
  {
    title: "How to register account",
    recording: recordingFor("how-to-register"),
  },
  {
    title: "How to create widget",
    recording: recordingFor("how-to-create-widget"),
  },
  {
    title: "Set up your account",
    recording: recordingFor("setup-your-account"),
  },
  { title: "Personalize settings" },
  { title: "Link a card" },
  { title: "Invite a teammate" },
  { title: "Read visitor activity" },
  { title: "Manage conversations" },
];

export function DevelopmentResourcesDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isMounted, setIsMounted] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [isTutorialVideosExpanded, setIsTutorialVideosExpanded] =
    useState(true);
  const [selectedVideo, setSelectedVideo] = useState<RecordedTutorial | null>(
    null,
  );
  const closeTimeoutRef = useRef<number | null>(null);
  const contentMaxWidthClass = "max-w-[1240px]";
  useScrollLock(isMounted);

  const closeDrawer = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setSelectedVideo(null);
      setIsMounted(false);
      onClose();
      closeTimeoutRef.current = null;
    }, DRAWER_TRANSITION_MS);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setIsMounted(true);
    setIsClosing(false);
    setSelectedVideo(null);
    setIsTutorialVideosExpanded(true);
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open) return;

    setIsClosing(true);
    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, DRAWER_TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDrawer, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-end" role="presentation">
      <button
        type="button"
        aria-label="Close development resources"
        className="development-resources-overlay absolute inset-0 cursor-default bg-black/65"
        style={{
          animation: `${
            isClosing
              ? "development-resources-overlay-out"
              : "development-resources-overlay-in"
          } ${DRAWER_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
        }}
        onClick={closeDrawer}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="development-resources-title"
        className="development-resources-sheet relative flex h-[calc(100svh-1rem)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-20px_70px_rgba(0,0,0,0.18)] will-change-transform md:h-[90vh] md:rounded-t-none"
        style={{
          animation: `${
            isClosing
              ? "development-resources-drawer-out"
              : "development-resources-drawer-in"
          } ${DRAWER_TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 px-4 md:top-[34px] md:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            <button
              type="button"
              onClick={() => {
                if (selectedVideo) {
                  setSelectedVideo(null);
                  return;
                }

                closeDrawer();
              }}
              className="font-dm-mono pointer-events-auto flex min-h-10 w-fit max-w-full cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-1 text-xs leading-none tracking-[0.08em] text-black/60 uppercase shadow-sm transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:min-h-0 md:gap-3 md:text-sm md:shadow-none"
            >
              <Icons.leftArrow className="h-auto w-5 shrink-0 stroke-2 text-black md:w-6" />
              <span className="truncate">
                {selectedVideo ? "Back to Development Resources" : "Back"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-18 pb-[calc(2rem+env(safe-area-inset-bottom))] md:px-10 md:pt-[76px] md:pb-16">
          <div
            className={`mx-auto flex w-full flex-col ${contentMaxWidthClass}`}
          >
            <header className="flex justify-center text-center">
              <h2
                id="development-resources-title"
                className={`font-greed-narrow max-w-full text-center leading-[0.95] font-medium text-black uppercase ${
                  selectedVideo
                    ? "mt-10 text-[30px] md:mt-[86px] md:text-[42px]"
                    : "text-[30px] md:text-[34px]"
                }`}
              >
                {selectedVideo?.title ?? "Development Resources"}
              </h2>
            </header>

            {selectedVideo ? (
              <div className="mt-8 md:mt-[70px]">
                <video
                  key={selectedVideo.recording.src}
                  src={selectedVideo.recording.src}
                  poster={selectedVideo.recording.poster}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full bg-black md:h-[656px]"
                >
                  <track
                    kind="captions"
                    srcLang="en"
                    label="English"
                    src={selectedVideo.recording.captions}
                    default
                  />
                </video>
              </div>
            ) : (
              <>
                <div className="mt-8 md:mt-[66px]">
                  <button
                    type="button"
                    aria-controls="development-resources-tutorial-videos"
                    aria-expanded={isTutorialVideosExpanded}
                    onClick={() =>
                      setIsTutorialVideosExpanded((isExpanded) => !isExpanded)
                    }
                    className="font-dm-mono inline-flex h-13 cursor-pointer items-center gap-3 rounded-full bg-[#F4F4F4] pr-5 pl-2 text-sm leading-none tracking-[0.08em] text-black uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:h-16 md:gap-5 md:pr-8 md:pl-3 md:text-lg"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E9E9E9] md:h-12 md:w-12">
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 md:h-6 md:w-6 ${
                          isTutorialVideosExpanded ? "" : "-rotate-90"
                        }`}
                        strokeWidth={1.8}
                      />
                    </span>
                    Tutorial Videos
                  </button>
                </div>

                {isTutorialVideosExpanded && (
                  <div
                    id="development-resources-tutorial-videos"
                    className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 md:mt-[42px] md:gap-x-[72px] md:gap-y-[54px] xl:grid-cols-3"
                  >
                    {VIDEOS.map(({ title, recording }) =>
                      recording ? (
                        <button
                          key={title}
                          type="button"
                          onClick={() => setSelectedVideo({ title, recording })}
                          className="group text-left focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
                        >
                          <div className="relative aspect-365/195 w-full overflow-hidden bg-[#F4F4F4]">
                            <Image
                              src={recording.poster}
                              alt=""
                              fill
                              sizes="(min-width: 1280px) 365px, (min-width: 640px) 45vw, 92vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/20">
                              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105 md:h-16 md:w-16">
                                <Play className="h-5 w-5 fill-black text-black md:h-7 md:w-7" />
                              </span>
                            </span>
                          </div>
                          <h3 className="font-dm-mono mt-3 text-base leading-tight font-medium text-black uppercase md:mt-[22px] md:text-xl md:leading-none">
                            {title}
                          </h3>
                        </button>
                      ) : (
                        <div key={title} className="text-left">
                          <div className="flex aspect-365/195 w-full items-center justify-center border border-black/8 bg-[#F4F4F4]">
                            <span className="font-dm-mono text-xs leading-none tracking-[0.08em] text-black/40 uppercase md:text-sm">
                              Coming soon
                            </span>
                          </div>
                          <h3 className="font-dm-mono mt-3 text-base leading-tight font-medium text-black/40 uppercase md:mt-[22px] md:text-xl md:leading-none">
                            {title}
                          </h3>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
