import type { Metadata } from "next";

import { CtaSection } from "@/components/landing/cta-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Products — Swift Agents",
  description:
    "Explore Swift Agents products — AI-powered chat, voice, and support automation tools built for growing businesses.",
  alternates: {
    canonical: `${siteConfig.url}/en/products`,
  },
};

export default function ProductsPage() {
  return (
    <SmoothScrollProvider>
      <main>
        <div className="relative bg-white">
          <Navbar />
          <div className="pt-40 md:pt-48">
            <CtaSection variant="green" />
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
