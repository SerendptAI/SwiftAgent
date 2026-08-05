import type { Metadata } from "next";

import { ComparisonSection } from "@/components/landing/comparison-section";
import { ContactSection } from "@/components/landing/contact-section";
import { DeployHoursSection } from "@/components/landing/deploy-hours-section";
import { FeaturesGridSection } from "@/components/landing/features-grid-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HomepageChatbot } from "@/components/landing/homepage-chatbot";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { IndustriesSection } from "@/components/landing/industries-section";
import { LiveInHoursBanner } from "@/components/landing/live-in-hours-banner";
import { PlatformsSection } from "@/components/landing/platforms-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { RoiCalculatorSection } from "@/components/landing/roi-calculator-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { TrustedBySection } from "@/components/landing/trusted-by-section";
import { ValuePropsSection } from "@/components/landing/value-props-section";
import { WhySwitchSection } from "@/components/landing/why-switch-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Swift Agents - AI-Powered Customer Engagement Platform",
  description:
    "Embed an intelligent AI agent on your website in minutes. Swift Agents handles customer support, sales, and voice conversations — 24/7, without lifting a finger.",
  alternates: {
    canonical: siteConfig.url,
    languages: {
      en: `${siteConfig.url}/en`,
      pl: `${siteConfig.url}/pl`,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/newlogo.svg`,
  description: siteConfig.description,
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/en?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: siteConfig.description,
  offers: {
    "@type": "Offer",
    url: `${siteConfig.url}/en#pricing`,
  },
};

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <main>
        <HeroSection />
        <TrustedBySection />
        <LiveInHoursBanner />
        <ValuePropsSection />
        <HowItWorksSection />
        <FeaturesGridSection />
        <ComparisonSection />
        <IndustriesSection />
        <RoiCalculatorSection />
        <DeployHoursSection />
        <WhySwitchSection />
        <PlatformsSection />
        <PricingSection />
        <ContactSection />
      </main>
      <HomepageChatbot />
    </SmoothScrollProvider>
  );
}
