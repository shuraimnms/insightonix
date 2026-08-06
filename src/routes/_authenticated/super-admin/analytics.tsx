import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { activeSiteId } = useSuperAdmin();
  const [rows, setRows] = useState<
    Array<{ date: string; page_views: number; unique_visitors: number; downloads: number }>
  >([]);
  useEffect(() => {
    if (!activeSiteId) return;
    supabase
      .from("site_stats")
      .select("date,page_views,unique_visitors,downloads")
      .eq("site_id", activeSiteId)
      .order("date", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setRows((data as any) ?? []);
      });
  }, [activeSiteId]);
  const totals = rows.reduce(
    (s, r) => ({ pv: s.pv + r.page_views, uv: s.uv + r.unique_visitors, dl: s.dl + r.downloads }),
    { pv: 0, uv: 0, dl: 0 },
  );
  return (
    <SectionScaffold
      eyebrow="Insights"
      title="Analytics"
      description="Per-site traffic and engagement over the last 30 days."
      icon={BarChart3}
      linkedAdminPath="/admin/analytics"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Page views (30d)", value: totals.pv.toLocaleString() },
          { label: "Unique visitors", value: totals.uv.toLocaleString() },
          { label: "Downloads", value: totals.dl.toLocaleString() },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">{k.label}</div>
            <div className="mt-2 font-serif text-3xl font-semibold text-white">{k.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-sm">
          <thead className="bg-slate-950/60 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Visitors</th>
              <th className="px-4 py-3">Downloads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r) => (
              <tr key={r.date} className="text-slate-300">
                <td className="px-4 py-3 font-mono text-xs">{r.date}</td>
                <td className="px-4 py-3">{r.page_views}</td>
                <td className="px-4 py-3">{r.unique_visitors}</td>
                <td className="px-4 py-3">{r.downloads}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No data yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </SectionScaffold>
  );
}
