"use client";

import { AboutSection } from "@/components/landing/about-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FooterSection } from "@/components/landing/footer-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { TalkSection } from "@/components/landing/talk-section";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <main>
        <HeroSection />
        <AboutSection />
        <TalkSection />
        {/* <FeaturesSection /> */}
        <PricingSection />
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  );
}
