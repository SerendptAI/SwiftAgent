"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { PlanCard } from "@/components/pricing/plan-card";
import { plansFromBackend } from "@/components/pricing/plans";
import { useBillingPlans } from "@/hooks/use-billing";
import { useRouter } from "@/i18n/navigation";
import { getAccessToken } from "@/lib/api-client";

gsap.registerPlugin(ScrollTrigger);

export function PricingSection() {
  const router = useRouter();
  const { data: backendPlans } = useBillingPlans();
  const plans = plansFromBackend(backendPlans);

  // Read the token on click rather than on render: this is a public page, so
  // anonymous visitors should not pay for a session lookup, and localStorage is
  // unavailable while it server-renders.
  const handleSubscribe = () => {
    router.push(getAccessToken() ? "/dashboard/billing" : "/signup");
  };

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

    return () => ctx.revert();
  }, [plans.length]);

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
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
