import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer a Founder",
  description:
    "Refer a founder to Swift Agents and win rewards. Share your referral link and earn when the businesses you know start automating their customer support.",
};

export default function ReferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
