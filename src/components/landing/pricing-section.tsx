"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { type Plan, PlanCard } from "@/components/pricing/plan-card";
import { useGeoCountry } from "@/hooks/use-geo-country";
import { useRouter } from "@/i18n/navigation";

gsap.registerPlugin(ScrollTrigger);

const GEO_PRICING: Record<string, { price: string; billing: string }[]> = {
  NG: [
    { price: "NGN 25,000", billing: "PER MONTH" },
    { price: "NGN 45,000", billing: "PER MONTH" },
    { price: "NGN 80,000", billing: "PER MONTH" },
  ],
  default: [
    { price: "200 USD", billing: "PER MONTH" },
    { price: "700 USD", billing: "PER MONTH" },
    { price: "1,700 USD", billing: "PER MONTH" },
  ],
};

const BASE_PLANS: Omit<Plan, "price" | "billing">[] = [
  {
    name: "BASIC PLAN",
    description:
      "DESIGNED FOR EARLY STARTUPS\nAND SMALL PROJECTS\nTESTING THE WATERS.",
    textColor: "text-[#F3B03D]",
    image: "/images/pricing/icon1.svg",
    features: [
      "1 DEPLOYED AI AGENT",
      "UP TO 10 DOCUMENT UPLOADS",
      "1 SUPPORTED LANGUAGE",
      "BASIC ANSWER BOUNDARIES",
      "BASIC ANALYTICS REPORTING",
      "UP TO 800 VOICE MINUTES\nPER MONTH",
      "STANDARD SHARED COMPUTE TIER",
      "MAXIMUM OF 1 COMPANY PER\nCORE USER ACCOUNT",
      "UP TO 3 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  {
    name: "PRO PLAN",
    description:
      "GEARED TOWARDS GROWING\nOPERATIONS NEEDING SCALE\nAND HEAVIER WORKLOAD VOLUME.",
    textColor: "text-[#6433CC]",
    image: "/images/pricing/icon2.svg",
    features: [
      "UP TO 3 DEPLOYED AI AGENTS",
      "UP TO 50 DOCUMENT UPLOADS",
      "UP TO 3 SUPPORTED LANGUAGES",
      "ADVANCED ANSWER BOUNDARIES\nFOR NUANCED AGENT RESPONSES",
      "ADVANCED ANALYTICS REPORTING",
      "UP TO 3,000 VOICE MINUTES\nPER MONTH",
      "PRIORITY COMPUTE TIER\n(REDUCES GENERATION LATENCY)",
      "MAXIMUM OF 3 COMPANIES PER\nCORE USER ACCOUNT",
      "UP TO 10 INVITED MEMBERS\nPER COMPANY",
    ],
  },
  {
    name: "ENTERPRISE PLAN",
    description:
      "UNCAPPED SCALING FOR\nESTABLISHED OPERATIONS\nAND INTENSIVE NEEDS.",
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
    features: [
      "UNLIMITED DEPLOYED AI AGENTS",
      "UNLIMITED DOCUMENT UPLOADS",
      "ALL SUPPORTED LANGUAGES\n(UNLIMITED)",
      "CUSTOM ANSWER BOUNDARY\nCONTROLS",
      "FULLY CUSTOMIZABLE ANALYTICS",
      "UNLIMITED VOICE MINUTES\nPER MONTH",
      "DEDICATED COMPUTE TIER FOR\nTHE FASTEST RESPONSE TIMES",
      "UNLIMITED COMPANIES",
      "UNLIMITED INVITED MEMBERS\nPER COMPANY",
    ],
  },
];

export function PricingSection() {
  const router = useRouter();
  const country = useGeoCountry();
  const pricing = GEO_PRICING[country ?? "default"] ?? GEO_PRICING.default;
  const plans: Plan[] = BASE_PLANS.map((base, i) => ({
    ...base,
    ...pricing[i],
  }));

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
        });
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".pricing-card");
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 80,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F6F4EF] px-4 py-8 md:px-12 md:py-24 lg:px-16"
      id="pricing"
    >
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div ref={titleRef} className="mb-6 md:mb-12">
          <span className="mb-8 inline-block font-mono text-sm tracking-widest text-gray-500 uppercase">
            BILLING
          </span>
          <h2 className="font-stolzl text-3xl font-normal text-gray-900 md:text-4xl lg:text-4xl">
            We have three plans for Swift Agents
          </h2>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid items-start gap-4 md:grid-cols-3 md:gap-6"
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              className="pricing-card h-full"
              showSubscribe
              onSubscribe={() => router.push("/login")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
