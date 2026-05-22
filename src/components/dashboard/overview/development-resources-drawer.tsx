"use client";

import { ChevronDown, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";

const DRAWER_TRANSITION_MS = 520;

const VIDEOS = [
  "How to login",
  "How to register account",
  "How to create widget",
  "Set up your account",
  "Personalize settings",
  "Link a card",
  "Invite a teammate",
  "Read visitor activity",
  "Manage conversations",
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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const contentMaxWidthClass = "max-w-[1240px]";

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

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
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
        className="development-resources-sheet relative flex h-[90vh] w-full flex-col overflow-hidden bg-white shadow-[0_-20px_70px_rgba(0,0,0,0.18)] will-change-transform"
        style={{
          animation: `${
            isClosing
              ? "development-resources-drawer-out"
              : "development-resources-drawer-in"
          } ${DRAWER_TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-[34px] z-10 px-6 md:px-10">
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
              className="font-dm-mono pointer-events-auto flex w-fit cursor-pointer items-center gap-3 rounded-full bg-white px-3 py-1 text-xs leading-none tracking-[0.08em] text-black/50 uppercase transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:text-sm"
            >
              <Icons.leftArrow className="h-auto w-6 stroke-2 text-black" />
              {selectedVideo ? "Back to Development Resources" : "Back"}
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-[76px] pb-16 md:px-10">
          <div
            className={`mx-auto flex w-full flex-col ${contentMaxWidthClass}`}
          >
            <header className="flex justify-center text-center">
              <h2
                id="development-resources-title"
                className={`font-greed-narrow text-center leading-[0.95] font-medium tracking-[-0.02em] text-black uppercase ${
                  selectedVideo ? "mt-[86px] text-[42px]" : "text-[34px]"
                }`}
              >
                {selectedVideo ?? "Development Resources"}
              </h2>
            </header>

            {selectedVideo ? (
              <div className="mt-[70px]">
                <button
                  type="button"
                  aria-label={`Play ${selectedVideo}`}
                  className="group relative h-[656px] w-full overflow-hidden bg-[#373737] text-left focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
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
                    <span className="flex h-25 w-25 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-105">
                      <Play className="h-9 w-9 fill-black text-black" />
                    </span>
                  </span>
                </button>
              </div>
            ) : (
              <>
                <div className="mt-[66px]">
                  <button
                    type="button"
                    aria-controls="development-resources-tutorial-videos"
                    aria-expanded={isTutorialVideosExpanded}
                    onClick={() =>
                      setIsTutorialVideosExpanded((isExpanded) => !isExpanded)
                    }
                    className="font-dm-mono inline-flex h-16 cursor-pointer items-center gap-5 rounded-full bg-[#F4F4F4] pr-8 pl-3 text-lg leading-none tracking-[0.08em] text-black uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9]">
                      <ChevronDown
                        className={`h-6 w-6 transition-transform duration-200 ${
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
                    className="mt-[42px] grid grid-cols-1 gap-x-[72px] gap-y-[54px] sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {VIDEOS.map((title, index) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => setSelectedVideo(title)}
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
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-105">
                              <Play className="h-7 w-7 fill-black text-black" />
                            </span>
                          </span>
                        </div>
                        <h3 className="font-dm-mono mt-[22px] text-xl leading-none font-medium text-black uppercase">
                          {title}
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
