import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Row = {
  id: string;
  title: string;
  abstract: string;
  status: string;
  created_at: string;
  author_id: string;
  file_url: string | null;
  co_authors: string[];
};
type StatusEnum = Database["public"]["Enums"]["submission_status"];

export const Route = createFileRoute("/_authenticated/admin/submissions")({
  component: Submissions,
});

const STATUS: StatusEnum[] = [
  "submitted",
  "under_review",
  "revision_requested",
  "accepted",
  "rejected",
  "published",
  "withdrawn",
];

function Submissions() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<Row | null>(null);

  const load = async () => {
    let q = supabase
      .from("submissions")
      .select("id,title,abstract,status,created_at,author_id,file_url,co_authors")
      .order("created_at", { ascending: false });
    if (filter) q = q.eq("status", filter as StatusEnum);
    const { data } = await q;
    setRows((data as Row[]) ?? []);
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [filter]);

  const updateStatus = async (id: string, status: StatusEnum) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const current = rows.find((r) => r.id === id);
    const { error } = await supabase.from("submissions").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    await supabase.from("decision_history").insert({
      submission_id: id,
      from_status: current?.status as StatusEnum,
      to_status: status,
      changed_by: user?.id,
      note: "Status updated by editor",
    });
    toast.success("Status updated");
    load();
    if (open?.id === id) setOpen({ ...open, status });
  };

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold">
            Editorial
          </div>
          <h1 className="mt-1 font-serif text-3xl font-semibold">Submissions inbox</h1>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted</th>
              <th className="p-3 w-40"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 max-w-lg truncate font-medium">{r.title}</td>
                <td className="p-3">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setOpen(r)}
                    className="rounded-md border border-border bg-background px-3 py-1 text-xs hover:bg-accent"
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No submissions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-popover p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl font-semibold">{open.title}</h2>
            <div className="mt-1 text-xs text-muted-foreground">
              Submitted {new Date(open.created_at).toLocaleString()}
            </div>
            <div className="mt-4 rule-gold" />
            <h3 className="mt-4 text-sm font-semibold">Abstract</h3>
            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
              {open.abstract}
            </p>
            {open.co_authors?.length ? (
              <>
                <h3 className="mt-4 text-sm font-semibold">Co-authors</h3>
                <p className="mt-1 text-sm text-muted-foreground">{open.co_authors.join(", ")}</p>
              </>
            ) : null}
            {open.file_url ? (
              <>
                <h3 className="mt-4 text-sm font-semibold">Manuscript</h3>
                <a
                  href={open.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand hover:underline"
                >
                  {open.file_url}
                </a>
              </>
            ) : null}
            <h3 className="mt-6 text-sm font-semibold">Change status</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(open.id, s)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${open.status === s ? "bg-brand text-brand-foreground" : "border border-border bg-background hover:bg-accent"}`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpen(null)}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
