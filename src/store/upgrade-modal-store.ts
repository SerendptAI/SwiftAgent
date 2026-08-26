import { create } from "zustand";

interface UpgradeModalState {
  open: boolean;
  /** What the visitor was reaching for, as a noun phrase the modal can name. */
  feature: string | null;
  show: (feature?: string) => void;
  hide: () => void;
}

export const useUpgradeModalStore = create<UpgradeModalState>((set) => ({
  open: false,
  feature: null,
  show: (feature) => set({ open: true, feature: feature ?? null }),
  hide: () => set({ open: false, feature: null }),
}));

export function isPlanLimitError(detail: unknown): boolean {
  if (typeof detail !== "string") return false;
  return /\bplan\s+limit\b|\bupgrade\s+to\s+(pro|enterprise|basic|premium)\b|limit\s+(for|has been|reached)/i.test(
    detail,
  );
}
