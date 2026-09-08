import { AxiosError, AxiosHeaders } from "axios";

import { isRefreshRejection } from "@/lib/api-client";

function refreshError(status?: number, data: unknown = {}): AxiosError {
  const config = { headers: new AxiosHeaders() };
  if (status === undefined) {
    return new AxiosError("Network Error", "ERR_NETWORK", config);
  }
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
    status,
    statusText: "",
    data,
    headers: {},
    config,
  });
}

describe("isRefreshRejection", () => {
  it("reads every 4xx refusal as the end of the session", () => {
    for (const status of [400, 401, 403, 404, 409, 422]) {
      expect(isRefreshRejection(refreshError(status))).toBe(true);
    }
  });

  it("keeps the session through a failure the server never answered", () => {
    expect(isRefreshRejection(refreshError())).toBe(false);
  });

  it("keeps the session through a server fault", () => {
    for (const status of [500, 502, 503, 504]) {
      expect(isRefreshRejection(refreshError(status))).toBe(false);
    }
  });

  it("keeps the session through a timeout or a rate limit", () => {
    expect(isRefreshRejection(refreshError(408))).toBe(false);
    expect(isRefreshRejection(refreshError(429))).toBe(false);
  });

  it("ignores anything that is not a request failure", () => {
    expect(isRefreshRejection(new Error("boom"))).toBe(false);
    expect(isRefreshRejection(null)).toBe(false);
    expect(isRefreshRejection(undefined)).toBe(false);
  });
});
