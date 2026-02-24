"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Monitor } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// 0 = Transparent, 1 = White
const BOTTOM_GRID = [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1];

const LEFT_GRID = [
  // Row 1 mirrored
  1, 0, 0, 1, 1, 0, 0, 0,
  // Row 2 mirrored
  1, 1, 0, 1, 1, 1, 1, 1,
];

const COLOR_MAP = {
  0: "bg-transparent",
  1: "bg-white",
} as const;

export function TalkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal - Staggered slide up
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
          y: 50,
          opacity: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
        });
      }

      // Image entrance - Float in from right with subtle rotation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            x: 200,
            opacity: 0,
            rotationY: 15,
            rotationZ: 5,
          },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
            x: 0,
            opacity: 1,
            rotationY: 0,
            rotationZ: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.7)",
            onComplete: () => {
              // Subtle hovering effect after entrance
              gsap.to(imageRef.current, {
                y: -15,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            },
          },
        );
      }

      // Buttons entrance - Pop in
      if (buttonsRef.current) {
        gsap.from(buttonsRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
          scale: 0.8,
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.5)",
        });
      }

      // Bottom grid blocks - dramatic falling from top
      if (gridRef.current) {
        const blocks = gridRef.current.querySelectorAll(
          ".bottom-block.bg-white",
        );

        gsap.fromTo(
          blocks,
          {
            y: -1000,
            opacity: 0,
            scale: 0.5,
            rotation: () => gsap.utils.random(-45, 45),
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
              amount: 1.5,
              from: "random",
            },
            duration: 1.5,
            ease: "bounce.out",
          },
        );
      }
    }, sectionRef);

    return () => {
      if (imageRef.current) {
        gsap.killTweensOf(imageRef.current);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="talk"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#5B39C6] text-white"
    >
      {/* Main Content Area */}
      <div className="align-start relative z-10 mx-auto flex min-h-screen flex-col justify-start md:mt-30 lg:flex-row lg:items-start lg:justify-between">
        {/* Left Text Content */}
        <div
          ref={textRef}
          className="w-full p-5 pb-16 md:p-10 md:pt-32 lg:w-1/2 lg:py-0"
        >
          <div className="mb-12 font-mono text-sm tracking-[0.2em] text-white/70 uppercase">
            THEY DON&apos;T SAY MORE THAN THEY SHOULD
          </div>

          <h2 className="text-3xl leading-[1.5] font-black tracking-tight uppercase sm:text-6xl md:mb-8 md:text-5xl md:text-7xl lg:text-[80px]">
            TALK TO OUR <br />
            AGENT
          </h2>

          <p className="leading-[1.5] font-medium text-[#F4B23E] md:text-2xl">
            All conversations are handled with <br />
            only what has been uploaded by you
          </p>
        </div>

        {/* Right Interactive Area */}
        <div className="relative z-20 flex w-full flex-col items-center justify-center pb-32 lg:w-[45%] lg:pb-0">
          {/* Phone Image Container */}
          <div
            ref={imageRef}
            className="relative mb-10 w-full max-md:h-[300px]"
          >
            <Image
              src="/images/phone_side.svg"
              alt="Talk to our agent interface"
              width={542}
              height={364}
              className="absolute right-[-20%] h-auto w-full object-contain"
              priority
            />
          </div>

          {/* Action Buttons */}
          <div
            ref={buttonsRef}
            className="flex w-full max-w-[400px] flex-col items-center gap-5 px-5 lg:px-0 lg:pr-10"
          >
            {/* Download App Button */}
            <button className="flex w-full items-center justify-center space-x-3 rounded-xl border-2 border-black bg-white px-6 py-4 text-sm font-bold tracking-widest text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
              <Monitor className="h-5 w-5" />
              <span>DOWNLOAD THE APP</span>
            </button>

            <div className="text-xs font-bold text-white/70">OR</div>

            {/* Web Button */}
            <button className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-[#F4B23E] px-6 py-4 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
              CONTINUE ON THE WEB
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid Blocks */}
      <div
        ref={gridRef}
        className="absolute right-0 bottom-0 left-0 z-10 hidden w-full justify-between md:flex"
      >
        {/* Left Grid */}
        <div className="grid w-1/2 grid-cols-8 grid-rows-2 md:w-1/2 lg:w-2/5">
          {LEFT_GRID.map((type, i) => (
            <div
              key={`left-${i}`}
              className={`bottom-block aspect-square w-full ${COLOR_MAP[type as keyof typeof COLOR_MAP]}`}
            />
          ))}
        </div>

        {/* Right Grid */}
        <div className="grid w-1/2 grid-cols-8 grid-rows-2 md:w-1/2 lg:w-2/5">
          {BOTTOM_GRID.map((type, i) => (
            <div
              key={`right-${i}`}
              className={`bottom-block aspect-square w-full ${COLOR_MAP[type as keyof typeof COLOR_MAP]}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
