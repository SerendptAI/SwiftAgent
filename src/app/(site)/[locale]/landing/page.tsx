import type { Metadata } from "next";

import { ContactSection } from "@/components/landing/contact-section";
import { CtaSection } from "@/components/landing/cta-section";
import { IndustriesSection } from "@/components/landing/industries-section";
import { CapabilitiesSection } from "@/components/landing/scale-support/capabilities-section";
import { ChecklistSection } from "@/components/landing/scale-support/checklist-section";
import { DeploySection } from "@/components/landing/scale-support/deploy-section";
import { HeroSection } from "@/components/landing/scale-support/hero-section";
import { OutcomesSection } from "@/components/landing/scale-support/outcomes-section";
import { PricingTeaserSection } from "@/components/landing/scale-support/pricing-teaser-section";
import { ResolutionStepsSection } from "@/components/landing/scale-support/resolution-steps-section";
import { RoiCalloutBanner } from "@/components/landing/scale-support/roi-callout-banner";
import { WhyTeamsSection } from "@/components/landing/scale-support/why-teams-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { localeAlternates } from "@/lib/locale-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Scale Customer Support Without Scaling Your Team",
    description:
      "SwiftAgents helps businesses automate customer conversations, reduce support workload, and deliver faster customer experiences across every channel. Live in hours, not weeks.",
    alternates: localeAlternates(locale, "/landing"),
  };
}

export default function ScaleSupportLandingPage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-white">
        <HeroSection />
        <ChecklistSection />
        <ResolutionStepsSection />
        <CapabilitiesSection />
        <OutcomesSection />
        <WhyTeamsSection />
        <RoiCalloutBanner
          eyebrow="ROI Calculator"
          heading="See how much support cost you're currently overpaying"
          description="Calculate how many support agents you could avoid hiring with SwiftAgents."
          cta="Calculate My Savings"
        />
        <DeploySection />
        <IndustriesSection />
        <PricingTeaserSection />
        <RoiCalloutBanner
          eyebrow="Still scaling support with headcount?"
          heading="Most teams only realize their support inefficiency after they calculate it"
          description="Run the numbers and see what SwiftAgents could save you."
          cta="Run ROI Calculation"
          variant="dark"
        />
        <CtaSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
