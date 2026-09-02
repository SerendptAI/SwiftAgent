import type { BillingDetails, SubscriptionTier } from "@/services/billing";
import { hasPaidSubscription, isFreeTier } from "@/services/billing";

const DAY_MS = 24 * 60 * 60 * 1000;

function details(overrides: Partial<BillingDetails> = {}): BillingDetails {
  return { tier: "startup", status: "active", ...overrides };
}

describe("isFreeTier", () => {
  it("reads every unpaid tier the backend uses as the free plan", () => {
    const unpaid: SubscriptionTier[] = ["free", "none", null];
    for (const tier of unpaid) {
      expect(isFreeTier(tier)).toBe(true);
    }
  });

  it("leaves the sold tiers alone", () => {
    const paid: SubscriptionTier[] = [
      "basic",
      "pro",
      "enterprise",
      "business",
      "startup",
      "enterprise_payg",
    ];
    for (const tier of paid) {
      expect(isFreeTier(tier)).toBe(false);
    }
  });
});

describe("hasPaidSubscription", () => {
  it("is true for an active paid tier", () => {
    expect(hasPaidSubscription(details())).toBe(true);
  });

  it("prefers subscription_status over the top-level status", () => {
    expect(
      hasPaidSubscription(
        details({ status: "active", subscription_status: "inactive" }),
      ),
    ).toBe(false);
  });

  it("keeps a canceled subscription until its paid period ends", () => {
    expect(
      hasPaidSubscription(
        details({
          status: "canceled",
          subscription_expires_at: new Date(Date.now() + DAY_MS).toISOString(),
        }),
      ),
    ).toBe(true);

    expect(
      hasPaidSubscription(
        details({
          status: "canceled",
          subscription_expires_at: new Date(Date.now() - DAY_MS).toISOString(),
        }),
      ),
    ).toBe(false);
  });

  it("never counts a canceled subscription with no expiry", () => {
    expect(hasPaidSubscription(details({ status: "canceled" }))).toBe(false);
  });

  it("is false on the free plan whatever the status says", () => {
    expect(hasPaidSubscription(details({ tier: "free" }))).toBe(false);
    expect(hasPaidSubscription(details({ tier: "none" }))).toBe(false);
    expect(hasPaidSubscription(details({ tier: null }))).toBe(false);
  });
});
