import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Plus, Trash2, Loader2 } from "lucide-react";

type Ad = Database["public"]["Tables"]["advertisements"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/advertisements")({ component: AdsAdmin });

function AdsAdmin() {
  const [rows, setRows] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ title: "", body: "", placement: "sidebar", link_url: "", image_url: "" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("advertisements").select("*").order("sort_order").order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!draft.title) return toast.error("Title is required");
    setBusy(true);
    const { error } = await supabase.from("advertisements").insert({ ...draft, sort_order: rows.length + 1 });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Advertisement added");
    setDraft({ title: "", body: "", placement: "sidebar", link_url: "", image_url: "" });
    load();
  };

  const toggle = async (r: Ad) => {
    const { error } = await supabase.from("advertisements").update({ is_active: !r.is_active }).eq("id", r.id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    const { error } = await supabase.from("advertisements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-semibold">Advertisements</h1>
        <p className="mt-1 text-sm text-muted-foreground">Banners shown on the homepage and sidebar. Only active ads within the scheduled window are shown publicly.</p>
      </header>

      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 font-serif text-lg font-semibold">New advertisement</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <select value={draft.placement} onChange={(e) => setDraft({ ...draft, placement: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
            <option value="sidebar">Sidebar</option>
            <option value="homepage">Homepage</option>
            <option value="footer">Footer</option>
          </select>
          <input placeholder="Link URL" value={draft.link_url} onChange={(e) => setDraft({ ...draft, link_url: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <input placeholder="Image URL" value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} className="h-10 rounded-md border border-border bg-background px-3 text-sm" />
          <textarea placeholder="Body / short pitch" rows={2} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="md:col-span-2 rounded-md border border-border bg-background p-3 text-sm" />
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={create} disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />)}</div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ads yet.</p>
      ) : (
        <div className="grid gap-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-widest text-brand font-semibold">{r.placement}</div>
                  {r.body ? <p className="mt-1 text-sm text-muted-foreground">{r.body}</p> : null}
                </div>
                <div className="flex flex-none gap-1">
                  <button onClick={() => toggle(r)} className={`inline-flex h-8 items-center rounded-md px-2 text-xs ${r.is_active ? "bg-brand text-brand-foreground" : "border border-border"}`}>
                    {r.is_active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => remove(r.id)} className="inline-flex h-8 items-center rounded-md border border-destructive/40 px-2 text-xs text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
