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
  return typeof detail === "string" && /\bplan\s+limit\b/i.test(detail);
}
