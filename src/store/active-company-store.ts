import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveCompanyState {
  activeCompanyId: string | null;
  setActiveCompanyId: (id: string | null) => void;
}

export const useActiveCompanyStore = create<ActiveCompanyState>()(
  persist(
    (set) => ({
      activeCompanyId: null,
      setActiveCompanyId: (id) => set({ activeCompanyId: id }),
    }),
    { name: "active-company" },
  ),
);
