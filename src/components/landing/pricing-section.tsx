"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { type Plan, PlanCard } from "@/components/pricing/plan-card";

gsap.registerPlugin(ScrollTrigger);

const plans: Plan[] = [
  {
    name: "YELLOW PILL",
    price: "$99",
    billing: "PER AGENT / MONTH",
    description: "BUILT FOR SMALL BUSINESSES\nWITH LOW SUPPORT VOLUME.",
    textColor: "text-[#F3B03D]",
    image: "/images/pricing/icon1.svg",
    features: [
      "1 DEPLOYED AI AGENT",
      "DOCUMENT UPLOAD (UP TO\n10 DOCUMENTS)",
      "VOICE SUPPORT",
      "1 LANGUAGE",
      "BASIC ANSWER BOUNDARIES",
      "BASIC ANALYTICS",
      "ESCALATION TO EMAIL OR\nWHATSAPP",
      "UP TO 800 VOICE MINUTES\nPER MONTH",
      "STANDARD SHARED COMPUTE\nTIER",
    ],
  },
  {
    name: "PURPLE PILL",
    price: "$399",
    billing: "PER AGENT / MONTH",
    description:
      "BUILT FOR STARTUPS AND\nGROWING COMPANIES\nDEPLOYING AI FOR SUPPORT\nOR OPERATIONS.",
    textColor: "text-[#6433CC]",
    image: "/images/pricing/icon2.svg",
    features: [
      "REAL-TIME VOICE SUPPORT",
      "1 LANGUAGE",
      "BASIC ANALYTICS\nDASHBOARD",
      "ESCALATION ROUTING TO\nHUMAN SUPPORT",
      "UP TO 3,000 VOICE\nMINUTES PER MONTH",
      "STANDARD COMPUTE TIER",
      "1 SUPPORTED BLOCKCHAIN\nNETWORK (IF CRYPTO)",
      "EMAIL SUPPORT",
    ],
  },
  {
    name: "ORANGE PILL",
    price: "$1,200",
    billing: "PER AGENT /\nMONTH",
    description:
      "BUILT FOR HIGH-VOLUME,\nCOMPLIANCE-HEAVY, OR\nMULTI-REGION COMPANIES.",
    textColor: "text-[#F25430]",
    image: "/images/pricing/icon3.svg",
    features: [
      "ADVANCED DOCUMENT\nINGESTION AND PRIORITY\nWEIGHTING",
      "REAL-TIME VOICE WITH\nHIGHER PERFORMANCE TIER",
      "MULTI-LANGUAGE SUPPORT",
      "ADVANCED ANALYTICS AND\nREPORTING",
      "CUSTOM GUARDRAILS AND\nANSWER BOUNDARIES",
      "SLA GUARANTEES",
      "UP TO 10,000 VOICE\nMINUTES PER MONTH",
      "PREMIUM COMPUTE TIER",
      "MULTI-CHAIN SUPPORT (FOR\nCRYPTO)",
      "CUSTOM ESCALATION\nWORKFLOWS",
      "PRIORITY SUPPORT",
    ],
  },
];

export function PricingSection() {
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
      className="relative overflow-hidden bg-[#F6F4EF] px-8 py-10 md:px-12 md:py-24 lg:px-16"
      id="pricing"
    >
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <div ref={titleRef} className="mb-12">
          <span className="mb-8 inline-block font-mono text-sm tracking-widest text-gray-500 uppercase">
            BILLING
          </span>
          <h2 className="font-stolzl text-3xl font-normal text-gray-900 md:text-4xl lg:text-4xl">
            We have three plans for Swift Agents
          </h2>
        </div>

        {/* Pricing Cards */}
        <div ref={cardsRef} className="grid items-start gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              className="pricing-card h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
