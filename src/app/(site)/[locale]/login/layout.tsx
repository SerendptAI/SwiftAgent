import type { Metadata } from "next";

import { MobileGate } from "@/components/mobile-gate";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileGate>{children}</MobileGate>;
}
