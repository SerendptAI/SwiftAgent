import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { isSanityConfigured } from "@/sanity/env";

import { StudioClient } from "./studio-client";

export const metadata: Metadata = {
  title: "Studio — Swift Agents",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  if (!isSanityConfigured()) notFound();

  return <StudioClient />;
}
