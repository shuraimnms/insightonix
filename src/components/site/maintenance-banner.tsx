import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

export function MaintenanceBanner() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "maintenance")
      .maybeSingle()
      .then(({ data }) => {
        const v = data?.value as { enabled?: boolean; message?: string } | null;
        if (v?.enabled) setMsg(v.message ?? "Site is under maintenance.");
      });
  }, []);

  if (!msg) return null;
  return (
    <div className="border-b border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/60 dark:text-amber-100">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm">
        <AlertTriangle className="h-4 w-4 flex-none" />
        <span>{msg}</span>
      </div>
    </div>
  );
}
