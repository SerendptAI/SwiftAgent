import { AxiosError, AxiosHeaders } from "axios";

import { isCrossProviderConflict } from "@/services/billing";

function checkoutError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
    status,
    statusText: "",
    data,
    headers: {},
    config,
  });
}

describe("isCrossProviderConflict", () => {
  it("matches the conflict in either provider direction", () => {
    expect(
      isCrossProviderConflict(
        checkoutError(400, {
          detail:
            "You currently have an active subscription with Polar. Please cancel it through your billing portal before switching to Bachs.",
        }),
      ),
    ).toBe(true);

    expect(
      isCrossProviderConflict(
        checkoutError(400, {
          detail:
            "You currently have an active subscription with Bachs. Please cancel it through your billing portal before switching to Polar.",
        }),
      ),
    ).toBe(true);
  });

  it("ignores other 400s, so they get no portal shortcut", () => {
    expect(
      isCrossProviderConflict(
        checkoutError(400, { detail: "Discount code is invalid or expired." }),
      ),
    ).toBe(false);
    expect(isCrossProviderConflict(checkoutError(400, {}))).toBe(false);
    expect(isCrossProviderConflict(checkoutError(400, { detail: 42 }))).toBe(
      false,
    );
  });

  it("ignores the same message under a non-400 status", () => {
    expect(
      isCrossProviderConflict(
        checkoutError(500, {
          detail:
            "You currently have an active subscription with Polar. Please cancel it through your billing portal before switching to Bachs.",
        }),
      ),
    ).toBe(false);
  });

  it("ignores non-axios failures", () => {
    expect(isCrossProviderConflict(new Error("Network down"))).toBe(false);
    expect(isCrossProviderConflict(null)).toBe(false);
  });
});
