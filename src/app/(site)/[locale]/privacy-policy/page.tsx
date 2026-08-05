import type { Metadata } from "next";

import { ContactSection } from "@/components/landing/contact-section";
import { Navbar } from "@/components/landing/navbar";
import { SmoothScrollProvider } from "@/components/landing/smooth-scroll-provider";
import { siteConfig } from "@/lib/site-config";

import { PrivacyContent } from "./privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy — Swift Agents",
  description:
    "Review the privacy policy for Swift Agents by Serendpt AI. Learn how we handle company, log, and user query data.",
  alternates: {
    canonical: `${siteConfig.url}/en/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#fafafa]">
        <Navbar />
        <PrivacyContent />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
