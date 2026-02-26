"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// 0 = Transparent, 1 = Purple (#5B39C6), 2 = Orange (#F25430)
const BOTTOM_GRID = [
  // Row 1
  0, 0, 0, 0, 0, 0, 0, 1,
  // Row 2
  0, 0, 0, 1, 1, 0, 1, 1,
  // Row 3
  1, 1, 0, 1, 0, 1, 1, 0,
];

const COLOR_MAP = {
  0: "md:bg-transparent",
  1: "md:bg-[#5B39C6]",
  2: "md:bg-[#F25430]",
} as const;

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imgElement = imageRef.current;

    const ctx = gsap.context(() => {
      // Text reveal - Snappier "arcade" typing feel
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          x: -20,
          opacity: 0,
          stagger: 0.2, // Segmented
          duration: 0.6,
          ease: "back.out(2)", // Snappy overshoot
        });
      }

      // Image entrance - Gamey dramatic drop and BOUNCE
      gsap.fromTo(
        imageRef.current,
        {
          y: -200,
          opacity: 0,
          scale: 0.5,
          rotation: -10,
        },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
          y: 0, // Hit the "ground"
          opacity: 1,
          scale: 1,
          rotation: 0,
          ease: "bounce.out", // Heavy bounce
          duration: 1.5,
        },
      );

      // Bottom grid blocks falling from top - Tetris/Gamey drop
      if (gridRef.current) {
        const blocks = gridRef.current.querySelectorAll(".bottom-block");

        // Blocks fall deliberately, bouncy and slow
        gsap.fromTo(
          blocks,
          {
            y: -800, // Drop from off-screen
            opacity: 0,
            scale: 0.8,
          },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 50%",
            },
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            stagger: {
              amount: 2.5, // Slow cascade
              from: "random", // Random order, like falling debris
            },
            duration: 1.8,
            ease: "bounce.out", // Tetris piece hitting the floor bounce
          },
        );
      }
    }, sectionRef);

    return () => {
      if (imgElement) {
        gsap.killTweensOf(imgElement);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#F25430] text-white"
    >
      {/* Distinct Top Title */}
      <div className="absolute top-12 left-8 z-20 md:top-24 lg:top-24 lg:left-16">
        <div className="font-dm-mono text-sm font-bold tracking-[0.15em] text-gray-900 uppercase">
          ABOUT SWIFT AGENTS
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-center pt-32 lg:flex-row lg:items-center lg:pt-0">
        {/* Left Content */}
        <div
          ref={textRef}
          className="w-full px-8 pb-12 lg:w-[55%] lg:px-16 lg:pb-16"
        >
          <p className="font-stolzl mb-12 text-2xl leading-[1.4] font-light text-white sm:text-3xl md:text-[32px] md:leading-[1.4]">
            When a transaction encounters an issue, users often find themselves
            without answers or accountability. Currently, there is a lack of
            clarity in these situations. Swift agents are dedicated to
            addressing any failed transactions, providing users with real-time
            responses to their on-chain concerns.
          </p>

          <div className="font-dm-mono text-sm font-bold tracking-[0.15em] text-gray-900 uppercase">
            INTRODUCTION
          </div>
        </div>

        {/* Right Image */}
        <div
          ref={imageRef}
          className="relative z-20 flex w-full justify-center px-0 pb-12 lg:z-20 lg:w-[45%] lg:px-8 lg:pr-16 lg:pb-32 lg:pl-0"
        >
          <div className="relative z-20 -ml-[5%] w-[110%] lg:ml-0 lg:w-full lg:max-w-[600px]">
            <Image
              src="/images/about_section_img.svg"
              alt="About Swift Agents - Transactions"
              width={600}
              height={500}
              className="relative z-20 h-auto w-full object-cover max-md:absolute max-md:left-[-10%]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Blocks */}
      <div className="absolute right-0 bottom-0 left-0 z-0">
        <div ref={gridRef} className="grid w-full grid-cols-8">
          {BOTTOM_GRID.map((type, i) => (
            <div
              key={i}
              className={`bottom-block aspect-square w-full bg-[#5B39C6] ${COLOR_MAP[type as keyof typeof COLOR_MAP]}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
