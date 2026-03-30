"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { NavigationMenu } from "./navigation-menu";
gsap.registerPlugin(ScrollTrigger);

const HEADLINE_BADGES = [
  // Row 1
  [
    {
      words: ["LIVE CHAT", "LIVE CHAT", "LIVE CHAT"],
      bg: "#6433CC",
      text: "#7F9FFF",
    },
    { label: "+", plain: true },
    {
      words: ["TICKETING", "TICKETING", "TICKETING"],
      bg: "#F25430",
      text: "#F6F4EF",
    },
  ],
  // Row 2
  [
    {
      words: ["FORMS", "FORMS", "FORMS"],
      bg: "#F2B035",
      text: "black",
    },
    { label: "+", plain: true },
    {
      words: ["EMAILS", "EMAILS", "EMAILS"],
      bg: "#7F9FFF",
      text: "#FFFFFF",
    },
  ],
];

export function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 3);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav entrance
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        clearProps: "all",
      });

      // Badge stagger entrance
      if (headlineRef.current) {
        gsap.from(headlineRef.current.querySelectorAll(".hero-badge"), {
          y: 60,
          opacity: 0,
          scale: 0.8,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.5)",
          delay: 0.4,
          clearProps: "transform,opacity",
        });
      }

      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 1.2,
        clearProps: "all",
      });

      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
          delay: 1.5,
          clearProps: "all",
        });
      }

      // Illustration entrance
      if (illustrationRef.current) {
        gsap.from(illustrationRef.current, {
          x: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.6,
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* Widget Script */}
      <Script
        src="/widget.js"
        data-company-id="01490b45-52bd-4317-b2f7-e93264210201"
        strategy="afterInteractive"
      />

      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-[90px] right-0 left-0 z-50 mx-auto flex h-[70px] w-[92%] items-center justify-between border border-black bg-white px-4 md:top-[92px] md:grid md:h-[80px] md:w-[90%] md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-8"
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src="/images/newlogo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right Section — Nav Links + Login */}
        <div className="flex h-full items-center justify-end gap-10 lg:gap-14">
          {/* Desktop nav links */}
          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            <Link
              href="/"
              className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
            >
              HOME
            </Link>
            <Link
              href="/#how-it-works"
              className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
            >
              ABOUT
            </Link>
            <Link
              href="/#talk"
              className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
            >
              TYPES OF AGENTS
            </Link>
            <Link
              href="/#pricing"
              className="font-dm-mono text-base tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-60"
            >
              BILLING
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="font-dm-mono flex cursor-pointer items-center gap-3 text-xs font-bold tracking-[0.2em] text-gray-900 uppercase transition-opacity hover:opacity-70 md:hidden"
          >
            <div className="flex flex-col gap-[5px]">
              <div className="h-[2px] w-[22px] bg-black" />
              <div className="h-[2px] w-[22px] bg-black" />
            </div>
          </button>
          <Link
            href="/en/login"
            className="font-dm-mono hidden items-center justify-center rounded-lg border border-gray-900 bg-white px-8 py-3 text-xs font-bold tracking-[0.15em] text-gray-900 uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-gray-900 hover:text-white md:flex"
          >
            LOGIN/SIGN UP
          </Link>
        </div>
      </nav>

      {/* Hero Content — Two Column Layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 pt-48 pb-12 md:flex-row md:items-center md:justify-between md:px-12 md:pt-52 md:pb-16 lg:px-16 lg:pt-56">
        {/* Left Column */}
        <div className="flex w-full flex-col md:w-[55%] lg:w-[50%]">
          {/* Pill Badge Headline */}
          <div ref={headlineRef} className="flex flex-col gap-5 md:gap-6">
            {HEADLINE_BADGES.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="flex flex-wrap items-center gap-3 md:gap-4"
              >
                {row.map((badge, i) => {
                  if ("plain" in badge && badge.plain) {
                    return (
                      <span
                        key={i}
                        className="font-dm-mono text-2xl font-light text-gray-400 md:text-3xl lg:text-4xl"
                      >
                        {badge.label}
                      </span>
                    );
                  }

                  const b = badge as {
                    words: string[];
                    bg: string;
                    text: string;
                  };

                  return (
                    <span
                      key={i}
                      className="hero-badge font-greed-narrow relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3 text-3xl leading-none tracking-tight uppercase transition-all duration-1000 ease-in-out select-none md:rounded-[2rem] md:px-8 md:py-4 md:text-4xl lg:text-5xl"
                      style={{
                        backgroundColor: b.bg,
                        color: b.text,
                      }}
                    >
                      {b.words.map((word, wIdx) => {
                        const isActive = wIdx === currentIndex;
                        return (
                          <span
                            key={wIdx}
                            className="absolute inset-x-0 mx-auto text-center whitespace-nowrap transition-opacity duration-1000 ease-in-out"
                            style={{
                              opacity: isActive ? 1 : 0,
                              visibility: isActive ? "visible" : "hidden",
                            }}
                          >
                            {word}
                          </span>
                        );
                      })}
                      <span className="invisible whitespace-nowrap">
                        {b.words.reduce((longest, current) =>
                          current.length > longest.length ? current : longest,
                        )}
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-stolzl mt-10 max-w-xl text-[15px] leading-relaxed text-gray-600 md:mt-12 md:text-base lg:text-lg"
          >
            Our AI service understands your startup, managing inquiries
            efficiently and providing support. It addresses issues, answers
            questions, and evolves to enhance satisfaction.
          </p>

          {/* CTA Button */}
          <div ref={ctaRef} className="mt-10 md:mt-12">
            <Link
              href="/en/login"
              className="font-dm-mono inline-flex w-full items-center justify-center rounded-xl border-1 border-white bg-black px-10 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:bg-gray-800 sm:w-auto sm:min-w-[340px]"
            >
              GET STARTED
            </Link>
          </div>
        </div>

        {/* Right Column — Illustration */}
        <div
          ref={illustrationRef}
          className="mt-12 flex w-full items-end justify-center md:mt-0 md:max-h-[calc(100vh-14rem)] md:w-[45%] lg:w-[45%]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Newright.svg"
            alt="AI Agent at desk illustration"
            className="h-auto w-[80%] max-w-[500px] object-contain md:max-h-full md:w-full"
          />
        </div>
      </div>

      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </section>
  );
}
