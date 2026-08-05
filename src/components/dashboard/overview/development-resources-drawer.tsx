"use client";

import { ChevronDown, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { useScrollLock } from "@/hooks/use-scroll-lock";

const DRAWER_TRANSITION_MS = 520;

/**
 * A tutorial with no `recording` has not been made yet and shows the
 * placeholder. Pairing the file with its caption track in one object keeps an
 * uncaptioned video unrepresentable — the clips are silent, so the track is
 * the only way the content reaches a screen reader.
 */
interface TutorialVideo {
  title: string;
  recording?: { src: string; captions: string };
}

const VIDEOS: TutorialVideo[] = [
  {
    title: "How to login",
    recording: {
      src: "/videos/tutorials/how-to-login.mp4",
      captions: "/videos/tutorials/how-to-login.en.vtt",
    },
  },
  {
    title: "How to register account",
    recording: {
      src: "/videos/tutorials/how-to-register.mp4",
      captions: "/videos/tutorials/how-to-register.en.vtt",
    },
  },
  { title: "How to create widget" },
  { title: "Set up your account" },
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
  const [selectedVideo, setSelectedVideo] = useState<TutorialVideo | null>(
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
                {selectedVideo.recording ? (
                  <video
                    key={selectedVideo.recording.src}
                    src={selectedVideo.recording.src}
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
                ) : (
                  <button
                    type="button"
                    aria-label={`Play ${selectedVideo.title}`}
                    className="group relative aspect-video w-full overflow-hidden bg-[#373737] text-left focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black md:h-[656px]"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.18)_34%,rgba(210,210,210,0.72)_34%,rgba(210,210,210,0.72)_66%,rgba(0,0,0,0.18)_66%,rgba(0,0,0,0.18)_100%)]" />
                    <div className="absolute inset-0 bg-black/28" />
                    <div className="absolute top-0 left-[37%] h-full w-[26%] bg-[#C9C9C9]" />
                    <div className="absolute top-0 left-[37%] h-[5.5%] w-[26%] bg-[#BDBDBD]" />
                    <div className="absolute top-[1%] left-[38.8%] h-[3.6%] w-[2.3%] bg-[#B58A24]" />
                    <div className="absolute top-[2%] left-[41.7%] h-[1.8%] w-[9%] bg-black/50" />
                    <div className="absolute top-[2%] right-[39.2%] h-[1.6%] w-[1.2%] rotate-45 border-r-2 border-b-2 border-black/60" />
                    <div className="absolute top-[12.6%] left-[38.8%] h-[6.8%] w-[17.5%] rounded-[26px] bg-[#B9C8D8]" />
                    <div className="absolute top-[13.8%] left-[39.9%] h-[1.2%] w-[12%] rounded-full bg-[#0058BA]/60" />
                    <div className="absolute top-[16.5%] left-[39.9%] h-[1.2%] w-[13%] rounded-full bg-[#0058BA]/60" />
                    <div className="absolute top-[22.6%] left-[38.9%] h-[5%] w-[15.5%] border border-black/10 bg-white/12" />
                    <div className="absolute top-[30.5%] left-[38.9%] h-[5%] w-[15.5%] border border-black/10 bg-white/12" />
                    <div className="absolute top-[14%] left-[22%] h-[71%] w-[18%] rounded-[18px] border border-black/10 bg-white/8" />
                    <div className="absolute top-[14%] right-[16%] h-[12%] w-[17%] rounded-[16px] bg-white/6" />
                    <div className="absolute right-[12%] bottom-[15%] h-[14%] w-[23%] rounded-[18px] bg-white/6" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-105 md:h-25 md:w-25">
                        <Play className="h-7 w-7 fill-black text-black md:h-9 md:w-9" />
                      </span>
                    </span>
                  </button>
                )}
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
                    {VIDEOS.map((video, index) => (
                      <button
                        key={video.title}
                        type="button"
                        onClick={() => setSelectedVideo(video)}
                        className="group text-left focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
                      >
                        <div className="relative aspect-365/195 w-full overflow-hidden bg-[#343434]">
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.44)_0%,rgba(0,0,0,0.32)_34%,rgba(225,225,225,0.28)_34%,rgba(225,225,225,0.28)_62%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0.48)_100%)]" />
                          <div className="absolute top-0 left-[2.2%] h-0.5 w-8 bg-[#B58A24]" />
                          <div className="absolute top-[5%] left-[40%] h-[88%] w-[20%] bg-[#C8C8C8]/85" />
                          <div className="absolute top-[13%] left-[43%] h-5 w-[14%] rounded bg-[#BFD6F0]/55" />
                          <div className="absolute bottom-[9%] left-[34%] h-2 w-[40%] rounded bg-[#0058BA]/70" />
                          <div
                            className="absolute inset-0 bg-black/30"
                            style={{ opacity: index % 3 === 1 ? 0.18 : 0.26 }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-105 md:h-16 md:w-16">
                              <Play className="h-5 w-5 fill-black text-black md:h-7 md:w-7" />
                            </span>
                          </span>
                        </div>
                        <h3 className="font-dm-mono mt-3 text-base leading-tight font-medium text-black uppercase md:mt-[22px] md:text-xl md:leading-none">
                          {video.title}
                        </h3>
                      </button>
                    ))}
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
