"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import { Navbar } from "./navbar";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        clearProps: "all",
      });

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
          clearProps: "all",
        });
      }

      if (headlineRef.current) {
        gsap.from(
          headlineRef.current.querySelectorAll(".hero-badge, .hero-text"),
          {
            y: 50,
            opacity: 0,
            scale: 0.9,
            stagger: 0.08,
            duration: 0.7,
            ease: "back.out(1.5)",
            delay: 0.5,
            clearProps: "transform,opacity",
          },
        );
      }

      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 1.1,
        clearProps: "all",
      });

      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
          delay: 1.4,
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      {/* Navigation */}
      <Navbar ref={navRef} />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col-reverse pt-26 md:flex-row md:items-start md:gap-0 md:pt-32 lg:pt-48">
        {/* Left Column — hero image, no border radius */}
        <div
          ref={imageRef}
          className="aspect-508/664 w-full max-w-127 overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Agents/AGENT_047.png"
            alt="SwiftAgent chat interface on mobile"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Right Column — Headline + subtitle + CTAs */}
        <div className="flex w-full flex-col justify-center px-6 py-12 md:w-[58%] md:px-10 md:py-0 lg:w-[55%] lg:px-16">
          <div
            ref={headlineRef}
            className="font-greed-narrow flex flex-col gap-4 text-3xl leading-1.5 font-medium tracking-[-2%] uppercase md:gap-6 md:text-4xl lg:text-[65px]"
          >
            {/* Row 1: CUSTOMER SUPPORT */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span
                className="hero-badge inline-flex items-center rounded-3xl px-3 py-5 text-white md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#03A84E" }}
              >
                CUSTOMER
              </span>
              <span
                className="hero-badge font-greed-narrow inline-flex items-center rounded-3xl px-3 py-5 text-white md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#F25430" }}
              >
                SUPPORT
              </span>
            </div>

            {/* Row 2: THAT DOESN'T SCALE */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span className="hero-text font-greed-narrow text-black">
                THAT DOESN&apos;T
              </span>
              <span
                className="hero-badge font-greed-narrow inline-flex items-center rounded-3xl px-3 py-5 text-black md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#F2B035" }}
              >
                SCALE
              </span>
            </div>

            {/* Row 3: YOUR HEADCOUNT */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span className="hero-text font-greed-narrow text-black">
                YOUR
              </span>
              <span
                className="hero-badge font-greed-narrow inline-flex items-center rounded-3xl px-3 py-5 text-white md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#7F9FFF" }}
              >
                HEADCOUNT
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-stolzl mt-8 max-w-xl text-sm leading-relaxed text-black md:mt-10 md:text-base"
          >
            Swift Agents automates your customer conversations so your team
            handles less, and your customers wait less.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="mt-8 flex flex-wrap gap-2 sm:gap-4 md:mt-10 md:gap-6 lg:gap-8"
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">BOOK A DEMO</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/signup">GET STARTED</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
