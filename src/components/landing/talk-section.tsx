"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Icons } from "../icons";

gsap.registerPlugin(ScrollTrigger);

const BOTTOM_GRID = [
  // Row 1
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // Row 2
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // Row 3
  0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 5,
  // Row 4
  0, 2, 2, 0, 2, 3, 1, 3, 0, 0, 2, 4,
];

const COLOR_MAP = {
  0: "bg-transparent",
  1: "bg-white",
  2: "bg-[linear-gradient(to_top,white_50%,transparent_50%)]", // Bottom half white
  3: "bg-[linear-gradient(to_bottom,white_50%,transparent_50%)]", // Top half white
  4: "bg-[linear-gradient(to_right,white_50%,transparent_50%)]", // Left half white
  5: "bg-[linear-gradient(to_left,white_50%,transparent_50%)]", // Right half white
  6: "bg-[linear-gradient(to_bottom_right,transparent_50%,white_50%)]", // Bottom-Right diagonal white
  7: "bg-[linear-gradient(to_bottom_right,white_50%,transparent_50%)]", // Top-Left diagonal white
} as const;

export function TalkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imageEl = imageRef.current;
    const ctx = gsap.context(() => {
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
                force3D: true,
                rotationZ: 0.01,
              });
            },
          },
        );
      }

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
      if (imageEl) {
        gsap.killTweensOf(imageEl);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="talk"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#6433CC] text-white"
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

          <h2 className="font-greed-narrow text-5xl leading-[1.5] font-black tracking-tight uppercase max-md:tracking-wider sm:text-6xl md:mb-8 md:text-5xl md:text-7xl lg:text-[80px]">
            TALK TO OUR <br />
            AGENT
          </h2>

          <p className="font-stolzl leading-[1.5] font-medium text-[#F4B23E] md:text-2xl">
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
              className="right-[-20%] h-auto w-full object-contain max-md:absolute"
            />
          </div>

          {/* Action Buttons */}
          <div
            // ref={buttonsRef}
            className="font-dm-mono flex w-full max-w-[400px] flex-col items-center gap-5 px-5 md:mb-[15rem] lg:px-0 lg:pr-10"
          >
            <button className="font-dm-mono flex w-full cursor-pointer items-center justify-center gap-8 space-x-3 rounded-xl border-2 border-black bg-white px-6 py-4 text-sm font-bold tracking-widest text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
              <Icons.downloadapp />
              DOWNLOAD THE APP
            </button>

            <div className="font-dm-mono py-2 text-lg font-[400] tracking-[13%] text-white/70">
              OR
            </div>

            <button className="font-dm-mono flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-black bg-[#F4B23E] px-6 py-4 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
              CONTINUE ON THE WEB
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid Blocks */}
      <div
        ref={gridRef}
        className="absolute right-0 bottom-0 left-0 z-10 hidden w-full justify-between md:block"
      >
        <div className="grid w-full grid-cols-12">
          {BOTTOM_GRID.map((type, i) => (
            <div
              key={i}
              className={`bottom-block aspect-square w-full ${COLOR_MAP[type as keyof typeof COLOR_MAP]}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
