export const CURRENCIES = [
  { code: "NGN", symbol: "₦" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

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
  return `${sym}${fmtInt(n)}`;
}
