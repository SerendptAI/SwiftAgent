"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const checkerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav entrance
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Headline — split into words and animate
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".hero-word");
        gsap.from(words, {
          y: 120,
          opacity: 0,
          rotateX: -90,
          stagger: 0.08,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.4,
        });
      }

      // Subtitle
      gsap.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.2,
      });

      // CTA buttons
      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.5,
        });
      }

      // Checkerboard blocks
      if (checkerRef.current) {
        const blocks = checkerRef.current.querySelectorAll(".checker-block");
        gsap.from(blocks, {
          scale: 0,
          opacity: 0,
          stagger: {
            each: 0.1,
            from: "random",
          },
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.6,
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

      // Parallax on scroll — checkerboard moves slower
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (checkerRef.current) {
            gsap.set(checkerRef.current, {
              y: self.progress * 150,
            });
          }
          if (headlineRef.current) {
            gsap.set(headlineRef.current, {
              y: self.progress * 80,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = [
    "CUSTOMER",
    "SERVICE",
    "FOR",
    "YOUR",
    "WEB3",
    "WEBSITE",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* Navigation */}
      <nav
        ref={navRef}
        className="relative z-10 flex items-center justify-between px-8 py-6 md:px-12 lg:px-16"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <button className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-colors hover:text-[#E8442A]">
            OPEN MENU
          </button>
          <Link
            href="/en/login"
            className="rounded-full border-2 border-gray-900 px-6 py-2 text-xs font-bold tracking-[0.15em] text-gray-900 uppercase transition-all hover:bg-gray-900 hover:text-white"
          >
            LOGIN/SIGN UP
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center">
        <div className="w-full px-8 md:w-3/5 md:px-12 lg:px-16">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="mb-8 text-5xl leading-[0.95] font-black tracking-tight text-gray-900 uppercase md:text-6xl lg:text-7xl xl:text-8xl"
            style={{ perspective: "1000px" }}
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className="hero-word inline-block"
                style={{
                  marginRight:
                    word === "FOR" || word === "YOUR" || word === "SERVICE"
                      ? "0.3em"
                      : "0.25em",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mb-10 max-w-lg text-sm leading-relaxed text-gray-600 md:text-base"
          >
            Imagine a world where AI handles inquiries, providing instant
            support. They resolve issues, answer questions, and learn to enhance
            satisfaction.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <Link
              href="/en/login"
              className="group relative overflow-hidden rounded-full border-2 border-gray-900 px-8 py-3.5 text-xs font-bold tracking-[0.15em] text-gray-900 uppercase transition-all hover:text-white"
            >
              <span className="absolute inset-0 -translate-x-full bg-gray-900 transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative">GET STARTED</span>
            </Link>
            <Link
              href="#how-it-works"
              className="group relative overflow-hidden rounded-full bg-[#E8442A] px-8 py-3.5 text-xs font-bold tracking-[0.15em] text-white uppercase transition-all hover:bg-[#d13a22]"
            >
              <span className="relative">HOW IT WORKS?</span>
            </Link>
          </div>
        </div>

        {/* Checkerboard Pattern */}
        <div
          ref={checkerRef}
          className="absolute top-0 right-0 hidden h-full w-2/5 md:block lg:w-[45%]"
        >
          <div className="grid h-full w-full grid-cols-3 grid-rows-6">
            {/* Row 1 */}
            <div className="checker-block bg-white" />
            <div className="checker-block bg-[#E8442A]" />
            <div className="checker-block bg-[#E8442A]" />
            {/* Row 2 */}
            <div className="checker-block bg-[#E8442A]" />
            <div className="checker-block bg-[#E8442A]" />
            <div className="checker-block bg-[#E8442A]" />
            {/* Row 3 */}
            <div className="checker-block bg-white" />
            <div className="checker-block bg-[#E8442A]" />
            <div className="checker-block bg-[#E8442A]" />
            {/* Row 4 */}
            <div className="checker-block bg-[#E8442A]" />
            <div className="checker-block bg-white" />
            <div className="checker-block bg-[#E8442A]" />
            {/* Row 5 */}
            <div className="checker-block bg-white" />
            <div className="checker-block bg-[#E8442A]" />
            <div className="checker-block bg-[#E8442A]" />
            {/* Row 6 */}
            <div className="checker-block bg-[#E8442A]" />
            <div className="checker-block bg-white" />
            <div className="checker-block bg-[#E8442A]" />
          </div>
        </div>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-6 left-8 z-10 md:left-12 lg:left-16">
        <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
          ABOUT SWIFT AGENTS
        </span>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-gray-400 pt-2">
          <div className="h-2 w-1 rounded-full bg-gray-400" />
        </div>
      </div>
    </section>
  );
}
