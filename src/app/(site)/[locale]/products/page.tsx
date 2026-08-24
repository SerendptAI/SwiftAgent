import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations({ locale, namespace: "meta.products" });

  return {
    title: t("title"),
    description: t("description"),
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
