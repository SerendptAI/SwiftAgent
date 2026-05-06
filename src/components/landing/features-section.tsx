"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import BriggsAnimation from "@/components/briggs-face-animation";

gsap.registerPlugin(ScrollTrigger);

// ─── Agent data ───────────────────────────────────────────────
interface Agent {
  id: string;
  name: string;
  video: string;
  description: string;
}

const AGENTS: Agent[] = [
  {
    id: "047",
    name: "AGENT 047",
    video: "/videos/Agent 047.mp4",
    description:
      "AGENT 047 POSSESSES THE CAPABILITY TO LOCATE ANY FEATURE WITHIN A DASHBOARD FOR USERS, REGARDLESS OF THE DASHBOARD'S COMPLEXITY. THIS AGENT IS AWARE OF THE PRECISE LOCATION OF EACH FEATURE AND CAN PROVIDE DETAILED DIRECTIONS ALONG WITH SCREENSHOTS UPON REQUEST.",
  },
  {
    id: "007",
    name: "AGENT 007",
    video: "/videos/Agent 007.mp4",
    description:
      "AGENT 007 HAS THE ABILITY TO THOROUGHLY SEARCH AN ENTIRE WEBSITE TO RETRIEVE INFORMATION FOR CUSTOMERS WHEN THE ANSWER IS NOT AVAILABLE IN ITS DATABASE.",
  },
  {
    id: "626",
    name: "AGENT 626",
    video: "/videos/Agent 626.mp4",
    description:
      "AGENT 626 POSSESSES THE CAPABILITY TO ANALYZE CRYPTOCURRENCY TRANSACTIONS VIA HASHCODES AND INFORM USERS OF ANY POTENTIAL ISSUES THAT MAY ARISE DURING THE TRANSACTION PROCESS.",
  },
];

const AGENT_001: Agent = {
  id: "001",
  name: "AGENT 001",
  video: "/videos/Agent 001.mp4",
  description:
    "AGENT 001 REVIEWS BANK RECORDS AND UPDATES CUSTOMERS ON PAYMENT STATUSES, INCLUDING REFUND PROCESSES, BANK ACKNOWLEDGMENTS, AND ANY PAYMENT ISSUES.",
};

// ─── Agent Video — loads only when scrolled into view ─────────
function AgentVideo({ src }: { src: string }) {
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
      className="h-auto w-full object-cover"
    />
  );
}

// ─── Reusable Agent Card ──────────────────────────────────────
function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-col gap-4 max-md:mb-6">
      {/* Agent name */}
      <h3 className="font-dm-mono -mt-4.5 text-[24px] font-normal tracking-[0.2em] text-[#666666] uppercase md:mb-3 md:ml-10 md:text-3xl">
        {agent.name}
      </h3>

      {/* Agent video */}
      <div className="overflow-hidden">
        <AgentVideo src={agent.video} />
      </div>

      {/* Agent description */}
      <p className="font-dm-mono text-sm leading-[1.8] tracking-[0.08em] text-black/70 uppercase">
        {agent.description}
      </p>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────
export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      // Agent cards stagger
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
          },
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Bottom row entrance
      if (bottomRef.current) {
        gsap.from(bottomRef.current.children, {
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="relative overflow-hidden bg-white"
    >
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-14 md:py-24">
        {/* ── Section header ── */}
        <div
          ref={headerRef}
          className="mb-12 flex flex-col items-center gap-4 text-center"
        >
          {/* Label */}
          <span className="font-dm-mono text-xs tracking-[0.25em] text-black/50 uppercase">
            OUR AI AGENTS
          </span>

          {/* Headline */}
          <h2 className="font-greed-narrow max-w-3xl text-4xl leading-[1.1] font-black tracking-tight text-black uppercase md:text-6xl lg:text-7xl">
            OUR AGENTS ACCOMPLISH DIFFERENT FUNCTIONS
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* ── Decorative dashed lines (1-3) between agent cards and bottom row ── */}
        <div className="relative hidden h-[182px] lg:block">
          {/* Segment 1 — line1 (\): descending from upper-left */}
          <div className="absolute" style={{ left: "25%", top: 0 }}>
            <Image
              src="/images/lines/line1.svg"
              alt=""
              width={208}
              height={182}
              className="h-[182px] w-[208px]"
            />
          </div>

          {/* Segment 2 — line3 (/): ascending from lower-left to upper-right */}
          <div className="absolute" style={{ left: "48%", top: "8px" }}>
            <Image
              src="/images/lines/line2.svg"
              alt=""
              width={109}
              height={166}
              className="h-[166px] w-[109px]"
            />
          </div>

          {/* Segment 3 — line2 (\): steep descent from upper area */}
          <div className="absolute" style={{ left: "76%", top: 20 }}>
            <Image
              src="/images/lines/line3.svg"
              alt=""
              width={79}
              height={182}
              className="h-[182px] w-[79px]"
            />
          </div>
        </div>

        {/* ── Bottom row: Agent 001 + Quote ── */}
        <div
          ref={bottomRef}
          className="mt-16 flex flex-col justify-between gap-8 lg:flex-row lg:gap-12"
        >
          {/* Agent 001 card */}
          <div className="w-full lg:w-[35%]">
            <AgentCard agent={AGENT_001} />
          </div>

          {/* Quote block — icon floats inline within the text */}
          <div className="w-full max-md:hidden lg:w-[50%]">
            <h3 className="font-greed-narrow text-3xl leading-[1.15] font-black tracking-tight text-black uppercase md:text-5xl lg:text-6xl">
              ALL THESE AGENTS PLAY A
              <br /> CRUCIAL ROLE IN
              <br />
              ENHANCING THE <br />
              CUSTOMER EXPERIENCE DURING LIVE CHATS.
            </h3>
            <div className="absolute bottom-30 -left-20">
              <Image
                src="/images/lines/line4.svg"
                alt=""
                width={230}
                height={154}
                className="h-[154px] w-[230px]"
              />
            </div>
            <div className="absolute top-15 right-10">
              <BriggsAnimation className="h-[124px] w-[150px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
