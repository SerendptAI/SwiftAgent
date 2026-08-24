import type { Metadata } from "next";

import { ContactSection } from "@/components/landing/contact-section";
import { DemoHeroSection } from "@/components/landing/demo-hero-section";
import { DemoSimulatorSection } from "@/components/landing/demo-simulator-section";
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
    title: "Demo — Swift Agents",
    description:
      "See your support system before and after Swift Agents. Adjust your numbers and watch how many agents you can avoid hiring as you grow.",
    alternates: localeAlternates(locale, "/demo"),
  };
}

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
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
