import { create } from "zustand";

interface OnboardingState {
  companyId: string | null;
  typedCompanyName: string;
  setCompanyId: (id: string | null) => void;
  setTypedCompanyName: (name: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  companyId: null,
  typedCompanyName: "",
  setCompanyId: (id) => set({ companyId: id }),
  setTypedCompanyName: (name) => set({ typedCompanyName: name }),
}));
