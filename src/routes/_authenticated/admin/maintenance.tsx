import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/maintenance")({ component: MaintenanceAdmin });

type Mode = { enabled: boolean; message: string };
const DEFAULT: Mode = { enabled: false, message: "We're performing scheduled maintenance. Please check back shortly." };

function MaintenanceAdmin() {
  const [mode, setMode] = useState<Mode>(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "maintenance").maybeSingle().then(({ data }) => {
      if (data?.value) setMode({ ...DEFAULT, ...(data.value as Mode) });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("settings").upsert({
      key: "maintenance", value: mode as never, updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(mode.enabled ? "Maintenance mode enabled" : "Site is live");
  };

  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">Operations</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Maintenance mode</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          When enabled, visitors see a maintenance banner across every public page. Staff and admins bypass it and can continue working.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-3 ${mode.enabled ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"}`}>
            {mode.enabled ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <div className="font-serif text-lg font-semibold">{mode.enabled ? "Maintenance mode is ON" : "Site is live"}</div>
            <label className="mt-3 inline-flex items-center gap-3 text-sm">
              <input type="checkbox" checked={mode.enabled} onChange={(e) => setMode({ ...mode, enabled: e.target.checked })} />
              Enable maintenance mode
            </label>
            <label className="mt-4 block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Public banner message</div>
              <textarea rows={3} value={mode.message} onChange={(e) => setMode({ ...mode, message: e.target.value })} className="w-full rounded-md border border-border bg-background p-3 text-sm" />
            </label>
            <button onClick={save} disabled={saving} className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
