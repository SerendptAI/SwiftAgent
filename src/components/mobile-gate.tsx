"use client";

/**
 * Mobile blocking is currently switched off, so the gate passes everything
 * through. It stays in the layouts (dashboard, signup, login, invite,
 * onboarding) as the single place to re-enable it; `MobileBlocker` is the
 * screen it would render.
 */
export function MobileGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
