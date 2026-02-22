"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".about-char");
        gsap.from(chars, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          opacity: 0.1,
          stagger: 0.03,
        });
      }

      // Content paragraphs
      if (contentRef.current) {
        const paragraphs =
          contentRef.current.querySelectorAll(".about-paragraph");
        gsap.from(paragraphs, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
        });
      }

      // Divider line grows
      gsap.from(dividerRef.current, {
        scrollTrigger: {
          trigger: dividerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power3.inOut",
      });

      // Stats counter animation
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item");
        gsap.from(statItems, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 50,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });

        // Animate numbers
        const numbers = statsRef.current.querySelectorAll(".stat-number");
        numbers.forEach((num) => {
          const target = parseInt(num.getAttribute("data-value") || "0");
          const obj = { value: 0 };
          gsap.to(obj, {
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            value: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              num.textContent = Math.round(obj.value).toLocaleString() + "+";
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleText = "ABOUT SWIFT AGENTS";

  return (
    <section
      ref={sectionRef}
      className="relative bg-gray-900 px-8 py-32 text-white md:px-12 lg:px-16"
    >
      {/* Large title with character-by-character reveal */}
      <h2
        ref={titleRef}
        className="mb-16 text-4xl leading-tight font-black tracking-tight uppercase md:text-6xl lg:text-7xl"
      >
        {titleText.split("").map((char, i) => (
          <span key={i} className="about-char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>

      <div ref={dividerRef} className="mb-16 h-px w-full bg-gray-700" />

      {/* Content */}
      <div ref={contentRef} className="grid gap-12 md:grid-cols-2 md:gap-20">
        <div className="about-paragraph">
          <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
            SwiftAgent represents the next generation of AI-powered customer
            engagement. Our intelligent agents don&apos;t just respond — they{" "}
            <span className="font-bold text-[#E8442A]">understand</span>,{" "}
            <span className="font-bold text-[#E8442A]">learn</span>, and{" "}
            <span className="font-bold text-[#E8442A]">evolve</span> with every
            interaction.
          </p>
        </div>
        <div className="about-paragraph">
          <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
            Built for the Web3 era, our platform seamlessly integrates with
            decentralized applications, providing 24/7 intelligent support that
            scales with your community.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4"
      >
        <div className="stat-item">
          <div
            className="stat-number mb-2 text-4xl font-black text-[#E8442A] md:text-5xl"
            data-value="500"
          >
            0+
          </div>
          <div className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Active Agents
          </div>
        </div>
        <div className="stat-item">
          <div
            className="stat-number mb-2 text-4xl font-black text-[#E8442A] md:text-5xl"
            data-value="10000"
          >
            0+
          </div>
          <div className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Queries Resolved
          </div>
        </div>
        <div className="stat-item">
          <div
            className="stat-number mb-2 text-4xl font-black text-[#E8442A] md:text-5xl"
            data-value="99"
          >
            0+
          </div>
          <div className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Uptime %
          </div>
        </div>
        <div className="stat-item">
          <div
            className="stat-number mb-2 text-4xl font-black text-[#E8442A] md:text-5xl"
            data-value="50"
          >
            0+
          </div>
          <div className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Integrations
          </div>
        </div>
      </div>
    </section>
  );
}
