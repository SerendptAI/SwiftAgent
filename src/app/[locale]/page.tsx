import type { Metadata } from "next";
import Script from "next/script";

import { AboutSection } from "@/components/landing/about-section";
import { ContactSection } from "@/components/landing/contact-section";
import { DashboardSection } from "@/components/landing/dashboard-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MostUsedFeaturesSection } from "@/components/landing/most-used-features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
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
        <AboutSection />
        <FeaturesSection />
        <DashboardSection />
        <MostUsedFeaturesSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Script
        src="https://widget.swiftagents.org/dist/widget-ui.js"
        data-company-id="01490b45-52bd-4317-b2f7-e93264210201"
        data-base-url="https://widget.swiftagents.org"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </SmoothScrollProvider>
  );
}
