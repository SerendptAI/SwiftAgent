import type { Metadata } from "next";

import { ContactSection } from "@/components/landing/contact-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { localeAlternates } from "@/lib/locale-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Agents — Swift Agents",
    description:
      "AI agents that handle customer support, sales, and voice conversations for your business — 24/7.",
    alternates: localeAlternates(locale, "/agents"),
  };
}

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
