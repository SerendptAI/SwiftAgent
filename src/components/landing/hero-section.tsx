"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { NavigationMenu } from "./navigation-menu";
gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS = [
  "CUSTOMER",
  "SERVICE",
  "FOR",
  "YOUR",
  "WEB3",
  "WEBSITE",
];
const WIDE_SPACING_WORDS = new Set(["FOR", "YOUR", "SERVICE"]);

const CHECKER_GRID = [
  0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 0, 0, 1, 1, 1,
];

const CHECKER_BG = ["bg-white", "bg-[#E8442A]"] as const;

// --- Component ---

export function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const checkerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        clearProps: "all",
      });

      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll(".hero-word"), {
          y: 120,
          opacity: 0,
          rotateX: -90,
          stagger: 0.08,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.4,
          clearProps: "transform,opacity",
        });
      }

      gsap.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.2,
        clearProps: "all",
      });

      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.5,
          clearProps: "all",
        });
      }

      if (checkerRef.current) {
        gsap.from(checkerRef.current.querySelectorAll(".checker-block"), {
          scale: 0,
          opacity: 0,
          stagger: { each: 0.1, from: "random" },
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.6,
          clearProps: "all",
        });
      }

      // Scroll indicator bounce
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2,
      });

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (checkerRef.current)
            gsap.set(checkerRef.current, { y: self.progress * 150 });
          if (headlineRef.current)
            gsap.set(headlineRef.current, { y: self.progress * 80 });
        },
      });
    }, sectionRef);

    const indicator = scrollIndicatorRef.current;
    return () => {
      if (indicator) gsap.killTweensOf(indicator);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 right-0 left-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-8 py-6 md:px-12 lg:px-16"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center bg-black transition-none">
            <div className="relative h-8 w-8">
              <Image
                src="/images/mask.svg"
                alt="Loading..."
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors hover:text-[#E8442A]"
          >
            OPEN MENU
          </button>
          <Link
            href="/en/login"
            className="hidden rounded-lg border border-gray-900 bg-white px-12 py-4 text-xs font-bold tracking-[0.15em] text-gray-900 uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-gray-900 hover:text-white md:inline-flex"
          >
            LOGIN/SIGN UP
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="relative z-20 w-full px-8 pt-20 md:w-3/5 md:px-12 lg:px-16">
          <h1
            ref={headlineRef}
            className="font-instrument relative z-20 mb-6 text-3xl leading-[1.2] font-black tracking-tight text-gray-900 uppercase md:mb-8 md:text-6xl md:leading-[1.4]"
            style={{
              perspective: "1000px",
              transform: "scaleY(1.2)",
              transformOrigin: "top",
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <span
                key={i}
                className="hero-word inline-block"
                style={{
                  marginRight: WIDE_SPACING_WORDS.has(word) ? "0.4em" : "0.2em",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            ref={subtitleRef}
            className="mb-10 max-w-sm text-lg leading-relaxed text-gray-600 md:text-base"
          >
            Imagine a world where AI handles inquiries, providing instant
            support. They resolve issues, answer questions, and learn to enhance
            satisfaction.
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col items-start gap-4 sm:flex-row"
          >
            <Link
              href="/en/login"
              className="group relative overflow-hidden rounded-lg border border-gray-900 bg-white px-8 py-3.5 text-xs font-bold tracking-[0.15em] text-gray-900 uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:text-white"
            >
              <span className="absolute inset-0 -translate-x-full bg-gray-900 transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative">GET STARTED</span>
            </Link>
            <Link
              href="#how-it-works"
              className="group relative overflow-hidden rounded-lg bg-[#E8442A] px-8 py-3.5 text-xs font-bold tracking-[0.15em] text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-[#d13a22]"
            >
              <span className="relative">HOW IT WORKS?</span>
            </Link>
          </div>
        </div>

        {/* Background Patterns */}
        <div
          ref={checkerRef}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          {/* Desktop Pattern */}
          <div className="absolute top-0 right-0 hidden w-1/2 md:block">
            <div className="grid w-full grid-cols-5">
              {CHECKER_GRID.map((color, i) => (
                <div
                  key={i}
                  className={`checker-block aspect-square ${CHECKER_BG[color]}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Pattern */}
          <div className="absolute inset-0 block md:hidden">
            <div className="checker-block absolute top-0 right-0 h-[26vh] w-[55%] bg-[#E8442A]" />
            <div className="checker-block absolute top-[42%] right-0 h-[16vh] w-[25%] bg-[#E8442A]" />
            <div className="checker-block absolute right-0 bottom-0 h-[25vh] w-[30%] bg-[#E8442A]" />
          </div>
        </div>
      </div>
      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </section>
  );
}
