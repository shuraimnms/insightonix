import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteRow = {
  id: string;
  name: string;
  code: string;
  domain: string | null;
  is_active: boolean;
};

type Ctx = {
  activeSiteId: string | null;
  activeSite: SiteRow | null;
  sites: SiteRow[];
  loading: boolean;
  setActiveSiteId: (id: string) => void;
  refresh: () => Promise<void>;
};

const SuperAdminContext = createContext<Ctx>({
  activeSiteId: null,
  activeSite: null,
  sites: [],
  loading: true,
  setActiveSiteId: () => {},
  refresh: async () => {},
});

const STORAGE_KEY = "insightonix.superadmin.activeSiteId";

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [activeSiteId, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("sites")
      .select("id,name,code,domain,is_active")
      .order("created_at", { ascending: true });
    const rows = (data as SiteRow[]) ?? [];
    setSites(rows);
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const pick = rows.find((r) => r.id === stored) ?? rows[0] ?? null;
    setActive(pick?.id ?? null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setActiveSiteId = (id: string) => {
    setActive(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  };

  const activeSite = sites.find((s) => s.id === activeSiteId) ?? null;

  return (
    <SuperAdminContext.Provider
      value={{ activeSiteId, activeSite, sites, loading, setActiveSiteId, refresh: load }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

export const useSuperAdmin = () => useContext(SuperAdminContext);
