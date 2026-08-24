import { isLandingNavLinkActive } from "@/components/landing/nav-links";
import { routing } from "@/i18n/routing";
import { localeAlternates, localeLanguages } from "@/lib/locale-metadata";
import { stripLocalePrefix } from "@/lib/locale-path";
import { siteConfig } from "@/lib/site-config";

describe("stripLocalePrefix", () => {
  it("drops the locale segment", () => {
    expect(stripLocalePrefix("/en/dashboard")).toBe("/dashboard");
    expect(stripLocalePrefix("/en/case-studies/chowdeck")).toBe(
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

  it("does not strip a retired locale", () => {
    expect(routing.locales).not.toContain("pl");
    expect(stripLocalePrefix("/pl/agents")).toBe("/pl/agents");
  });
});

describe("localeAlternates", () => {
  // The regression this guards: a canonical pinned to the default locale tells
  // search engines every translation is a duplicate, and they get dropped.
  it("canonicalises to the locale being rendered, not the default one", () => {
    expect(localeAlternates("fr", "/agents")).toMatchObject({
      canonical: `${siteConfig.url}/fr/agents`,
    });
  });

  it("canonicalises the homepage to the prefixed URL", () => {
    expect(localeAlternates("en", "")).toMatchObject({
      canonical: `${siteConfig.url}/en`,
    });
  });

  it("advertises every shipped locale plus an x-default", () => {
    const languages = localeLanguages("/agents");

    expect(Object.keys(languages).sort()).toEqual(
      [...routing.locales, "x-default"].sort(),
    );
    expect(languages["x-default"]).toBe(
      `${siteConfig.url}/${routing.defaultLocale}/agents`,
    );
  });

  it("advertises exactly the configured locales and nothing else", () => {
    const languages = localeLanguages("/agents");

    for (const locale of routing.locales) {
      expect(languages).toHaveProperty(locale);
    }
    // `pl` was retired; a stale hreflang would keep pointing crawlers at URLs
    // that now redirect.
    expect(languages).not.toHaveProperty("pl");
  });
});

describe("isLandingNavLinkActive", () => {
  it("matches the home link on both the bare and prefixed homepage", () => {
    expect(isLandingNavLinkActive("/", "/")).toBe(true);
    expect(isLandingNavLinkActive("/", "/en")).toBe(true);
  });

  it("does not match the home link on an inner page", () => {
    expect(isLandingNavLinkActive("/", "/en/agents")).toBe(false);
  });

  it("matches an inner link regardless of locale prefix", () => {
    expect(isLandingNavLinkActive("/agents", "/agents")).toBe(true);
    expect(isLandingNavLinkActive("/agents", "/en/agents")).toBe(true);
    expect(isLandingNavLinkActive("/agents", "/en/products")).toBe(false);
  });

  it("requires the hash to match for anchor links", () => {
    expect(isLandingNavLinkActive("/#pricing", "/en", "#pricing")).toBe(true);
    expect(isLandingNavLinkActive("/#pricing", "/en", "")).toBe(false);
    expect(isLandingNavLinkActive("/#pricing", "/en/agents", "#pricing")).toBe(
      false,
    );
  });
});
