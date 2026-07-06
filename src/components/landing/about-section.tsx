"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Icons } from "../icons";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    id: "chatbots",
    icon: "diamond",
    title: "SMART AI CHATBOTS",
    description:
      "OUR AI CHATBOTS HANDLE ENTIRE CUSTOMER INTERACTIONS FROM BEGINNING TO END, WITHOUT HUMAN INTERVENTION.",
    image: "/images/chatbot_pixel_art.svg",
  },
  {
    id: "agents",
    icon: "play",
    title: "POWERFUL AI AGENTS",
    description:
      "DEPLOY AUTONOMOUS AI AGENTS THAT LEARN, ADAPT, AND RESOLVE COMPLEX SUPPORT SCENARIOS INDEPENDENTLY.",
    image: "/images/chatbot_pixel_art2.svg",
  },
  {
    id: "calls",
    icon: "play",
    title: "REALISTIC AI CALLS",
    description:
      "LIFELIKE VOICE AI HANDLES YOUR CALLS WITH NATURAL CONVERSATIONAL FLOW — NO HUMAN NEEDED.",
    image: "/images/chatbot_pixel_art1.svg",
  },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string>("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.from(headlineRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "back.out(1.5)",
        });
      }

      if (leftRef.current) {
        gsap.from(leftRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
          x: -40,
          opacity: 0,
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
      id="how-it-works"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#6433CC" }}
    >
      <div className="relative mx-auto my-4 flex max-w-[1512px] flex-col p-4">
        <div className="flex justify-end px-8 pt-8 max-md:hidden md:px-14 md:pt-12">
          <span
            className="font-dm-mono text-base tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            ABOUT SWIFT AGENTS
          </span>
        </div>

        <div className="flex flex-1 flex-col-reverse lg:flex-row">
          {/* ── Left column: Accordion ── */}
          <div
            ref={leftRef}
            className="flex w-full flex-col justify-start pt-4 pb-10 md:px-8 lg:w-[45%] lg:px-14 lg:pt-6 lg:pb-16"
          >
            {FEATURES.map((feature) => {
              const isOpen = openId === feature.id;
              return (
                <div key={feature.id}>
                  <button
                    onClick={() => setOpenId(isOpen ? "" : feature.id)}
                    className="flex w-full cursor-pointer items-center gap-3 py-5 text-left transition-opacity hover:opacity-80"
                  >
                    <span
                      className="flex-shrink-0 text-sm"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {isOpen ? (
                        <Icons.PolygonDown className="size-4" />
                      ) : (
                        <Icons.Polygon className="size-4" />
                      )}
                    </span>

                    <span
                      className="font-dm-mono text-xl font-normal tracking-[0.2em] uppercase"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {feature.title}
                    </span>
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                      maxHeight: isOpen ? "600px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p
                      className="font-dm-mono pb-4 text-[11px] leading-[1.8] tracking-[0.1em] uppercase"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {feature.description}
                    </p>

                    {feature.image && (
                      <div
                        className="mb-6 overflow-hidden rounded-sm"
                        style={{ backgroundColor: "#fff" }}
                      >
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          width={400}
                          height={220}
                          className="h-auto w-full object-contain"
                          style={{ maxHeight: "220px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right column: Big headline ── */}
          <div
            ref={headlineRef}
            className="flex w-full flex-col items-start justify-start gap-10 pt-4 md:px-8 md:pb-10 lg:w-[55%] lg:items-end lg:gap-14 lg:px-10 lg:pt-6 lg:pb-16 lg:pl-4"
          >
            {(["WHY USE", "SWIFT AGENTS?"] as const).map((word) => (
              <span
                key={word}
                className="font-greed-narrow block leading-[0.9] font-black text-white uppercase lg:hidden"
                style={{
                  fontSize: "clamp(2.2rem, 6vw, 4rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                {word}
              </span>
            ))}
            {(["WHY USE", "SWIFT", "AGENTS?"] as const).map((word) => (
              <span
                key={word}
                className="font-greed-narrow hidden leading-[0.9] font-black text-white uppercase lg:block"
                style={{
                  fontSize: "clamp(3rem, 8.5vw, 8.5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
