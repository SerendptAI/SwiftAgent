import { create } from "zustand";

interface UpgradeModalState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

export const useUpgradeModalStore = create<UpgradeModalState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export function isPlanLimitError(detail: unknown): boolean {
  if (typeof detail !== "string") return false;
  return /\bplan\s+limit\b|\bupgrade\s+to\s+(pro|enterprise|basic|premium)\b|limit\s+(for|has been|reached)/i.test(
    detail,
  );
}
