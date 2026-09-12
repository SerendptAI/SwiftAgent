import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations({ locale, namespace: "meta.agents" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/agents"),
  };
}

export default function AgentsPage() {
  return (
    <SmoothScrollProvider>
      <main className="font-jetbrains">
        <Navbar />
        <FeaturesSection />
        <CtaSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
