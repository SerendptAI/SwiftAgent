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
        delay: 0.9,
        clearProps: "all",
      });

      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 20,
          opacity: 0,
          // stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.6,
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
      <div className="relative z-10 mx-auto flex w-full max-w-350 flex-col-reverse px-6 pt-26 md:items-start md:gap-y-12 md:pt-32 lg:flex-row lg:pt-48 lg:pr-0">
        {/* Left Column — hero image, no border radius */}
        <div
          ref={imageRef}
          className="aspect-508/664 w-full overflow-hidden lg:max-w-127"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Agents/AGENT_047.png"
            alt="SwiftAgent chat interface on mobile"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Right Column — Headline + subtitle + CTAs */}
        <div className="flex w-full flex-col justify-center py-12 md:w-[78%] md:px-10 md:py-0 lg:w-[55%] lg:px-16">
          <div
            ref={headlineRef}
            className="font-greed-narrow flex flex-col gap-4 text-4xl leading-1.5 font-medium tracking-[-2%] uppercase md:gap-6 md:text-5xl lg:text-[56px] xl:text-[65px]"
          >
            {/* Row 1: CUSTOMER SUPPORT */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span
                className="hero-badge inline-flex h-fit items-center rounded-3xl px-3 py-5 text-white md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#03A84E" }}
              >
                CUSTOMER
              </span>
              <span
                className="hero-badge inline-flex h-fit items-center rounded-3xl px-3 py-5 text-white md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#F25430" }}
              >
                SUPPORT
              </span>
            </div>

            {/* Row 2: THAT DOESN'T SCALE */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span className="hero-text text-black">THAT DOESN&apos;T</span>
              <span
                className="hero-badge inline-flex h-fit items-center rounded-3xl px-3 py-5 text-black md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#F2B035" }}
              >
                SCALE
              </span>
            </div>

            {/* Row 3: YOUR HEADCOUNT */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span className="hero-text text-black">YOUR</span>
              <span
                className="hero-badge inline-flex h-fit items-center rounded-3xl px-3 py-5 text-white md:rounded-4xl md:px-4 md:py-10"
                style={{ backgroundColor: "#7F9FFF" }}
              >
                HEADCOUNT
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="font-stolzl mt-8 max-w-xl text-base leading-relaxed text-black md:mt-10 md:text-lg"
          >
            Swift Agents automates your customer conversations so your team
            handles less, and your customers wait less.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="mt-8 grid w-full max-w-140 grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 lg:gap-6 xl:gap-8"
          >
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/demo">BOOK A DEMO</Link>
            </Button>
            <Button size="lg" className="w-full" asChild>
              <Link href="/signup">GET STARTED</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
