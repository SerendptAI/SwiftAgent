import { isValidWebsiteUrl, normalizeWebsiteUrl } from "@/lib/website-url";

describe("normalizeWebsiteUrl", () => {
  it("adds a scheme to a bare domain", () => {
    expect(normalizeWebsiteUrl("acme.com")).toBe("https://acme.com");
    expect(normalizeWebsiteUrl("acme.com/pricing")).toBe(
      "https://acme.com/pricing",
    );
  });

  it("lowercases what FormInput uppercased on the way in", () => {
    expect(normalizeWebsiteUrl("HTTPS://ACME.COM")).toBe("https://acme.com");
    expect(normalizeWebsiteUrl("ACME.COM")).toBe("https://acme.com");
  });

  it("leaves an existing scheme alone", () => {
    expect(normalizeWebsiteUrl("http://acme.com")).toBe("http://acme.com");
  });

  it("maps blank input to blank output", () => {
    expect(normalizeWebsiteUrl("   ")).toBe("");
  });
});

describe("isValidWebsiteUrl", () => {
  it("accepts bare and schemed domains", () => {
    expect(isValidWebsiteUrl("acme.com")).toBe(true);
    expect(isValidWebsiteUrl("https://acme.co.uk")).toBe(true);
    expect(isValidWebsiteUrl("ACME.COM")).toBe(true);
  });

  it("rejects anything without a dotted host", () => {
    expect(isValidWebsiteUrl("")).toBe(false);
    expect(isValidWebsiteUrl("not a website")).toBe(false);
    expect(isValidWebsiteUrl("localhost")).toBe(false);
    expect(isValidWebsiteUrl("acme.")).toBe(false);
  });
});
