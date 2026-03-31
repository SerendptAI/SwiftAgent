import { AboutSection } from "@/components/landing/about-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FeaturesSection } from "@/components/landing/features-section";
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
        <FeaturesSection />
        {/* <TalkSection /> */}
        {/* <PricingSection /> */}
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
