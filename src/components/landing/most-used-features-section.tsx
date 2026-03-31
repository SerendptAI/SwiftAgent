"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: "/images/dashbaordSection/monitor.svg",
    label: "Monitor Customer\nActivities",
  },
  {
    icon: "/images/dashbaordSection/customercare.svg",
    label: "Automated\ncustomer service",
  },
  {
    icon: "/images/dashbaordSection/countrylocation.svg",
    label: "Pinpoint your customer's\ncountry for better planning.",
  },
];

export function MostUsedFeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      // Feature cards stagger
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white">
      {/* Top blue border accent */}
      <div className="h-1 w-full bg-[#7B8CDE]" />

      <div className="relative mx-auto max-w-[1512px] px-6 py-16 md:px-14 md:py-24">
        {/* ── Section header ── */}
        <div
          ref={headerRef}
          className="mb-16 flex flex-col items-center gap-4 text-center"
        >
          {/* Label */}
          <span className="font-dm-mono text-xs tracking-[0.25em] text-black/50 uppercase">
            FEATURES OF SWIFT AGENT
          </span>

          {/* Headline */}
          <h2 className="font-greed-narrow max-w-2xl text-4xl leading-[1.1] font-normal tracking-tight text-black uppercase md:text-5xl lg:text-6xl">
            OUR MOST USED
            <br />
            FEATURES
          </h2>
        </div>

        {/* ── Feature cards grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature, index) => (
            <div key={index} className="flex flex-col items-center gap-5">
              {/* Icon */}
              <div className="overflow-hidden rounded-md">
                <Image
                  src={feature.icon}
                  alt={feature.label.replace("\n", " ")}
                  width={398}
                  height={201}
                  className="h-auto w-full object-cover"
                />
              </div>

              {/* Label */}
              <p className="font-dm-mono text-center text-xs leading-[1.6] tracking-widest text-black/70 uppercase">
                {feature.label.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < feature.label.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
