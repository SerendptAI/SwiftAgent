import { AxiosError, AxiosHeaders } from "axios";

import { isAccountNotFoundError } from "@/services/auth";

function loginError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
    status,
    statusText: "",
    data,
    headers: {},
    config,
  });
}

describe("isAccountNotFoundError", () => {
  it("treats any 404 as an address with no account", () => {
    expect(isAccountNotFoundError(loginError(404, {}))).toBe(true);
    expect(
      isAccountNotFoundError(
        loginError(404, { detail: "User not found. Please sign up first." }),
      ),
    ).toBe(true);
  });

  it("reads a 400 before claiming the account is missing", () => {
    expect(
      isAccountNotFoundError(
        loginError(400, {
          detail: "No account exists for this email. Please sign up first.",
        }),
      ),
    ).toBe(true);
    expect(
      isAccountNotFoundError(
        loginError(400, {
          detail: "This account does not exist.",
        }),
      ),
    ).toBe(true);
  });

  it("leaves other 400s to the generic failure message", () => {
    expect(
      isAccountNotFoundError(
        loginError(400, { detail: "Too many codes requested." }),
      ),
    ).toBe(false);
    expect(isAccountNotFoundError(loginError(400, {}))).toBe(false);
    expect(isAccountNotFoundError(loginError(400, { detail: 42 }))).toBe(false);
  });

  it("ignores server faults and non-axios failures", () => {
    expect(
      isAccountNotFoundError(loginError(500, { detail: "No account exists" })),
    ).toBe(false);
    expect(isAccountNotFoundError(new Error("Network down"))).toBe(false);
    expect(isAccountNotFoundError(null)).toBe(false);
  });
});
