import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type P = { id: string; slug: string; title: string; content: string; meta_description: string | null };

export const Route = createFileRoute("/_authenticated/admin/pages")({ component: PagesAdmin });

function PagesAdmin() {
  const [rows, setRows] = useState<P[]>([]);
  const [sel, setSel] = useState<P | null>(null);

  const load = async () => {
    const { data } = await supabase.from("pages").select("*").order("slug");
    setRows((data as P[]) ?? []);
    if (sel) setSel(((data as P[]) ?? []).find((r) => r.id === sel.id) ?? null);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const save = async () => {
    if (!sel) return;
    const { error } = await supabase.from("pages").update({
      title: sel.title, content: sel.content, meta_description: sel.meta_description,
    }).eq("id", sel.id);
    if (error) return toast.error(error.message);
    toast.success("Saved"); load();
  };

  return (
    <>
      <div><div className="text-xs uppercase tracking-widest text-brand font-semibold">Content</div><h1 className="mt-1 font-serif text-3xl font-semibold">Editable pages</h1></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside>
          <ul className="space-y-1">
            {rows.map((r) => (
              <li key={r.id}>
                <button onClick={() => setSel(r)} className={`w-full text-left rounded-md px-3 py-2 text-sm ${sel?.id === r.id ? "bg-brand text-brand-foreground" : "hover:bg-accent"}`}>
                  {r.title}
                  <div className="text-xs opacity-70 truncate">/{r.slug}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div>
          {sel ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <label className="block"><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Title</div><input value={sel.title} onChange={(e) => setSel({ ...sel, title: e.target.value })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>
              <label className="mt-3 block"><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Meta description</div><input value={sel.meta_description ?? ""} onChange={(e) => setSel({ ...sel, meta_description: e.target.value })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>
              <label className="mt-3 block"><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Content (Markdown-ish: ## H2, ### H3, - list, **bold**)</div>
                <textarea rows={22} value={sel.content} onChange={(e) => setSel({ ...sel, content: e.target.value })} className="w-full rounded-md border border-border bg-background p-3 text-sm font-mono" />
              </label>
              <div className="mt-4 flex justify-end"><button onClick={save} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Save</button></div>
            </div>
          ) : <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">Select a page to edit.</div>}
        </div>
      </div>
    </>
  );
}
