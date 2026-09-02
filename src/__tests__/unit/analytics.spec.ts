import { shouldRecordSession } from "@/lib/analytics";

// stripLocalePrefix, which this module routes through, is covered in
// locale-routing.spec.ts alongside the rest of the locale path handling.

describe("shouldRecordSession", () => {
  it("records the public marketing site", () => {
    expect(shouldRecordSession("/en")).toBe(true);
    expect(shouldRecordSession("/en/landing")).toBe(true);
    expect(shouldRecordSession("/en/products")).toBe(true);
    expect(shouldRecordSession("/en/case-studies/chowdeck")).toBe(true);
  });

  it("never records authenticated surfaces or credential entry", () => {
    expect(shouldRecordSession("/en/dashboard")).toBe(false);
    expect(shouldRecordSession("/en/dashboard/ticketing")).toBe(false);
    expect(shouldRecordSession("/en/onboarding")).toBe(false);
    expect(shouldRecordSession("/en/admin/analytics")).toBe(false);
    expect(shouldRecordSession("/en/login")).toBe(false);
    // Public, but it ends in one-time-code entry.
    expect(shouldRecordSession("/en/signup")).toBe(false);
    expect(shouldRecordSession("/en/auth/callback")).toBe(false);
  });

  it("matches whole segments, not string prefixes", () => {
    expect(shouldRecordSession("/en/demonstration")).toBe(false);
  });
});

describe("localhost gate", () => {
  const originalKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  afterEach(() => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = originalKey;
  });

  // jsdom serves tests from http://localhost/, which is exactly the case under test.
  it("stays disabled on localhost even when a key is configured", async () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";
    jest.resetModules();

    const { getConsentStatus } = await import("@/lib/analytics");

    await expect(getConsentStatus()).resolves.toBeNull();
  });
});
