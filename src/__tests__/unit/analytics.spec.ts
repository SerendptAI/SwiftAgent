import { shouldRecordSession } from "@/lib/analytics";
import { stripLocalePrefix } from "@/lib/locale-path";

describe("stripLocalePrefix", () => {
  it("drops the locale segment", () => {
    expect(stripLocalePrefix("/en/dashboard")).toBe("/dashboard");
    expect(stripLocalePrefix("/pl/case-studies/chowdeck")).toBe(
      "/case-studies/chowdeck",
    );
  });

  it("maps a bare locale to the root", () => {
    expect(stripLocalePrefix("/en")).toBe("/");
  });

  it("leaves paths without a locale prefix alone", () => {
    expect(stripLocalePrefix("/api/visitors")).toBe("/api/visitors");
    expect(stripLocalePrefix("/english-lessons")).toBe("/english-lessons");
  });
});

describe("shouldRecordSession", () => {
  it("records the public marketing site", () => {
    expect(shouldRecordSession("/en")).toBe(true);
    expect(shouldRecordSession("/en/landing")).toBe(true);
    expect(shouldRecordSession("/pl/products")).toBe(true);
    expect(shouldRecordSession("/en/case-studies/chowdeck")).toBe(true);
    expect(shouldRecordSession("/en/signup")).toBe(true);
  });

  it("never records authenticated surfaces or credential entry", () => {
    expect(shouldRecordSession("/en/dashboard")).toBe(false);
    expect(shouldRecordSession("/en/dashboard/ticketing")).toBe(false);
    expect(shouldRecordSession("/en/onboarding")).toBe(false);
    expect(shouldRecordSession("/en/admin/analytics")).toBe(false);
    expect(shouldRecordSession("/en/login")).toBe(false);
    expect(shouldRecordSession("/en/invite")).toBe(false);
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
