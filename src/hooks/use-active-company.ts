import { useCurrentUser } from "@/hooks/use-auth";
import { useActiveCompanyStore } from "@/store/active-company-store";

export function useActiveCompanyId(): string | null {
  const stored = useActiveCompanyStore((s) => s.activeCompanyId);
  const { data: user } = useCurrentUser();
  return stored ?? user?.company_id ?? null;
}

export function useSetActiveCompanyId() {
  return useActiveCompanyStore((s) => s.setActiveCompanyId);
}
