"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "1",
    title: "CONNECT YOUR\nKNOWLEDGE",
    description:
      "Upload your docs, FAQs, and website content. SwiftAgents indexes everything in minutes.",
    video: "/videos/how-it-works/01-connect-your-knowledge.mp4",
    accent: "#F2B035",
  },
  {
    number: "2",
    title: "TRAIN ON YOUR\nBUSINESS",
    description:
      "SwiftAgents learns your products, workflows, and policies so it can respond like your best support rep",
    video: "/videos/how-it-works/02-train-on-your-business.mp4",
    accent: "#03A84E",
  },
  {
    number: "3",
    title: "GO LIVE",
    description:
      "Start resolving customer inquiries across every support channel. Hours, not weeks.",
    video: "/videos/how-it-works/03-go-live.mp4",
    accent: "#F25430",
  },
];

function StepVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.load();
            video.play().catch(() => {});
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="none"
      className="h-full w-full object-cover object-top"
    />
  );
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-26">
      <div className="mx-auto max-w-360">
        {/* Header */}
        <div className="mb-8">
          <p className="font-dm-mono mb-4 text-base leading-[1.2] tracking-[10%] text-gray-400 uppercase md:text-lg">
            HOW IT WORKS
          </p>
          <h2 className="font-greed-narrow text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            FROM ZERO TO LIVE
            <br />
            IN HOURS
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr] md:items-stretch md:gap-4 lg:grid-cols-[460px_1fr] lg:gap-6">
          {/* Left — step cards */}
          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveStep(i)}
                style={
                  activeStep === i
                    ? ({ "--step-accent": step.accent } as React.CSSProperties)
                    : undefined
                }
                className={cn(
                  "cursor-default border border-black px-4 py-6 text-black transition-colors duration-200 md:px-5 md:py-7 lg:px-6 lg:py-8",
                  activeStep === i &&
                    "md:border-transparent md:bg-(--step-accent) md:text-white",
                )}
              >
                <div className="mb-4 flex items-start gap-4 md:gap-5 lg:gap-8">
                  <span className="font-greed-narrow h-fit shrink-0 text-4xl leading-none font-medium tracking-[-2%] uppercase md:text-[40px] lg:text-[66px]">
                    {step.number}
                  </span>
                  <span className="font-dm-mono text-xl leading-normal font-medium tracking-[10%] whitespace-pre-line uppercase md:text-2xl lg:text-[30px]">
                    {step.title}
                  </span>
                </div>

                <p
                  className={cn(
                    "font-stolzl text-sm leading-normal tracking-[2%] text-gray-600 md:text-base lg:text-lg",
                    activeStep === i && "md:text-gray-100",
                  )}
                >
                  {step.description}
                </p>

                {/* Mobile-only video — shown below description */}
                <div className="mt-6 w-full md:hidden">
                  <StepVideo src={step.video} />
                </div>
              </div>
            ))}
          </div>

          {/* Right — video panel (desktop only) */}
          <div className="relative hidden h-full min-h-0 overflow-hidden md:block">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 h-full w-full transition-opacity duration-300",
                  activeStep === i ? "opacity-100" : "opacity-0",
                )}
              >
                <StepVideo src={step.video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
