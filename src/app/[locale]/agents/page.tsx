import type { Metadata } from "next";

import { ContactSection } from "@/components/landing/contact-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Agents — Swift Agents",
  description:
    "AI agents that handle customer support, sales, and voice conversations for your business — 24/7.",
  alternates: {
    canonical: `${siteConfig.url}/en/agents`,
  },
};

export default function AgentsPage() {
  return (
    <SmoothScrollProvider>
      <main>
        <Navbar />
        <FeaturesSection />
        <CtaSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
