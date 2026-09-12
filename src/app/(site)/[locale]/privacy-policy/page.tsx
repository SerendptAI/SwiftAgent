import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ContactSection } from "@/components/landing/contact-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { localeAlternates } from "@/lib/locale-metadata";

import { PrivacyContent } from "./privacy-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.privacy" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/privacy-policy"),
  };
}

export default function PrivacyPolicyPage() {
  return (
    <SmoothScrollProvider>
      <main className="font-jetbrains relative min-h-screen bg-[#fafafa]">
        <Navbar />
        <PrivacyContent />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
