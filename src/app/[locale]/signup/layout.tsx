import type { Metadata } from "next";

import { MobileGate } from "@/components/mobile-gate";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileGate>{children}</MobileGate>;
}
