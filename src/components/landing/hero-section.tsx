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
      words: ["CUSTOMER", "AMAZING", "PROFESSIONAL"],
      bg: "#6433CC",
      text: "#7F9FFF",
      dynamicWidth: true,
    },
    {
      words: ["SERVICE", "SERVICES", "SERVICE"],
      bg: "#F25430",
      text: "#F6F4EF",
      dynamicWidth: true,
    },
  ],
  // Row 2
  [
    { words: ["FOR", "FOR", "FOR"], bg: "#F2B035", text: "#000000" },
    { words: ["CUSTOMERS", "SAAS", "DEFI"], bg: "#7F9FFF", text: "#FFFFFF" },
    { words: ["&", "&", "&"], bg: "#F2B035", text: "#FFFFFF", round: true },
    {
      words: ["BUSINESSES", "FINTECH", "CRYPTO"],
      bg: "#F6F4EF",
      text: "#000000",
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
  const roadRef = useRef<HTMLDivElement>(null);
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

      // Road parallax
      if (roadRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            if (roadRef.current)
              gsap.set(roadRef.current, { y: self.progress * 60 });
          },
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
      {/* Widget Script — stacks on top via widget's own fixed positioning */}
      <Script
        src="/widget.js"
        data-company-id="01490b45-52bd-4317-b2f7-e93264210201"
        strategy="afterInteractive"
      />
      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-[90px] right-0 left-0 z-50 mx-auto flex h-[70px] w-[92%] items-center justify-between border border-black bg-white px-4 md:top-[92px] md:grid md:h-[80px] md:w-[90%] md:grid-cols-[auto_1fr_auto] md:px-8"
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

        {/* Middle Empty Section */}
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
      <div className="relative z-10 flex w-full flex-col px-6 pt-36 md:mb-50 md:px-16 md:pt-44 lg:px-24 lg:pt-38 xl:pt-48">
        {/* Pill Badge Headline */}
        <div ref={headlineRef} className="flex flex-col gap-4">
          {HEADLINE_BADGES.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-wrap items-center gap-3">
              {row.map((badge, i) => (
                <span
                  key={i}
                  className={`hero-badge font-greed-narrow relative inline-flex items-center justify-center overflow-hidden leading-none tracking-tight uppercase transition-all duration-1000 ease-in-out select-none ${
                    "round" in badge && badge.round
                      ? "h-16 w-16 rounded-full text-4xl md:h-20 md:w-20 md:text-5xl lg:text-3xl"
                      : "rounded-md px-4 py-3 text-3xl md:rounded-[2rem] md:px-4 md:py-4 md:text-4xl lg:text-5xl"
                  }`}
                  style={{
                    backgroundColor: badge.bg,
                    color: badge.text,
                  }}
                >
                  {badge.words.map((word, wIdx) => {
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
                  {/* Spacers for width sizing: dynamic vs. static longest-word */}
                  {"dynamicWidth" in badge && badge.dynamicWidth ? (
                    <span className="flex">
                      {badge.words.map((word, wIdx) => {
                        const isActive = wIdx === currentIndex;
                        return (
                          <span
                            key={wIdx}
                            className="grid overflow-hidden transition-[grid-template-columns] duration-1000 ease-in-out"
                            style={{
                              gridTemplateColumns: isActive
                                ? "minmax(0, 1fr)"
                                : "minmax(0, 0fr)",
                            }}
                          >
                            <span className="invisible min-w-0 whitespace-nowrap">
                              {word === "SERVICES"
                                ? `\u00A0\u00A0\u00A0\u00A0${word}\u00A0\u00A0\u00A0\u00A0`
                                : word}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    <span className="invisible whitespace-nowrap">
                      {badge.words.reduce((longest, current) =>
                        current.length > longest.length ? current : longest,
                      )}
                    </span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-stolzl mt-8 max-w-2xl text-sm leading-relaxed text-gray-700 max-md:hidden md:text-base"
        >
          Our AI agents handle inquiries seamlessly, offering instant support.
          They resolve issues, answer questions, and continuously learn to
          improve customer satisfaction.
        </p>

        <p
          ref={subtitleRef}
          className="font-stolzl mt-8 max-w-xl text-center text-base leading-relaxed text-gray-700 md:hidden md:text-base"
        >
          Imagine a world where AI handles inquiries, providing instant support.
          They resolve issues, answer questions, and learn to enhance
          satisfaction.
        </p>
        {/* CTA Buttons */}
        <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/en/login"
            className="font-dm-mono inline-flex items-center justify-center rounded-xl border-2 border-black bg-white px-8 py-3 text-xs font-bold tracking-[0.18em] text-black uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-gray-50 hover:shadow-none max-md:mx-auto max-md:w-[90%]"
          >
            GET STARTED
          </Link>
          <Link
            href="#how-it-works"
            className="font-dm-mono inline-flex items-center justify-center rounded-xl border-white bg-[#F25430] px-8 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-[-3px_3px_0px_0px_#000000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-gray-900 hover:shadow-none max-md:mx-auto max-md:w-[90%] md:border-2 md:bg-black"
          >
            HOW IT WORKS?
          </Link>
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/spiral_landing.svg"
        alt="Road intersection"
        className="absolute bottom-0 h-[350px] w-full overflow-hidden object-cover object-top md:h-[340px]"
      />

      <NavigationMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </section>
  );
}
