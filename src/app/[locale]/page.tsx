import Script from "next/script";

import { AboutSection } from "@/components/landing/about-section";
import { ContactSection } from "@/components/landing/contact-section";
import { DashboardSection } from "@/components/landing/dashboard-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MostUsedFeaturesSection } from "@/components/landing/most-used-features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <DashboardSection />
        <MostUsedFeaturesSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Script
        src="http://localhost:3002/dist/widget-ui.js"
        data-company-id="01490b45-52bd-4317-b2f7-e93264210201"
        data-base-url="http://localhost:3002"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </SmoothScrollProvider>
  );
}
