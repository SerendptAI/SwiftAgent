"use client";

import { type DemoCtaLocation, trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

/**
 * Booking happens on Calendly, so the click is the last thing we see of the
 * visitor — no landing pageview counts it, hence the explicit event.
 */
export function DemoBookingLink({
  location,
  className,
  children,
}: {
  location: DemoCtaLocation;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={siteConfig.demoBookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("demo_booking_clicked", { location })}
    >
      {children}
    </a>
  );
}
