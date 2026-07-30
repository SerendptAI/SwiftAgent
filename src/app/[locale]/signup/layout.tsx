import type { Metadata } from "next";

import { MobileGate } from "@/components/mobile-gate";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your Swift Agents account and start automating customer support with AI agents in minutes.",
  robots: { index: true, follow: true },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileGate>{children}</MobileGate>;
}
