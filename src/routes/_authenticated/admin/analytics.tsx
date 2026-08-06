import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Download, FileText, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsAdmin,
});

type Row = { label: string; count: number };

function AnalyticsAdmin() {
  const [stats, setStats] = useState({ visitors: 0, downloads: 0, articles: 0, subs: 0, users: 0 });
  const [topPaths, setTopPaths] = useState<Row[]>([]);
  const [topArticles, setTopArticles] = useState<Row[]>([]);
  const [daily, setDaily] = useState<{ day: string; visits: number }[]>([]);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const [v, d, a, s, u, vs, arts] = await Promise.all([
        supabase.from("visitors").select("*", { count: "exact", head: true }),
        supabase.from("downloads").select("*", { count: "exact", head: true }),
        supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "published"),
        supabase.from("subscribers").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }),
        supabase.from("visitors").select("path, created_at").gte("created_at", since).limit(5000),
        supabase
          .from("articles")
          .select("id, title, view_count, download_count")
          .order("view_count", { ascending: false })
          .limit(10),
      ]);
      setStats({
        visitors: v.count ?? 0,
        downloads: d.count ?? 0,
        articles: a.count ?? 0,
        subs: s.count ?? 0,
        users: u.count ?? 0,
      });
      const pathBuckets = new Map<string, number>();
      const dayBuckets = new Map<string, number>();
      (vs.data ?? []).forEach((r: { path: string; created_at: string }) => {
        pathBuckets.set(r.path, (pathBuckets.get(r.path) ?? 0) + 1);
        const day = r.created_at.slice(0, 10);
        dayBuckets.set(day, (dayBuckets.get(day) ?? 0) + 1);
      });
      setTopPaths(
        [...pathBuckets.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([label, count]) => ({ label, count })),
      );
      setDaily([...dayBuckets.entries()].sort().map(([day, visits]) => ({ day, visits })));
      setTopArticles((arts.data ?? []).map((r) => ({ label: r.title, count: r.view_count })));
    })();
  }, []);

  const maxDaily = Math.max(1, ...daily.map((d) => d.visits));

  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">Insights</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Traffic, downloads, and content performance across the last 30 days.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat icon={Eye} label="Visitors (all)" value={stats.visitors} />
        <Stat icon={Download} label="Downloads" value={stats.downloads} />
        <Stat icon={FileText} label="Published articles" value={stats.articles} />
        <Stat icon={Users} label="Users w/ roles" value={stats.users} />
        <Stat icon={TrendingUp} label="Newsletter subs" value={stats.subs} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="font-serif text-lg font-semibold">Daily visits (30d)</div>
          <div className="mt-4 flex h-40 items-end gap-1">
            {daily.length === 0 && (
              <div className="text-sm text-muted-foreground">No visit data yet.</div>
            )}
            {daily.map((d) => (
              <div
                key={d.day}
                className="flex flex-1 flex-col items-center gap-1"
                title={`${d.day}: ${d.visits}`}
              >
                <div
                  className="w-full rounded-t bg-brand/70"
                  style={{ height: `${(d.visits / maxDaily) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{daily[0]?.day ?? ""}</span>
            <span>{daily[daily.length - 1]?.day ?? ""}</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="font-serif text-lg font-semibold">Top pages</div>
          <ul className="mt-3 space-y-2 text-sm">
            {topPaths.map((p) => (
              <li key={p.label} className="flex justify-between border-b border-border/60 pb-1">
                <span className="truncate pr-3 font-mono text-xs">{p.label}</span>
                <span className="text-muted-foreground">{p.count}</span>
              </li>
            ))}
            {topPaths.length === 0 && (
              <li className="text-sm text-muted-foreground">No page views tracked yet.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <div className="font-serif text-lg font-semibold">Top articles by views</div>
        <ul className="mt-3 space-y-2 text-sm">
          {topArticles.map((a) => (
            <li key={a.label} className="flex justify-between border-b border-border/60 pb-1">
              <span className="truncate pr-3">{a.label}</span>
              <span className="text-muted-foreground">{a.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-2 font-serif text-3xl font-semibold">{value.toLocaleString()}</div>
    </div>
  );
}
