import { create } from "zustand";

import type { ScrapedCompanyData } from "@/services/company";

interface OnboardingState {
  companyId: string | null;
  typedCompanyName: string;
  websiteUrl: string;
  scrapedData: ScrapedCompanyData | null;
  setCompanyId: (id: string | null) => void;
  setTypedCompanyName: (name: string) => void;
  setWebsiteUrl: (url: string) => void;
  setScrapedData: (data: ScrapedCompanyData | null) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  companyId: null,
  typedCompanyName: "",
  websiteUrl: "",
  scrapedData: null,
  setCompanyId: (id) => set({ companyId: id }),
  setTypedCompanyName: (name) => set({ typedCompanyName: name }),
  setWebsiteUrl: (url) => set({ websiteUrl: url }),
  setScrapedData: (data) => set({ scrapedData: data }),
}));
