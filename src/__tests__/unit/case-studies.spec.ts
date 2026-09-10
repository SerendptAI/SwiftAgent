import {
  CASE_STUDIES,
  getCaseStudyMetaDescription,
  getCaseStudyPlainDescription,
} from "@/lib/case-studies";

const named = CASE_STUDIES.map((cs) => [cs.id, cs] as const);

describe("getCaseStudyPlainDescription", () => {
  it.each(named)("leaves no markup in %s", (_id, caseStudy) => {
    expect(getCaseStudyPlainDescription(caseStudy)).not.toMatch(/[<>]/);
  });

  it.each(named)("does not weld sentences together in %s", (_id, caseStudy) => {
    // Stripping `</p><p>` to nothing produced "…businesses.As Selar continues…".
    expect(getCaseStudyPlainDescription(caseStudy)).not.toMatch(
      /[a-z][.!?][A-Z]/,
    );
  });

  it.each(named)("does not space off punctuation in %s", (_id, caseStudy) => {
    // Stripping inline `</strong>` to a space produced "Rank , formerly Moni".
    expect(getCaseStudyPlainDescription(caseStudy)).not.toMatch(/\s[,;:.!?]/);
  });

  it("closes up inline tags but keeps block boundaries apart", () => {
    const study = {
      ...CASE_STUDIES[0],
      description:
        "<p><strong>Rank</strong>, formerly Moni.</p><p>As more…</p>",
    };
    expect(getCaseStudyPlainDescription(study)).toBe(
      "Rank, formerly Moni. As more…",
    );
  });
});

describe("getCaseStudyMetaDescription", () => {
  it.each(named)(
    "keeps %s within the search-result limit",
    (_id, caseStudy) => {
      expect(getCaseStudyMetaDescription(caseStudy).length).toBeLessThanOrEqual(
        155,
      );
    },
  );

  it.each(named)("never cuts %s mid-word", (_id, caseStudy) => {
    const meta = getCaseStudyMetaDescription(caseStudy);
    if (!meta.endsWith("…")) return;
    const plain = getCaseStudyPlainDescription(caseStudy);
    expect(plain.startsWith(meta.slice(0, -1))).toBe(true);
    expect(plain[meta.length - 1]).toMatch(/[\s,;:—-]/);
  });

  it("passes short descriptions through untouched", () => {
    const study = { ...CASE_STUDIES[0], description: "<p>Short enough.</p>" };
    expect(getCaseStudyMetaDescription(study)).toBe("Short enough.");
  });

  it("trims trailing punctuation before the ellipsis", () => {
    const study = {
      ...CASE_STUDIES[0],
      description: `<p>${"word ".repeat(40)}tail, more</p>`,
    };
    expect(getCaseStudyMetaDescription(study)).not.toMatch(/[\s,;:—-]…$/);
  });
});
