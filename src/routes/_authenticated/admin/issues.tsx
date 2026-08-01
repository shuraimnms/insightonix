import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, ListOrdered } from "lucide-react";
import { autoPaginateIssue } from "@/lib/volumes.functions";

type Issue = { id: string; volume: number; number: number; year: number; title: string | null; description: string | null; is_published: boolean; published_at: string | null };

export const Route = createFileRoute("/_authenticated/admin/issues")({
  component: IssuesAdmin,
});

function IssuesAdmin() {
  const [rows, setRows] = useState<Issue[]>([]);
  const [edit, setEdit] = useState<Partial<Issue> | null>(null);
  const paginate = useServerFn(autoPaginateIssue);

  const autoPage = async (id: string) => {
    const perStr = prompt("Pages per article?", "12");
    if (!perStr) return;
    const startStr = prompt("Start page?", "1") ?? "1";
    try {
      const res = await paginate({ data: { issue_id: id, pages_per_article: Number(perStr), start_page: Number(startStr) } });
      toast.success(`Paginated ${res.updated} articles`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const load = async () => {
    const { data } = await supabase.from("issues").select("*").order("year", { ascending: false }).order("volume", { ascending: false }).order("number", { ascending: false });
    setRows((data as Issue[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit) return;
    const payload = {
      volume: edit.volume ?? 1, number: edit.number ?? 1, year: edit.year ?? new Date().getFullYear(),
      title: edit.title ?? null, description: edit.description ?? null,
      is_published: !!edit.is_published,
      published_at: edit.is_published ? (edit.published_at ?? new Date().toISOString()) : null,
    };
    const { error } = edit.id
      ? await supabase.from("issues").update(payload).eq("id", edit.id)
      : await supabase.from("issues").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEdit(null); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete issue?")) return;
    const { error } = await supabase.from("issues").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div><div className="text-xs uppercase tracking-widest text-brand font-semibold">Content</div><h1 className="mt-1 font-serif text-3xl font-semibold">Issues</h1></div>
        <button onClick={() => setEdit({ volume: 1, number: 1, year: new Date().getFullYear(), is_published: false })} className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"><Plus className="h-4 w-4" /> New issue</button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-3">Issue</th><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3 w-24"></th></tr></thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-medium">V{r.volume} · I{r.number} · {r.year}</td>
                <td className="p-3 max-w-md truncate text-muted-foreground">{r.title}</td>
                <td className="p-3">{r.is_published ? <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-800 dark:text-emerald-200">Published</span> : <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">Draft</span>}</td>
                <td className="p-3"><div className="flex gap-1"><button onClick={() => autoPage(r.id)} title="Auto-paginate articles" className="rounded-md p-2 hover:bg-accent"><ListOrdered className="h-3.5 w-3.5" /></button><button onClick={() => setEdit(r)} className="rounded-md p-2 hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => del(r.id)} className="rounded-md p-2 text-destructive hover:bg-accent"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEdit(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-popover p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="font-serif text-xl font-semibold">{edit.id ? "Edit issue" : "New issue"}</h2><button onClick={() => setEdit(null)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <label><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Volume</div><input type="number" value={edit.volume ?? 1} onChange={(e) => setEdit({ ...edit, volume: Number(e.target.value) })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>
                <label><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Number</div><input type="number" value={edit.number ?? 1} onChange={(e) => setEdit({ ...edit, number: Number(e.target.value) })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>
                <label><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Year</div><input type="number" value={edit.year ?? new Date().getFullYear()} onChange={(e) => setEdit({ ...edit, year: Number(e.target.value) })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>
              </div>
              <label className="block"><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Title</div><input value={edit.title ?? ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>
              <label className="block"><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Description</div><textarea rows={4} value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className="w-full rounded-md border border-border bg-background p-2 text-sm" /></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.is_published} onChange={(e) => setEdit({ ...edit, is_published: e.target.checked })} /> Published</label>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button onClick={() => setEdit(null)} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button><button onClick={save} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Save</button></div>
          </div>
        </div>
      )}
    </>
  );
}
