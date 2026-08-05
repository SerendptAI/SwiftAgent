import type { Metadata } from "next";

import { MobileGate } from "@/components/mobile-gate";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileGate>{children}</MobileGate>;
}
