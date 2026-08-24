import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations({ locale, namespace: "meta.landing" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/landing"),
  };
}

export default async function ScaleSupportLandingPage() {
  const t = await getTranslations("landing.roiBanner");

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
          eyebrow={t("first.eyebrow")}
          heading={t("first.heading")}
          description={t("first.description")}
          cta={t("first.cta")}
        />
        <DeploySection />
        <IndustriesSection />
        <PricingTeaserSection />
        <RoiCalloutBanner
          eyebrow={t("second.eyebrow")}
          heading={t("second.heading")}
          description={t("second.description")}
          cta={t("second.cta")}
          variant="dark"
        />
        <CtaSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
