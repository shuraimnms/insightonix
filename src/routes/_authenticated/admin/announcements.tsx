import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type A = { id: string; title: string; body: string; is_published: boolean; published_at: string };

export const Route = createFileRoute("/_authenticated/admin/announcements")({ component: Ann });

function Ann() {
  const [rows, setRows] = useState<A[]>([]);
  const [edit, setEdit] = useState<Partial<A> | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("published_at", { ascending: false });
    setRows((data as A[]) ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!edit) return;
    const payload = {
      title: edit.title!,
      body: edit.body ?? "",
      is_published: !!edit.is_published,
      published_at: edit.published_at ?? new Date().toISOString(),
    };
    const { error } = edit.id
      ? await supabase.from("announcements").update(payload).eq("id", edit.id)
      : await supabase.from("announcements").insert(payload);
    if (error) return toast.error(error.message);
    setEdit(null);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold">Content</div>
          <h1 className="mt-1 font-serif text-3xl font-semibold">Announcements</h1>
        </div>
        <button
          onClick={() => setEdit({ is_published: true })}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>
      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex items-start justify-between rounded-xl border border-border bg-card p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(r.published_at).toLocaleDateString()}
                </span>
                {r.is_published ? null : (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">draft</span>
                )}
              </div>
              <div className="mt-1 font-serif text-lg font-semibold">{r.title}</div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.body}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEdit(r)} className="rounded-md p-2 hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => del(r.id)}
                className="rounded-md p-2 text-destructive hover:bg-accent"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          onClick={() => setEdit(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-popover p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">
                {edit.id ? "Edit" : "New announcement"}
              </h2>
              <button onClick={() => setEdit(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Title
                </div>
                <input
                  value={edit.title ?? ""}
                  onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                />
              </label>
              <label className="block">
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Body
                </div>
                <textarea
                  rows={6}
                  value={edit.body ?? ""}
                  onChange={(e) => setEdit({ ...edit, body: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!edit.is_published}
                  onChange={(e) => setEdit({ ...edit, is_published: e.target.checked })}
                />{" "}
                Published
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEdit(null)}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
