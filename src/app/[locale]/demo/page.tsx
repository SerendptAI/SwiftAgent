import type { Metadata } from "next";

import { ContactSection } from "@/components/landing/contact-section";
import { DemoCaseStudiesSection } from "@/components/landing/demo-casestudies-section";
import { DemoHeroSection } from "@/components/landing/demo-hero-section";
import { DemoSimulatorSection } from "@/components/landing/demo-simulator-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Demo — Swift Agents",
  description:
    "See your support system before and after Swift Agents. Adjust your numbers and watch how many agents you can avoid hiring as you grow.",
  alternates: {
    canonical: `${siteConfig.url}/en/demo`,
  },
};

export default function DemoPage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex w-full justify-center px-6 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20 lg:px-16 lg:pt-56">
          <div className="mx-auto w-full max-w-360">
            <DemoHeroSection />
            <DemoSimulatorSection />
          </div>
        </div>
        <DemoCaseStudiesSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
