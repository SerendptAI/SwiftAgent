export interface SelectOption {
  value: string;
  label: string;
}

export const INDUSTRY_OPTIONS: SelectOption[] = [
  { value: "tech", label: "Technology / SaaS" },
  { value: "finance", label: "Finance & Banking" },
  { value: "crypto", label: "Crypto & Web3" },
  { value: "health", label: "Healthcare" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "education", label: "Education" },
  { value: "real_estate", label: "Real Estate" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "media", label: "Media & Entertainment" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "logistics", label: "Logistics & Transportation" },
  { value: "services", label: "Professional Services" },
  { value: "other", label: "Other" },
];

export const COMPANY_SIZE_OPTIONS: SelectOption[] = [
  { value: "1-100", label: "1 – 100" },
  { value: "101-1000", label: "101 – 1,000" },
  { value: "1001-10000", label: "1,001 – 10,000" },
  { value: "10001-100000", label: "10,001 – 100,000" },
  { value: "100000+", label: "100,000+" },
];

export const BRAND_TONE_OPTIONS: SelectOption[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "playful", label: "Playful" },
  { value: "authoritative", label: "Authoritative" },
];

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const normalize = (value: string) => value.toLowerCase().trim();

/**
 * Best-effort match of a scraped free-form value against a select's options.
 * Returns the option value, or "" when nothing matches.
 */
export function matchOptionValue(
  options: SelectOption[],
  raw: string | null | undefined,
): string {
  if (!raw) return "";
  const needle = normalize(raw);
  const hit = options.find(
    (option) =>
      normalize(option.value) === needle ||
      normalize(option.label) === needle ||
      normalize(option.label)
        .split(/[^a-z0-9]+/)
        .some((word) => word.length >= 4 && needle.includes(word)),
  );
  return hit?.value ?? "";
}

/** Map a scraped size like "11-50" onto the closest company-size bucket. */
export function matchCompanySize(raw: string | null | undefined): string {
  const firstNumber = parseInt(raw?.match(/\d+/)?.[0] ?? "", 10);
  if (Number.isNaN(firstNumber)) return "";
  if (firstNumber <= 100) return "1-100";
  if (firstNumber <= 1000) return "101-1000";
  if (firstNumber <= 10000) return "1001-10000";
  if (firstNumber <= 100000) return "10001-100000";
  return "100000+";
}
