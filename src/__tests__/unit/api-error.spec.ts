import { AxiosError, AxiosHeaders } from "axios";

import { getApiErrorMessage } from "@/lib/api-error";

const FALLBACK = "Unable to start checkout. Please try again.";

function apiError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
    status,
    statusText: "",
    data,
    headers: {},
    config,
  });
}

describe("getApiErrorMessage", () => {
  it("shows the backend's own validation detail", () => {
    const detail =
      "You currently have an active subscription with Polar. Please cancel it through your billing portal before switching to Bachs.";

    expect(getApiErrorMessage(apiError(400, { detail }), FALLBACK)).toBe(
      detail,
    );
  });

  it("reads the first entry of a FastAPI validation list", () => {
    expect(
      getApiErrorMessage(
        apiError(422, { detail: [{ msg: "tier is not a valid enumeration" }] }),
        FALLBACK,
      ),
    ).toBe("tier is not a valid enumeration");
    expect(
      getApiErrorMessage(
        apiError(422, { detail: ["tier is required"] }),
        FALLBACK,
      ),
    ).toBe("tier is required");
  });

  it("falls back rather than leaking axios's own status message", () => {
    expect(getApiErrorMessage(apiError(500, {}), FALLBACK)).toBe(FALLBACK);
    expect(getApiErrorMessage(apiError(400, { detail: "  " }), FALLBACK)).toBe(
      FALLBACK,
    );
    expect(getApiErrorMessage(apiError(400, { detail: 42 }), FALLBACK)).toBe(
      FALLBACK,
    );
  });

  it("lets a non-HTTP failure speak for itself", () => {
    expect(getApiErrorMessage(new Error("No company selected"), FALLBACK)).toBe(
      "No company selected",
    );
    expect(getApiErrorMessage(null, FALLBACK)).toBe(FALLBACK);
  });
});
