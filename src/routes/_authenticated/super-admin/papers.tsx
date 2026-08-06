import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { FileText, Search, ArrowUpRight } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/_authenticated/super-admin/papers")({
  validateSearch: (s) => searchSchema.parse(s),
  component: Papers,
});

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  doi: string | null;
  published_at: string | null;
  view_count: number;
  download_count: number;
};

function Papers() {
  const { activeSiteId, activeSite } = useSuperAdmin();
  const { q: initial } = useSearch({ from: "/_authenticated/super-admin/papers" });
  const [q, setQ] = useState(initial ?? "");
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!activeSiteId) return;
    (async () => {
      const { data: sp } = await supabase
        .from("site_papers")
        .select("article_id")
        .eq("site_id", activeSiteId);
      const ids = (sp ?? []).map((r) => r.article_id as string);
      if (!ids.length) {
        setRows([]);
        return;
      }
      let query = supabase
        .from("articles")
        .select("id,title,slug,status,doi,published_at,view_count,download_count")
        .in("id", ids)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(200);
      if (q.trim()) query = query.ilike("title", `%${q.trim()}%`);
      const { data } = await query;
      setRows((data as Row[]) ?? []);
    })();
  }, [activeSiteId, q]);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Content · {activeSite?.code ?? "—"}
          </div>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-white">Papers</h1>
          <p className="mt-1 text-sm text-slate-400">
            Read-only cross-site view. Full CRUD in the editorial console.
          </p>
        </div>
        <Link
          to="/admin/articles"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          Manage in /admin <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <div className="relative max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles…"
          className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-3 text-sm text-slate-200 focus:border-amber-400/60 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-sm">
          <thead className="bg-slate-950/60 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">
                <FileText className="inline h-3.5 w-3.5" /> Title
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">DOI</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Downloads</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r) => (
              <tr key={r.id} className="text-slate-300">
                <td className="px-4 py-3 font-medium text-white line-clamp-1 max-w-md">
                  {r.title}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] uppercase tracking-wider">
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.doi ?? "—"}</td>
                <td className="px-4 py-3">{r.view_count}</td>
                <td className="px-4 py-3">{r.download_count}</td>
                <td className="px-4 py-3 text-slate-500">
                  {r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No papers match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
