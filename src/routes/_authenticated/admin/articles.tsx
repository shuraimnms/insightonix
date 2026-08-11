import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

type Article = {
  id: string;
  slug: string;
  title: string;
  abstract: string | null;
  authors: string[];
  keywords: string[];
  doi: string | null;
  pdf_url: string | null;
  status: string;
  issue_id: string | null;
  page_start: number | null;
  page_end: number | null;
  sort_order: number;
};
type Issue = { id: string; volume: number; number: number; year: number; title: string | null };

export const Route = createFileRoute("/_authenticated/admin/articles")({
  component: ArticlesAdmin,
});

function ArticlesAdmin() {
  const [rows, setRows] = useState<Article[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [edit, setEdit] = useState<Partial<Article> | null>(null);

  const load = async () => {
    const [a, i] = await Promise.all([
      supabase.from("articles").select("*").order("published_at", { ascending: false }),
      supabase
        .from("issues")
        .select("id,volume,number,year,title")
        .order("year", { ascending: false }),
    ]);
    setRows((a.data as Article[]) ?? []);
    setIssues((i.data as Issue[]) ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!edit) return;
    const payload = {
      slug: edit.slug!,
      title: edit.title!,
      abstract: edit.abstract ?? "",
      authors: edit.authors ?? [],
      keywords: edit.keywords ?? [],
      doi: edit.doi ?? null,
      pdf_url: edit.pdf_url ?? null,
      status: (edit.status ?? "draft") as "draft" | "published" | "archived",
      issue_id: edit.issue_id ?? null,
      page_start: edit.page_start ?? null,
      page_end: edit.page_end ?? null,
      sort_order: edit.sort_order ?? 0,
      published_at: (edit.status === "published" ? new Date().toISOString() : null) as
        string | null,
    };
    const { error } = edit.id
      ? await supabase.from("articles").update(payload).eq("id", edit.id)
      : await supabase.from("articles").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEdit(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold">Content</div>
          <h1 className="mt-1 font-serif text-3xl font-semibold">Articles</h1>
        </div>
        <a
          href={import.meta.env.VITE_API_URL.includes("localhost") ? "http://localhost:3000/admin/papers/new" : "https://universal-admin-panel-nu.vercel.app/admin/papers/new"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"
        >
          <Plus className="h-4 w-4" /> New article
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Issue</th>
              <th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => {
              const iss = issues.find((i) => i.id === r.issue_id);
              return (
                <tr key={r.id}>
                  <td className="p-3 max-w-md truncate font-medium">{r.title}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {iss ? `V${iss.volume}·I${iss.number}·${iss.year}` : "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <a
                        href={`${import.meta.env.VITE_API_URL.includes("localhost") ? "http://localhost:3000" : "https://universal-admin-panel-nu.vercel.app"}/admin/papers/${r.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md p-2 hover:bg-accent inline-flex items-center justify-center"
                      >
                        <Pencil className="h-3.5 w-3.5 text-foreground" />
                      </a>
                      <button
                        onClick={() => del(r.id)}
                        className="rounded-md p-2 text-destructive hover:bg-accent"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {edit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          onClick={() => setEdit(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-popover p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">
                {edit.id ? "Edit article" : "New article"}
              </h2>
              <button onClick={() => setEdit(null)} className="p-2 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <Field
                label="Slug"
                value={edit.slug ?? ""}
                onChange={(v) => setEdit({ ...edit, slug: v })}
              />
              <Field
                label="Title"
                value={edit.title ?? ""}
                onChange={(v) => setEdit({ ...edit, title: v })}
              />
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Abstract
                </div>
                <textarea
                  rows={5}
                  value={edit.abstract ?? ""}
                  onChange={(e) => setEdit({ ...edit, abstract: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-2 text-sm"
                />
              </div>
              <Field
                label="Authors (comma separated)"
                value={(edit.authors ?? []).join(", ")}
                onChange={(v) =>
                  setEdit({
                    ...edit,
                    authors: v
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
              <Field
                label="Keywords (comma separated)"
                value={(edit.keywords ?? []).join(", ")}
                onChange={(v) =>
                  setEdit({
                    ...edit,
                    keywords: v
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="DOI"
                  value={edit.doi ?? ""}
                  onChange={(v) => setEdit({ ...edit, doi: v })}
                />
                <Field
                  label="PDF URL"
                  value={edit.pdf_url ?? ""}
                  onChange={(v) => setEdit({ ...edit, pdf_url: v })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </div>
                  <select
                    value={edit.status ?? "draft"}
                    onChange={(e) => setEdit({ ...edit, status: e.target.value })}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Issue
                  </div>
                  <select
                    value={edit.issue_id ?? ""}
                    onChange={(e) => setEdit({ ...edit, issue_id: e.target.value || null })}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="">— none —</option>
                    {issues.map((i) => (
                      <option key={i.id} value={i.id}>
                        V{i.volume}·I{i.number}·{i.year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Sort order
                  </div>
                  <input
                    type="number"
                    value={edit.sort_order ?? 0}
                    onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Page start
                  </div>
                  <input
                    type="number"
                    value={edit.page_start ?? ""}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        page_start: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Page end
                  </div>
                  <input
                    type="number"
                    value={edit.page_end ?? ""}
                    onChange={(e) =>
                      setEdit({ ...edit, page_end: e.target.value ? Number(e.target.value) : null })
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                </div>
              </div>
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
      />
    </label>
  );
}
