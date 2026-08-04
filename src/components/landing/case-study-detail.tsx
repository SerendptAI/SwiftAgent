/* eslint-disable @next/next/no-img-element */
"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { CaseStudy } from "@/lib/case-studies";
import { getCaseStudyPath } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

function PlayIcon() {
  return (
    <svg
      width="18"
      height="21"
      viewBox="0 0 18 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M15.7521 7.89537C17.5345 9.08271 17.5345 11.7015 15.7521 12.8888L4.66325 20.2759C2.66952 21.6041 0 20.1748 0 17.7792V3.00496C0 0.609334 2.66952 -0.819931 4.66325 0.50824L15.7521 7.89537Z"
        fill="black"
      />
    </svg>
  );
}

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
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [unplayableVideo, setUnplayableVideo] = useState<string | null>(null);

  const activeVideo = caseStudy.useCases[activeUseCase]?.video;
  const isVideoPlayable =
    Boolean(activeVideo) && activeVideo !== unplayableVideo;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-18">
      {/*
        Landscape clips are far shorter than the use case list beside them, so
        the player is centred in its column rather than pinned to the top —
        otherwise the leftover height all pools underneath it.
      */}
      <div className="flex flex-col justify-center">
        {isVideoPlayable ? (
          <video
            // Remount on change so the new source actually loads and plays.
            key={activeVideo}
            src={activeVideo}
            className={`w-full rounded-2xl bg-black object-contain ${caseStudy.videoAspect ?? "aspect-video"}`}
            controls
            autoPlay
            loop
            muted
            playsInline
            onError={() => setUnplayableVideo(activeVideo ?? null)}
          />
        ) : (
          <img
            src={caseStudy.mockup}
            alt={`${caseStudy.name} app screenshot`}
            className="aspect-571/701 w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col justify-start">
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

        <p className="font-dm-mono mb-7 text-base leading-[1.2] font-medium tracking-[10%] text-black uppercase md:text-lg">
          HOW WE HELP?
        </p>
        <div className="flex flex-col gap-6 md:gap-8">
          {caseStudy.useCases.map((useCase, index) => {
            const isPlaying = activeUseCase === index && isVideoPlayable;

            return (
              <div key={useCase.title}>
                <button
                  type="button"
                  onClick={() => setActiveUseCase(index)}
                  disabled={!useCase.video}
                  aria-pressed={isPlaying}
                  className={cn(
                    "mb-4 flex w-fit items-center gap-3 rounded-[10px] border border-black bg-[#F6F4EF] px-4 py-3 text-left transition-transform md:mb-6",
                    useCase.video
                      ? "cursor-pointer hover:translate-x-[-1px] hover:translate-y-[1px]"
                      : "cursor-default",
                    isPlaying
                      ? "shadow-[-1px_1px_0px_0px_#000000]"
                      : "shadow-[-3px_3px_0px_0px_#000000]",
                  )}
                >
                  <PlayIcon />
                  <span className="font-dm-mono text-base font-medium tracking-[10%] text-black uppercase md:text-lg lg:text-xl">
                    {useCase.title}
                  </span>
                </button>
                <p className="font-stolzl px-1 text-base leading-[1.76] tracking-[2%] text-black md:text-lg">
                  {useCase.description}
                </p>
              </div>
            );
          })}
        </div>

        {showFullCaseStudyLink && (
          <Link
            href={getCaseStudyPath(caseStudy.id)}
            className="font-dm-mono mt-10 ml-1 flex w-fit items-center gap-3 rounded-[10px] border border-black bg-[#F6F4EF] px-4 py-2.5 text-sm font-medium tracking-[10%] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-transform hover:translate-x-[-1px] hover:translate-y-[1px] hover:shadow-[-2px_2px_0px_0px_#000000] md:text-base"
          >
            View full case study →
          </Link>
        )}
      </div>
    </div>
  );
}
