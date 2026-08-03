"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

import { Navbar } from "./navbar";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_CALLOUTS = [
  {
    icon: "/images/home/timeline-hours.svg",
    text: "Live in hours — not weeks.",
  },
  {
    icon: "/images/home/timeline-setup.svg",
    text: "No heavy setup. No long implementation cycles.",
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const calloutsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = true;
      heroVideoRef.current.play().catch(() => {});
    }
  }, []);

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

      if (calloutsRef.current) {
        gsap.from(calloutsRef.current.children, {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          delay: 1.05,
          clearProps: "all",
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 1.2,
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
          <video
            ref={heroVideoRef}
            src="/videos/hero-section.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Column — Headline + subtitle + CTAs */}
        <div className="flex w-full flex-col justify-center py-12 md:w-[78%] md:px-10 md:py-0 lg:w-[55%] lg:px-16">
          <div
            ref={headlineRef}
            className="font-greed-narrow flex flex-col gap-6 text-[50px] leading-normal font-medium tracking-[-2%] uppercase md:text-5xl lg:text-[56px] xl:text-[65px]"
          >
            {/* Row 1 desktop: CUSTOMER + SUPPORT. Mobile: stacked */}
            <div className="xs:flex-row xs:items-center flex flex-col gap-6">
              <span
                className="hero-badge xs:w-auto xs:justify-start inline-flex w-full items-center justify-center rounded-4xl px-5 text-white"
                style={{ backgroundColor: "#03A84E" }}
              >
                CUSTOMER
              </span>
              <span
                className="hero-badge xs:w-auto xs:justify-start inline-flex w-full items-center justify-center rounded-4xl px-5 text-white"
                style={{ backgroundColor: "#F25430" }}
              >
                SUPPORT
              </span>
            </div>

            {/* Row 2 desktop: THAT DOESN'T + SCALE. Mobile: THAT DOESN'T alone */}
            <div className="flex items-center gap-6">
              <span className="hero-text flex gap-4 text-black">
                <span>THAT</span> <span>DOESN&apos;T</span>
              </span>
              <span
                className="hero-badge xs:inline-flex hidden h-fit items-center rounded-4xl px-5 text-black"
                style={{ backgroundColor: "#F2B035" }}
              >
                SCALE
              </span>
            </div>

            {/* Mobile only: SCALE + YOUR share a row */}
            <div className="xs:hidden flex items-center gap-6">
              <span
                className="hero-badge inline-flex h-fit items-center rounded-4xl px-5 text-black"
                style={{ backgroundColor: "#F2B035" }}
              >
                SCALE
              </span>
              <span className="hero-badge text-black">YOUR</span>
            </div>

            {/* Row 3 desktop: YOUR + HEADCOUNT. Mobile: HEADCOUNT alone */}
            <div className="flex items-center gap-6">
              <span className="hero-text xs:inline hidden text-black">
                YOUR
              </span>
              <span
                className="hero-badge xs:w-auto xs:justify-start inline-flex w-full items-center justify-center rounded-4xl px-5 text-white"
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
            Swift Agents helps businesses automate customer conversations,
            reduce support workload, and deliver faster customer experiences
            across every support channel.
          </p>

          {/* Timeline callouts */}
          <div ref={calloutsRef} className="mt-6 flex flex-col gap-2.5 md:mt-8">
            {TIMELINE_CALLOUTS.map((callout) => (
              <div key={callout.text} className="flex items-start gap-3">
                <span className="relative size-6 shrink-0">
                  <Image
                    src={callout.icon}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </span>
                <span className="font-stolzl text-base text-[#1f1f1f]">
                  {callout.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="mt-8 grid w-full max-w-140 grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 lg:gap-6 xl:gap-8"
          >
            <Button variant="outline" size="lg" className="w-full" asChild>
              <a
                href={siteConfig.demoBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                BOOK A DEMO
              </a>
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
