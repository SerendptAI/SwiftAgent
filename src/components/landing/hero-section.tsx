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
      className="relative h-screen overflow-hidden bg-white"
    >
      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-4 right-0 left-0 z-50 mx-auto flex h-[70px] w-[92%] items-center justify-between border border-black bg-white px-4 md:top-5 md:grid md:h-[80px] md:w-[90%] md:grid-cols-[auto_1fr_auto] md:px-8"
      >
        {/* Logo Container */}
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center bg-black md:h-[52px] md:w-[52px]"
        >
          <div className="relative h-7 w-7">
            <Image
              src="/images/mask.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Middle Empty Section (Hidden on mobile) */}
        <div className="hidden h-full w-full md:block" />

        {/* Right Section */}
        <div className="flex h-full items-center justify-end gap-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="font-dm-mono flex cursor-pointer items-center gap-3 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-70"
          >
            <div className="flex flex-col gap-[5px]">
              <div className="h-[2px] w-[22px] bg-black" />
              <div className="h-[2px] w-[22px] bg-black" />
            </div>
            <span className="md:inline">OPEN MENU</span>
          </button>
          <Link
            href="/en/login"
            className="font-dm-mono hidden items-center justify-center rounded-lg border border-gray-900 bg-white px-8 py-3 text-xs font-bold tracking-[0.15em] text-gray-900 uppercase shadow-[-2px_2px_0px_0px_#000000] transition-all hover:-translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_0px_#000000] md:flex"
          >
            LOGIN/SIGN UP
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex h-screen w-full flex-col items-center md:flex-row">
        {/* Left Side: Content */}
        <div className="relative z-20 flex w-full flex-col justify-center px-8 max-md:m-auto md:w-[60%] md:px-12 md:pt-0 md:pt-20 lg:w-[55%] lg:px-16">
          <div className="relative w-full">
            <h1
              ref={headlineRef}
              className="font-stolzl relative z-20 mb-6 text-[2rem] leading-[1.6] font-bold text-gray-900 uppercase md:mb-2 md:text-4xl md:leading-[1.4] md:tracking-tight lg:text-3xl xl:text-4xl"
              style={{
                perspective: "1000px",
                transform: "scaleY(1.4)",
                transformOrigin: "top",
              }}
            >
              {HEADLINE_WORDS.map((word, i) => (
                <span key={i} className="hero-word mr-[0.2em] inline-block">
                  {word}
                </span>
              ))}
            </h1>
            {/* Orange block for mobile */}
          </div>

          <p
            ref={subtitleRef}
            className="font-stolzl text-md my-12 max-w-md leading-relaxed text-gray-600 max-md:mb-6"
          >
            Imagine a world where AI handles inquiries, providing instant
            support. They resolve issues, answer questions, and learn to enhance
            satisfaction.
          </p>

          <div
            ref={ctaRef}
            className="flex w-4/5 flex-col items-start gap-10 sm:flex-row"
          >
            <Link
              href="/en/login"
              className="group relative w-full overflow-hidden rounded-xl border-2 border-gray-900 bg-white px-8 py-3 text-sm font-bold tracking-[0.15em] text-gray-900 uppercase shadow-[4px_4px_0px_0px_#000000] transition-all hover:translate-y-1 hover:bg-gray-50 hover:shadow-none max-md:w-[90%] sm:w-auto"
            >
              <span className="font-dm-mono m relative flex w-full justify-center whitespace-nowrap">
                GET STARTED
              </span>
            </Link>
            <Link
              href="#how-it-works"
              className="group relative w-full overflow-hidden rounded-xl border-2 border-black bg-[#F25430] px-8 py-3 text-sm font-bold tracking-[0.15em] text-white uppercase shadow-[4px_4px_0px_0px_#000000] transition-all hover:translate-y-1 hover:shadow-none max-md:w-[90%] sm:w-auto"
            >
              <span className="font-dm-mono relative flex w-full justify-center whitespace-nowrap">
                HOW IT WORKS?
              </span>
            </Link>
          </div>
        </div>

        {/* Orange background block for bottom right mobile */}
        <div className="absolute top-[20%] right-[-10%] z-10 h-32 w-26 bg-[#F25430] md:hidden" />
        <div className="absolute right-0 bottom-0 z-0 h-[25vh] w-26 bg-[#F25430] md:hidden" />
        <div className="absolute right-0 -bottom-50 z-10 h-4/5 w-full md:hidden">
          <Image
            src="/images/agents.svg"
            alt="Agents"
            fill
            className="object-contain object-bottom-right"
            priority
          />
        </div>
        {/* Right Side: Background & Agent (Desktop) */}
        <div className="absolute top-0 right-0 bottom-0 z-0 hidden h-full w-full md:block md:w-[55%]">
          {/* Background Patterns */}
          <div
            ref={checkerRef}
            className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/swift_bg.svg')] bg-cover bg-center bg-no-repeat"
          />
          <div className="absolute right-0 bottom-0 z-10 h-4/5 w-full">
            <Image
              src="/images/agents.svg"
              alt="Agents"
              fill
              className="object-contain object-bottom-right"
              priority
            />
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
