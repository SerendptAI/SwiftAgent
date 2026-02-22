"use client";

import { AboutSection } from "@/components/landing/about-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FooterSection } from "@/components/landing/footer-section";
import { HeroSection } from "@/components/landing/hero-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  );
}
