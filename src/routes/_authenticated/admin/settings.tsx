import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [rows, setRows] = useState<{ key: string; value: unknown }[]>([]);

  const load = async () => {
    const { data } = await supabase.from("settings").select("*").order("key");
    setRows(data ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async (key: string, value: unknown) => {
    let parsed: unknown = value;
    if (typeof value === "string") {
      try {
        parsed = JSON.parse(value);
      } catch {
        toast.error("Invalid JSON");
        return;
      }
    }
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value: parsed as never, updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">Config</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Site settings</h1>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Values are JSON. Keys: <code className="rounded bg-secondary px-1">journal</code>,{" "}
        <code className="rounded bg-secondary px-1">contact</code>,{" "}
        <code className="rounded bg-secondary px-1">social</code>,{" "}
        <code className="rounded bg-secondary px-1">indexing</code>.
      </p>
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <SettingRow key={r.key} k={r.key} v={r.value} onSave={save} />
        ))}
      </div>
    </>
  );
}

function SettingRow({
  k,
  v,
  onSave,
}: {
  k: string;
  v: unknown;
  onSave: (k: string, v: string) => void;
}) {
  const [val, setVal] = useState(() => JSON.stringify(v, null, 2));
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="font-serif text-lg font-semibold">{k}</div>
        <button
          onClick={() => onSave(k, val)}
          className="rounded-md bg-brand px-4 py-1.5 text-xs font-semibold text-brand-foreground"
        >
          Save
        </button>
      </div>
      <textarea
        rows={Math.min(16, val.split("\n").length + 1)}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="mt-3 w-full rounded-md border border-border bg-background p-3 text-xs font-mono"
      />
    </div>
  );
}
