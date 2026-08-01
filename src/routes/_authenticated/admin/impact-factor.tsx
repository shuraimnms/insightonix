import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Plus, Trash2, Loader2, TrendingUp } from "lucide-react";

type Impact = Database["public"]["Tables"]["impact_factors"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/impact-factor")({ component: ImpactAdmin });

function ImpactAdmin() {
  const [rows, setRows] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState({ year: new Date().getFullYear(), impact_factor: "", citations: "", publications: "", h_index: "", source: "" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("impact_factors").select("*").order("year", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!d.impact_factor) return toast.error("Impact factor is required");
    setBusy(true);
    const { error } = await supabase.from("impact_factors").insert({
      year: Number(d.year),
      impact_factor: Number(d.impact_factor),
      citations: Number(d.citations) || 0,
      publications: Number(d.publications) || 0,
      h_index: d.h_index ? Number(d.h_index) : null,
      source: d.source || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Added");
    setD({ ...d, impact_factor: "", citations: "", publications: "", h_index: "", source: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const { error } = await supabase.from("impact_factors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-semibold">Impact factor & metrics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Yearly citation and h-index numbers shown on the Indexing page.</p>
      </header>

      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 font-serif text-lg font-semibold">Add year</h2>
        <div className="grid gap-3 md:grid-cols-6">
          <input type="number" placeholder="Year" value={d.year} onChange={(e) => setD({ ...d, year: Number(e.target.value) })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <input type="number" step="0.001" placeholder="Impact factor" value={d.impact_factor} onChange={(e) => setD({ ...d, impact_factor: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <input type="number" placeholder="Citations" value={d.citations} onChange={(e) => setD({ ...d, citations: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <input type="number" placeholder="Publications" value={d.publications} onChange={(e) => setD({ ...d, publications: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <input type="number" placeholder="h-index" value={d.h_index} onChange={(e) => setD({ ...d, h_index: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <input placeholder="Source" value={d.source} onChange={(e) => setD({ ...d, source: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={create} disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />)}</div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No entries.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-brand font-semibold">{r.year}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <TrendingUp className="h-5 w-5 text-gold" />
                    <div className="font-serif text-3xl font-semibold">{Number(r.impact_factor).toFixed(3)}</div>
                  </div>
                </div>
                <button onClick={() => remove(r.id)} className="inline-flex h-8 items-center rounded-md border border-destructive/40 px-2 text-xs text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div><dt className="text-muted-foreground">Citations</dt><dd className="font-semibold">{r.citations}</dd></div>
                <div><dt className="text-muted-foreground">Pubs</dt><dd className="font-semibold">{r.publications}</dd></div>
                <div><dt className="text-muted-foreground">h-index</dt><dd className="font-semibold">{r.h_index ?? "—"}</dd></div>
              </dl>
              {r.source ? <div className="mt-2 text-[11px] text-muted-foreground">Source: {r.source}</div> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
