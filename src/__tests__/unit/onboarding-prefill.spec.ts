import {
  COUNTRY_OPTIONS,
  matchOptionValue,
  TIMEZONE_OPTIONS,
} from "@/components/dashboard/company-setup/select-options";

describe("scraped values mapped onto onboarding selects", () => {
  it("matches a scraped country name to its option value", () => {
    expect(matchOptionValue(COUNTRY_OPTIONS, "United States")).toBe("us");
    expect(matchOptionValue(COUNTRY_OPTIONS, "Nigeria")).toBe("ng");
  });

  it("leaves the country empty when it is not one of the four offered", () => {
    expect(matchOptionValue(COUNTRY_OPTIONS, "Germany")).toBe("");
    expect(matchOptionValue(COUNTRY_OPTIONS, null)).toBe("");
  });

  it("matches a timezone only when it is already an offered abbreviation", () => {
    expect(matchOptionValue(TIMEZONE_OPTIONS, "UTC")).toBe("utc");
    expect(matchOptionValue(TIMEZONE_OPTIONS, "WAT")).toBe("wat");
  });

  // The backend sends IANA identifiers. The select offers four abbreviations,
  // so nothing matches and the field stays empty. Documented rather than
  // papered over with a lossy IANA -> abbreviation table.
  it("cannot match an IANA timezone against the abbreviation options", () => {
    expect(matchOptionValue(TIMEZONE_OPTIONS, "America/New_York")).toBe("");
    expect(matchOptionValue(TIMEZONE_OPTIONS, "Africa/Lagos")).toBe("");
  });
});
