export const CURRENCIES = [
  { code: "NGN", symbol: "₦" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// USD-based mid-market rates (approx., as of 2026-07-01).
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  NGN: 1388,
  EUR: 0.879,
  GBP: 0.753,
};

export const BENCHMARK = 1200;

export function fmtDec(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function fmtInt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtMoney(n: number, sym: string) {
  return `${sym}${Math.ceil(n).toLocaleString("en-US")}`;
}
