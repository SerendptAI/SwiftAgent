"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import BriggsAnimation from "@/components/briggs-face-animation";
import { useInViewAutoplay } from "@/hooks/use-in-view-autoplay";
import { videoUrl } from "@/lib/cloudinary";

gsap.registerPlugin(ScrollTrigger);

// ─── Agent data ───────────────────────────────────────────────
/** Names and descriptions live in the `agents.list` catalogue, keyed by id. */
interface Agent {
  id: string;
  video: string;
}

const AGENTS: Agent[] = [
  { id: "047", video: videoUrl("agent-047") },
  { id: "007", video: videoUrl("agent-007") },
  { id: "626", video: videoUrl("agent-626") },
];

const AGENT_001: Agent = { id: "001", video: videoUrl("agent-001") };

// ─── Agent Video — loads only when scrolled into view ─────────
function AgentVideo({ src }: { src: string }) {
  const videoRef = useInViewAutoplay();

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="none"
      className="aspect-420/496 h-auto w-full object-cover object-center"
    />
  );
}

// ─── Reusable Agent Card ──────────────────────────────────────
function AgentCard({ agent }: { agent: Agent }) {
  const t = useTranslations("agents.list");

  return (
    <div className="flex flex-col gap-4 max-md:mb-6">
      <h3 className="font-dm-mono text-xl font-normal tracking-[0.2em] text-black/40 uppercase md:mb-2 md:text-2xl lg:text-3xl xl:text-4xl">
        {t(`${agent.id}.name`)}
      </h3>

      <div className="flex aspect-420/496 items-center justify-center overflow-hidden">
        <AgentVideo src={agent.video} />
      </div>

      <p className="font-dm-mono w-[90%] text-sm leading-relaxed tracking-[8%] text-black/80 uppercase md:text-base">
        {t(`${agent.id}.description`)}
      </p>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────
export function FeaturesSection() {
  const t = useTranslations("agents");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      className="relative flex overflow-hidden bg-white px-6 pt-44 pb-12 md:px-10 md:pt-50 lg:px-16 lg:pt-56"
    >
      <div className="relative mx-auto max-w-360">
        {/* ── Section header ── */}
        <div
          ref={headerRef}
          className="mb-10 flex flex-col gap-4 md:mb-14 lg:mb-18"
        >
          <span className="font-dm-mono text-base leading-[1.2] tracking-[10%] text-gray-400 uppercase md:text-lg lg:text-xl">
            {t("eyebrow")}
          </span>

          <h2 className="font-greed-narrow w-full max-w-2xl text-4xl leading-[1.34] font-medium tracking-[-2%] text-black uppercase md:text-5xl lg:text-[66px]">
            {t("heading")}
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
              src="/images/lines/line1.png"
              alt=""
              width={208}
              height={182}
              className="h-[182px] w-[208px] object-contain"
            />
          </div>

          {/* Segment 2 — line3 (/): ascending from lower-left to upper-right */}
          <div className="absolute" style={{ left: "48%", top: "8px" }}>
            <Image
              src="/images/lines/line2.png"
              alt=""
              width={109}
              height={166}
              className="h-[166px] w-[109px] object-contain"
            />
          </div>

          {/* Segment 3 — line2 (\): steep descent from upper area */}
          <div className="absolute" style={{ left: "76%", top: 20 }}>
            <Image
              src="/images/lines/line3.png"
              alt=""
              width={79}
              height={182}
              className="h-[182px] w-[79px] object-contain"
            />
          </div>
        </div>

        {/* ── Bottom row: Agent 001 + Quote ── */}
        <div
          ref={bottomRef}
          className="mt-16 flex flex-col justify-between gap-8 lg:flex-row lg:gap-12"
        >
          {/* Agent 001 card */}
          <div className="w-full lg:-mt-18 lg:w-[35%]">
            <AgentCard agent={AGENT_001} />
          </div>

          {/* Quote block — icon floats inline within the text */}
          <div className="w-full max-md:hidden lg:w-[50%]">
            <h3 className="font-greed-narrow text-3xl leading-[1.15] font-black tracking-tight whitespace-pre-line text-black uppercase md:text-5xl lg:text-6xl">
              {t("quote")}
            </h3>
            <div className="absolute bottom-30 -left-20">
              <Image
                src="/images/lines/line4.png"
                alt=""
                width={230}
                height={154}
                className="h-[154px] w-[230px] object-contain"
              />
            </div>
            <div className="absolute top-19 right-30">
              <BriggsAnimation className="h-[124px] w-[150px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
