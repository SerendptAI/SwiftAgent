"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "1",
    title: "CONNECT YOUR\nKNOWLEDGE",
    description:
      "Upload your docs, FAQs, and website content. SwiftAgents indexes everything in minutes.",
    image: "/images/how-it-works/1.svg",
    accent: "#F2B035",
  },
  {
    number: "2",
    title: "TRAIN ON YOUR\nBUSINESS",
    description:
      "SwiftAgents learns your products, workflows, and policies so it can respond like your best support rep",
    image: "/images/how-it-works/2.svg",
    accent: "#03A84E",
  },
  {
    number: "3",
    title: "GO LIVE",
    description:
      "Start resolving customer inquiries across every support channel. Hours, not weeks.",
    image: "/images/how-it-works/3.svg",
    accent: "#F25430",
  },
];

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[460px_1fr] md:gap-4 lg:gap-6">
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
                  "cursor-default border border-black px-6 py-8 text-black transition-colors duration-200",
                  activeStep === i &&
                    "md:border-transparent md:bg-[var(--step-accent)] md:text-white",
                )}
              >
                <div className="mb-4 flex items-start gap-4 md:gap-8">
                  <span className="font-greed-narrow h-fit shrink-0 text-4xl leading-none font-medium tracking-[-2%] uppercase md:text-5xl lg:text-[66px]">
                    {step.number}
                  </span>
                  <span className="font-dm-mono text-2xl leading-normal font-medium tracking-[10%] whitespace-pre-line uppercase md:text-[30px]">
                    {step.title}
                  </span>
                </div>

                <p
                  className={cn(
                    "font-stolzl text-base leading-normal tracking-[2%] text-gray-600 md:text-lg",
                    activeStep === i && "md:text-gray-100",
                  )}
                >
                  {step.description}
                </p>

                {/* Mobile-only image — shown below description */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={`Step ${step.number} illustration`}
                  className="mt-6 w-full object-cover md:hidden"
                />
              </div>
            ))}
          </div>

          {/* Right — illustration panel */}
          <div className="relative hidden overflow-hidden md:block">
            {STEPS.map((step, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={step.image}
                alt={`Step ${step.number} illustration`}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                  activeStep === i ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
