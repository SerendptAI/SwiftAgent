"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, MessageCircle, Shield, Zap } from "lucide-react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Bot,
    title: "AI-Powered Agents",
    description:
      "Intelligent agents that learn from every interaction, continuously improving response quality and accuracy.",
    color: "#F25430",
  },
  {
    icon: Zap,
    title: "Instant Response",
    description:
      "Sub-second response times ensuring your customers never wait. Handle thousands of concurrent conversations.",
    color: "#FFB800",
  },
  {
    icon: Shield,
    title: "Web3 Native Security",
    description:
      "Built with blockchain-grade security. Your data and conversations are encrypted and decentralized.",
    color: "#6433CC",
  },
  {
    icon: MessageCircle,
    title: "Omnichannel Support",
    description:
      "Deploy across Discord, Telegram, your website, and any platform your community uses.",
    color: "#2196F3",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardsEl = cardsRef.current;
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 80,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
        });
      }

      // Cards stagger animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".feature-card");
        cards.forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            y: 100,
            opacity: 0,
            scale: 0.9,
            rotation: i % 2 === 0 ? -3 : 3,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.1,
          });

          // Hover-like pulsing glow
          const glowEl = card.querySelector(".card-glow");
          if (glowEl) {
            gsap.to(glowEl, {
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
              opacity: 0.6,
              scale: 1.2,
              duration: 2,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.3,
            });
          }
        });
      }
    }, sectionRef);

    return () => {
      if (cardsEl) {
        const glows = cardsEl.querySelectorAll(".card-glow");
        gsap.killTweensOf(glows);
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-8 py-32 md:px-12 lg:px-16"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#F25430]/5" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#6433CC]/5" />
      </div>

      {/* Title */}
      <div ref={titleRef} className="relative mb-20 text-center">
        <span className="mb-4 inline-block text-xs font-bold tracking-[0.3em] text-[#F25430] uppercase">
          How It Works
        </span>
        <h2 className="text-4xl font-black tracking-tight text-gray-900 uppercase md:text-6xl">
          BUILT FOR THE
          <br />
          <span className="text-[#F25430]">FUTURE</span>
        </h2>
      </div>

      {/* Feature Cards */}
      <div
        ref={cardsRef}
        className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-2"
      >
        {features.map((feature, i) => (
          <div
            key={i}
            className="feature-card group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Glow effect */}
            <div
              className="card-glow absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl"
              style={{ backgroundColor: feature.color }}
            />

            {/* Step number */}
            <div className="mb-6 text-8xl font-black text-gray-100">
              0{i + 1}
            </div>

            {/* Icon */}
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: feature.color + "15" }}
            >
              <feature.icon
                className="h-8 w-8"
                style={{ color: feature.color }}
              />
            </div>

            {/* Content */}
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              {feature.title}
            </h3>
            <p className="leading-relaxed text-gray-500">
              {feature.description}
            </p>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
              style={{ backgroundColor: feature.color }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
