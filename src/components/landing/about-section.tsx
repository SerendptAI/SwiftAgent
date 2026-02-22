"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// 0 = Transparent, 1 = Purple (#5B39C6), 2 = Orange (#E8442A)
const BOTTOM_GRID = [0, 0, 0, 1, 1, 0, 0, 1, 1, 2, 1, 1, 1, 2, 1, 2];

const COLOR_MAP = {
  0: "bg-transparent",
  1: "bg-[#5B39C6]",
  2: "bg-[#E8442A]",
} as const;

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          onComplete: () => {
            // "Gamey" Glitch effect randomizer (Pixelated, squash, jump)
            const triggerGlitch = () => {
              if (!imageRef.current) return;

              // Random timing between 1 to 4 seconds for more frequent activity
              const nextGlitchIn = (Math.random() * 3 + 1) * 1000;

              setTimeout(() => {
                if (!imageRef.current) return;

                const tl = gsap.timeline();
                // Blocky arcade/gamey glitch
                tl.set(imageRef.current, { clearProps: "all" })
                  // Frame 1: RGB shift & horizontal jump
                  .to(imageRef.current, {
                    x: 15,
                    y: -5,
                    scaleX: 1.1,
                    filter:
                      "drop-shadow(-10px 0 0 #0ff) drop-shadow(10px 0 0 #f00) contrast(200%)",
                    duration: 0.05,
                    ease: "steps(1)", // Stepped ease to make it choppy/pixelated
                  })
                  // Frame 2: Vertical squash (TV sync loss) & extreme jump
                  .to(imageRef.current, {
                    x: -20,
                    y: 10,
                    scaleY: 0.6,
                    scaleX: 1.2,
                    skewX: 20,
                    filter:
                      "drop-shadow(15px 5px 0 #0ff) drop-shadow(-15px -5px 0 #f00) brightness(1.5)",
                    duration: 0.05,
                    ease: "steps(1)",
                  })
                  // Frame 3: Extreme color shift
                  .to(imageRef.current, {
                    x: 10,
                    y: -10,
                    scaleY: 1.1,
                    scaleX: 0.9,
                    skewX: -10,
                    filter:
                      "drop-shadow(-5px -5px 0 #0ff) drop-shadow(5px 5px 0 #f00) invert(0.8)",
                    duration: 0.05,
                    ease: "steps(1)",
                  })
                  // Frame 4: Micro-stutter
                  .to(imageRef.current, {
                    x: -5,
                    y: 5,
                    scale: 1,
                    skewX: 0,
                    filter:
                      "drop-shadow(2px 0 0 #0ff) drop-shadow(-2px 0 0 #f00)",
                    opacity: 0.5,
                    duration: 0.03,
                    ease: "steps(1)",
                  })
                  // Reset perfectly
                  .set(imageRef.current, {
                    clearProps: "all",
                  });

                // Call recursively
                triggerGlitch();
              }, nextGlitchIn);
            };

            triggerGlitch();
          },
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

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#E8442A] text-white"
    >
      {/* Decorative Dashed Lines */}
      {/* Horizontal Line */}
      <div className="absolute top-[46%] left-0 z-0 h-px w-full border-t border-dashed border-blue-400/60 mix-blend-overlay" />
      {/* Vertical Line */}
      <div className="absolute top-0 right-[26%] z-0 h-[60%] w-px border-l border-dashed border-blue-400/60 mix-blend-overlay md:h-[70%]" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row lg:items-center">
        {/* Left Content */}
        <div
          ref={textRef}
          className="w-full px-8 pt-32 pb-16 lg:w-[45%] lg:px-16 lg:pt-0"
        >
          <div className="mb-14 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase">
            ABOUT SWIFT AGENTS
          </div>

          <p className="mb-6 text-2xl leading-[1.6] font-medium tracking-wide text-white">
            When a transaction encounters an issue, users often find themselves
            without answers or accountability. Currently, there is a lack of
            clarity in these situations. Swift agents are dedicated to
            addressing any failed transactions, providing users with real-time
            responses to their on-chain concerns.
          </p>

          <div className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase">
            INTRODUCTION
          </div>
        </div>

        {/* Right Image */}
        <div
          ref={imageRef}
          className="relative z-20 flex w-full justify-center px-8 pb-32 lg:w-[55%] lg:pr-16 lg:pb-0 lg:pl-0"
        >
          <div className="relative w-full max-w-[600px]">
            <Image
              src="/images/about_section_img.svg"
              alt="About Swift Agents - Transactions"
              width={600}
              height={500}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom Blocks */}
      <div className="absolute right-0 bottom-0 left-0 z-10 h-48 md:h-48">
        <div
          ref={gridRef}
          className="grid h-full w-full grid-cols-8 grid-rows-2"
        >
          {BOTTOM_GRID.map((type, i) => (
            <div
              key={i}
              className={`bottom-block h-full w-full ${COLOR_MAP[type as keyof typeof COLOR_MAP]}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
