import { toCompanyPlan } from "@/hooks/use-billing";
import type { BillingDetails, SubscriptionTier } from "@/services/billing";
import {
  canManageBilling,
  hasPaidSubscription,
  isFreeTier,
} from "@/services/billing";

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

describe("canManageBilling", () => {
  it("lets a subscriber in dunning reach the portal to fix or stop it", () => {
    expect(canManageBilling(details({ status: "inactive" }))).toBe(true);
  });

  it("keeps the portal open to a lapsed subscriber", () => {
    expect(
      canManageBilling(
        details({
          status: "canceled",
          subscription_expires_at: new Date(Date.now() - DAY_MS).toISOString(),
        }),
      ),
    ).toBe(true);
  });

  it("does not turn on paying today, unlike hasPaidSubscription", () => {
    const lapsed = details({ status: "inactive" });
    expect(hasPaidSubscription(lapsed)).toBe(false);
    expect(canManageBilling(lapsed)).toBe(true);
  });

  it("offers nothing to a company that never subscribed", () => {
    for (const tier of ["free", "none", null] as SubscriptionTier[]) {
      expect(canManageBilling(details({ tier }))).toBe(false);
    }
  });

  it("offers nothing before the details arrive", () => {
    expect(canManageBilling(undefined)).toBe(false);
  });
});

describe("toCompanyPlan", () => {
  it("reports the paid tier the backend settled on", () => {
    const plan = toCompanyPlan({
      data: details(),
      isSuccess: true,
      isError: false,
    });
    expect(plan).toMatchObject({
      tier: "startup",
      isPaid: true,
      isFree: false,
      isLoading: false,
      isError: false,
    });
  });

  it("puts a company on the free plan only once the lookup succeeds", () => {
    const plan = toCompanyPlan({
      data: details({ tier: "none", status: "inactive" }),
      isSuccess: true,
      isError: false,
    });
    expect(plan).toMatchObject({ tier: "free", isPaid: false, isFree: true });
  });

  it("calls an unfinished lookup loading, not free", () => {
    const plan = toCompanyPlan({
      data: undefined,
      isSuccess: false,
      isError: false,
    });
    expect(plan).toMatchObject({
      isPaid: false,
      isFree: false,
      isLoading: true,
      isError: false,
    });
  });

  it("never downgrades a paying company when the lookup fails", () => {
    const plan = toCompanyPlan({
      data: undefined,
      isSuccess: false,
      isError: true,
    });
    expect(plan).toMatchObject({
      isPaid: false,
      isFree: false,
      isLoading: false,
      isError: true,
    });
  });

  it("keeps stale paid details out of the flags until the refetch settles", () => {
    const plan = toCompanyPlan({
      data: details(),
      isSuccess: false,
      isError: true,
    });
    expect(plan.isPaid).toBe(false);
    expect(plan.isFree).toBe(false);
  });
});
