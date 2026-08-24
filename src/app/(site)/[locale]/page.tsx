import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
import { localeAlternates } from "@/lib/locale-metadata";
import { siteConfig } from "@/lib/site-config";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, ""),
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/newlogo.svg`,
  description: siteConfig.description,
  sameAs: [],
};

// The entry points below are real, locale-prefixed URLs, so they follow the
// locale being rendered rather than pinning search engines to English.
const websiteJsonLd = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/${locale}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

const softwareApplicationJsonLd = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: siteConfig.description,
  offers: {
    "@type": "Offer",
    url: `${siteConfig.url}/${locale}#pricing`,
  },
});

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <SmoothScrollProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd(locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd(locale)),
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
