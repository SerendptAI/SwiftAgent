import type { Metadata } from "next";

import { ContactSection } from "@/components/landing/contact-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Navbar } from "@/components/landing/navbar";
import { ProductsSection } from "@/components/landing/products-section";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { localeAlternates } from "@/lib/locale-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Products — Swift Agents",
    description:
      "Explore Swift Agents products — AI-powered chat, voice, and support automation tools built for growing businesses.",
    alternates: localeAlternates(locale, "/products"),
  };
}

export default function ProductsPage() {
  return (
    <SmoothScrollProvider>
      <main>
        <Navbar />
        <ProductsSection />
        <CtaSection variant="green" />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
