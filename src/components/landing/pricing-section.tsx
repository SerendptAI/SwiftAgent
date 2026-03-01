"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "YELLOW PILL",
    price: "$99",
    billing: "PER AGENT / MONTH",
    description: "BUILT FOR SMALL BUSINESSES\nWITH LOW SUPPORT VOLUME.",
    color: "#F3B03D",
    textColor: "text-[#F3B03D]",
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
    headerVisual: (
      <Image
        src="/images/pricing/icon1.svg"
        alt="Yellow Pill Plan"
        width={398}
        height={201}
        className="block h-auto w-full"
      />
    ),
  },
  {
    name: "PURPLE PILL",
    price: "$399",
    billing: "PER AGENT / MONTH",
    description:
      "BUILT FOR STARTUPS AND\nGROWING COMPANIES\nDEPLOYING AI FOR SUPPORT\nOR OPERATIONS.",
    color: "#6433CC",
    textColor: "text-[#6433CC]",
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
    headerVisual: (
      <Image
        src="/images/pricing/icon2.svg"
        alt="Purple Pill Plan"
        width={398}
        height={201}
        className="block h-auto w-full"
      />
    ),
  },
  {
    name: "ORANGE PILL",
    price: "$1,200",
    billing: "PER AGENT /\nMONTH",
    description:
      "BUILT FOR HIGH-VOLUME,\nCOMPLIANCE-HEAVY, OR\nMULTI-REGION COMPANIES.",
    color: "#F25430",
    textColor: "text-[#F25430]",
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
    headerVisual: (
      <Image
        src="/images/pricing/icon3.svg"
        alt="Orange Pill Plan"
        width={398}
        height={201}
        className="block h-auto w-full"
      />
    ),
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
      className="relative overflow-hidden bg-white px-8 py-10 md:px-12 md:py-24 lg:px-16"
      id="pricing"
    >
      {/* Container */}
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
          {plans.map((plan, i) => (
            <div
              key={i}
              className="pricing-card flex h-full flex-col border border-gray-200 bg-white"
            >
              {/* Header Visual */}
              <div className="w-full">{plan.headerVisual}</div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col px-6 py-6 pb-12 font-mono">
                <h3
                  className={`font-dm-mono mb-3 text-[13px] leading-none tracking-widest uppercase ${plan.textColor}`}
                >
                  {plan.name}
                </h3>

                <div className="mb-6 flex flex-wrap items-baseline gap-2">
                  <span className="font-dm-mono text-[13px] leading-none font-medium text-gray-900">
                    {plan.price} {plan.billing}
                  </span>
                </div>

                <p className="text-[11px] leading-[1.6] whitespace-pre-line text-gray-500 uppercase">
                  {plan.description}
                </p>

                <ul className="font-dm-mono mt-4 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-[11px] leading-[1.6] text-gray-800 uppercase"
                    >
                      <span className="mr-2 inline-block pt-[2px] text-[10px]">
                        •
                      </span>
                      <span className="whitespace-pre-line">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
