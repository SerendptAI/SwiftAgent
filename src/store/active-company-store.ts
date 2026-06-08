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

/**
 * Resets the active company and wipes its persisted localStorage entry.
 * Called on logout — otherwise the previous user's company id survives the
 * sign-out and the next user gets paywalled/billed against the wrong company.
 */
export function clearActiveCompany() {
  useActiveCompanyStore.setState({ activeCompanyId: null });
  useActiveCompanyStore.persist.clearStorage();
}
