"use client";

import Image from "next/image";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const REASONS = [
  {
    title: "Faster Setup",
    description: "Go live in hours, not weeks. No technical headaches.",
    illustration: "/images/home/why-switch-faster-setup.svg",
    accent: "#03A84E",
  },
  {
    title: "Smarter Automation",
    description:
      "Reduce repetitive support requests automatically with smart intent mapping.",
    illustration: "/images/home/why-switch-smarter-automation-v2.svg",
    accent: "#7F9FFF",
  },
  {
    title: "Simpler Operations",
    description: "No bloated workflows or unnecessary system complexity.",
    illustration: "/images/home/why-switch-simpler-operations.svg",
    accent: "#F2B035",
  },
  {
    title: "Predictable Growth",
    description:
      "Scale customer support without scaling operational hiring costs.",
    illustration: "/images/home/why-switch-predictable-growth-v2.svg",
    accent: "#6433CC",
  },
];

export function WhySwitchSection() {
  const cardsRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-360 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <span className="font-dm-mono w-fit rounded-full bg-[#F25430] px-4 py-1.5 text-sm text-white uppercase">
            Why Swift Agents
          </span>
          <p className="font-dm-mono text-2xl leading-normal font-medium text-[#1f1f1f] uppercase md:text-[32px]">
            Why Teams Move Beyond Traditional Support Platforms
          </p>
          <p className="font-stolzl text-base leading-relaxed text-black">
            Whether you&apos;re using Zendesk, Intercom, Freshworks, Tidio, or
            managing support manually, the challenge is the same: More customers
            create more conversations. More conversations create more support
            work. SwiftAgents helps you reduce that workload before it reaches
            your team.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-x-5 gap-y-26 pb-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="relative flex h-full flex-col rounded-xl border border-[#1f1f1f] bg-[#F6F4EF] drop-shadow-[-3px_4px_0px_#000000]"
            >
              <div className="flex flex-col gap-2 p-5 xl:p-6">
                <p className="font-dm-mono text-lg font-medium text-[#1f1f1f] uppercase">
                  {reason.title}
                </p>
                <p className="font-stolzl text-base text-black/60">
                  {reason.description}
                </p>
              </div>
              <div
                className="relative z-10 mx-5 mt-auto -mb-14 h-29 overflow-hidden rounded-lg border border-[#1f1f1f] xl:mx-6"
                style={{ backgroundColor: reason.accent }}
              >
                <Image
                  src={reason.illustration}
                  alt=""
                  fill
                  className="object-contain object-bottom p-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
