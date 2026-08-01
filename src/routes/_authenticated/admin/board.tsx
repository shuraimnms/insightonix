import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Member = { id: string; name: string; role: string; title: string | null; affiliation: string | null; country: string | null; bio: string | null; sort_order: number; is_active: boolean; email: string | null };

export const Route = createFileRoute("/_authenticated/admin/board")({
  component: BoardAdmin,
});

function BoardAdmin() {
  const [rows, setRows] = useState<Member[]>([]);
  const [edit, setEdit] = useState<Partial<Member> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("board_members").select("*").order("role").order("sort_order");
    setRows((data as Member[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit) return;
    const payload = {
      name: edit.name!, role: (edit.role ?? "editorial") as "editorial" | "advisory" | "reviewer",
      title: edit.title ?? null, affiliation: edit.affiliation ?? null, country: edit.country ?? null,
      bio: edit.bio ?? null, email: edit.email ?? null,
      sort_order: edit.sort_order ?? 0, is_active: edit.is_active ?? true,
    };
    const { error } = edit.id
      ? await supabase.from("board_members").update(payload).eq("id", edit.id)
      : await supabase.from("board_members").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEdit(null); load();
  };

  const del = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    await supabase.from("board_members").delete().eq("id", id); load();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div><div className="text-xs uppercase tracking-widest text-brand font-semibold">People</div><h1 className="mt-1 font-serif text-3xl font-semibold">Editorial board</h1></div>
        <button onClick={() => setEdit({ role: "editorial", is_active: true, sort_order: rows.length })} className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"><Plus className="h-4 w-4" /> Add member</button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-brand">{m.role}</div>
            <div className="mt-1 font-serif text-base font-semibold">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{m.affiliation}</div>
            <div className="mt-3 flex gap-1">
              <button onClick={() => setEdit(m)} className="rounded-md p-2 hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => del(m.id)} className="rounded-md p-2 text-destructive hover:bg-accent"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEdit(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-popover p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="font-serif text-xl font-semibold">{edit.id ? "Edit member" : "New member"}</h2><button onClick={() => setEdit(null)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 space-y-3">
              <F label="Name" value={edit.name ?? ""} onChange={(v) => setEdit({ ...edit, name: v })} />
              <div className="grid grid-cols-2 gap-3">
                <label><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Role</div><select value={edit.role ?? "editorial"} onChange={(e) => setEdit({ ...edit, role: e.target.value })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"><option>editorial</option><option>advisory</option><option>reviewer</option></select></label>
                <F label="Title" value={edit.title ?? ""} onChange={(v) => setEdit({ ...edit, title: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F label="Affiliation" value={edit.affiliation ?? ""} onChange={(v) => setEdit({ ...edit, affiliation: v })} />
                <F label="Country" value={edit.country ?? ""} onChange={(v) => setEdit({ ...edit, country: v })} />
              </div>
              <F label="Email" value={edit.email ?? ""} onChange={(v) => setEdit({ ...edit, email: v })} />
              <label className="block"><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Bio</div><textarea rows={4} value={edit.bio ?? ""} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} className="w-full rounded-md border border-border bg-background p-2 text-sm" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Sort order</div><input type="number" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>
                <label className="flex items-end gap-2 text-sm pb-2"><input type="checkbox" checked={!!edit.is_active} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} /> Active</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button onClick={() => setEdit(null)} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button><button onClick={save} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Save</button></div>
          </div>
        </div>
      )}
    </>
  );
}

function F({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div><input value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" /></label>;
}
