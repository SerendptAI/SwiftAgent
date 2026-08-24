import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { routing } from "@/i18n/routing";

const MESSAGES_DIR = join(process.cwd(), "messages");

type Catalogue = Record<string, unknown>;

function readCatalogue(locale: string, namespace: string): Catalogue {
  const path = join(MESSAGES_DIR, locale, `${namespace}.json`);

  return JSON.parse(readFileSync(path, "utf8"));
}

function namespacesFor(locale: string): string[] {
  return readdirSync(join(MESSAGES_DIR, locale))
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}

/** Every leaf path in a catalogue, e.g. "hero.headline.customer". */
function leafKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];

  return Object.entries(value).flatMap(([key, child]) =>
    leafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

/** Names that are the same in every language and so carry no signal here. */
const BRAND_TOKENS = /Swift\s*Agents|SwiftAgents|Serendpt|SDK|ROI|AI/gi;

function translatableWordCount(value: string): number {
  return value
    .replace(BRAND_TOKENS, " ")
    .split(/[\s—–-]+/)
    .filter((word) => /[a-z]/i.test(word)).length;
}

const { defaultLocale, locales } = routing;
const translatedLocales = locales.filter((l) => l !== defaultLocale);

describe("message catalogues", () => {
  it("has a directory for every configured locale", () => {
    const present = readdirSync(MESSAGES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const locale of locales) {
      expect(present).toContain(locale);
    }
  });

  describe.each(translatedLocales)("%s", (locale) => {
    // English is merged underneath every locale, so a key that exists only in a
    // translation is unreachable — almost always a typo in the key path. It
    // would otherwise fail silently, since the English value still renders.
    it("introduces no key that English does not have", () => {
      for (const namespace of namespacesFor(locale)) {
        const englishKeys = new Set(
          leafKeys(readCatalogue(defaultLocale, namespace)),
        );
        const orphans = leafKeys(readCatalogue(locale, namespace)).filter(
          (key) => !englishKeys.has(key),
        );

        expect({ namespace, orphans }).toEqual({ namespace, orphans: [] });
      }
    });

    it("leaves no value untranslated by copy-pasting the English string", () => {
      const suspicious: string[] = [];

      for (const namespace of namespacesFor(locale)) {
        const english = readCatalogue(defaultLocale, namespace);
        const translated = readCatalogue(locale, namespace);

        const read = (source: Catalogue, path: string) =>
          path
            .split(".")
            .reduce<unknown>(
              (node, part) => (node as Catalogue | undefined)?.[part],
              source,
            );

        for (const key of leafKeys(translated)) {
          const value = read(translated, key);
          if (typeof value !== "string") continue;
          // Short strings legitimately match across locales, and brand names
          // never translate — "Blog — Swift Agents" is correct French. Measure
          // only the prose, so the check still catches a copy-pasted sentence.
          if (translatableWordCount(value) < 4) continue;
          if (value === read(english, key))
            suspicious.push(`${namespace}.${key}`);
        }
      }

      expect(suspicious).toEqual([]);
    });
  });
});
