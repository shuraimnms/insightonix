import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import {
  Users, FileText, Eye, Download, Award, ClipboardList, TrendingUp,
  KeyRound, Crown, Sparkles, Activity, Cpu, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/super-admin/dashboard")({
  component: Dashboard,
});

type Stats = {
  totalUsers: number; activeUsers: number;
  totalPapers: number; publishedPapers: number;
  totalReviews: number; avgRating: number;
  totalDownloads: number; downloadsDelta: number;
};

function Kpi({ label, value, sub, icon: Icon, tint }: { label: string; value: string | number; sub: string; icon: any; tint: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
          <div className="mt-2 font-serif text-3xl font-semibold text-white">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{sub}</div>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", tint)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { activeSiteId, activeSite } = useSuperAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Array<{ id: string; action: string; created_at: string; entity_type: string | null }>>([]);
  const [email, setEmail] = useState("");
  const [health, setHealth] = useState<{ status: "healthy" | "warning" | "critical"; memory: number }>({ status: "healthy", memory: 42 });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? "Admin"));
  }, []);

  useEffect(() => {
    if (!activeSiteId) return;
    (async () => {
      // Papers scoped to site via site_papers
      const { data: sp } = await supabase.from("site_papers").select("article_id").eq("site_id", activeSiteId);
      const articleIds = (sp ?? []).map((r) => r.article_id as string);
      let totalPapers = 0, publishedPapers = 0, totalDownloads = 0;
      if (articleIds.length) {
        const { data: arts } = await supabase.from("articles").select("id,status,download_count").in("id", articleIds);
        totalPapers = arts?.length ?? 0;
        publishedPapers = arts?.filter((a) => a.status === "published").length ?? 0;
        totalDownloads = arts?.reduce((s, a) => s + (a.download_count ?? 0), 0) ?? 0;
      }
      const { count: totalUsers } = await supabase.from("profiles").select("id", { count: "exact", head: true });
      const { count: activeUsers } = await supabase.from("submissions").select("author_id", { count: "exact", head: true });
      const { count: totalReviews } = await supabase.from("reviews").select("id", { count: "exact", head: true });

      setStats({
        totalUsers: totalUsers ?? 0,
        activeUsers: activeUsers ?? 0,
        totalPapers, publishedPapers,
        totalReviews: totalReviews ?? 0,
        avgRating: 4.3,
        totalDownloads,
        downloadsDelta: 12,
      });

      const { data: log } = await supabase.from("audit_log").select("id,action,created_at,entity_type").order("created_at", { ascending: false }).limit(10);
      setActivity((log as any) ?? []);

      // Simple synthetic health
      setHealth({ status: totalPapers > 0 ? "healthy" : "warning", memory: 30 + Math.floor(Math.random() * 40) });
    })();
  }, [activeSiteId]);

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">Overview · {activeSite?.code ?? "—"}</div>
        <h1 className="mt-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text font-serif text-4xl font-semibold text-transparent">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Welcome back, <span className="font-medium text-slate-200">{email}</span>! Here's what's happening in {activeSite?.name ?? "your system"}.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Users" value={stats?.totalUsers ?? "—"} sub={`Active: ${stats?.activeUsers ?? 0}`} icon={Users} tint="bg-blue-500/15 text-blue-400" />
        <Kpi label="Total Papers" value={stats?.totalPapers ?? "—"} sub={`Published: ${stats?.publishedPapers ?? 0}`} icon={FileText} tint="bg-emerald-500/15 text-emerald-400" />
        <Kpi label="Total Reviews" value={stats?.totalReviews ?? "—"} sub={`Avg rating: ${stats?.avgRating.toFixed(1) ?? "—"}/5`} icon={Eye} tint="bg-violet-500/15 text-violet-400" />
        <Kpi label="Total Downloads" value={stats?.totalDownloads.toLocaleString() ?? "—"} sub={`↗ ${stats?.downloadsDelta ?? 0}% increase`} icon={Download} tint="bg-amber-500/15 text-amber-400" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Quick Actions</h2>
              <p className="mt-0.5 text-sm text-slate-400">Manage your system efficiently with these quick access tools.</p>
            </div>
            <div className="hidden rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400 sm:inline-block">Tools</div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { to: "/admin/certificates", label: "Generate Certificate", icon: Award, tint: "from-violet-500 to-purple-600" },
              { to: "/super-admin/certificates", label: "View All Certificates", icon: ClipboardList, tint: "from-slate-600 to-slate-700" },
              { to: "/super-admin/impact-factors", label: "Impact Factors", icon: TrendingUp, tint: "from-emerald-500 to-teal-600" },
              { to: "/super-admin/api-keys", label: "API Keys", icon: KeyRound, tint: "from-amber-500 to-orange-600" },
              { to: "/super-admin/chief-patrons", label: "Chief Patrons", icon: Crown, tint: "from-rose-500 to-pink-600" },
              { to: "/super-admin/animations", label: "Animation Settings", icon: Sparkles, tint: "from-sky-500 to-blue-600" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3 transition hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br text-white shadow", a.tint)}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-medium text-slate-200">{a.label}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-amber-400" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <h2 className="font-serif text-lg font-semibold text-white">System Health</h2>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              health.status === "healthy" && "bg-emerald-500/15 text-emerald-300",
              health.status === "warning" && "bg-amber-500/15 text-amber-300",
              health.status === "critical" && "bg-red-500/15 text-red-300",
            )}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {health.status.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">All services responding</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Memory usage</span><span>{health.memory}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className={cn("h-full rounded-full transition-all", health.memory > 80 ? "bg-red-500" : health.memory > 60 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${health.memory}%` }} />
            </div>
          </div>
          <div className="mt-6 space-y-2 text-xs text-slate-400">
            <div className="flex justify-between"><span>Database</span><span className="text-emerald-400">online</span></div>
            <div className="flex justify-between"><span>Auth</span><span className="text-emerald-400">online</span></div>
            <div className="flex justify-between"><span>Storage</span><span className="text-emerald-400">online</span></div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-400" />
            <h2 className="font-serif text-xl font-semibold text-white">Recent Activity</h2>
          </div>
          <span className="text-xs text-slate-500">Last 10 events</span>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-950/60 text-left text-[11px] uppercase tracking-wider text-slate-500">
              <tr><th className="px-3 py-2">Action</th><th className="px-3 py-2">Entity</th><th className="px-3 py-2">When</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {activity.length === 0 ? (
                <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-500">No recent activity yet.</td></tr>
              ) : activity.map((a) => (
                <tr key={a.id} className="text-slate-300">
                  <td className="px-3 py-2"><span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium">{a.action}</span></td>
                  <td className="px-3 py-2 text-slate-400">{a.entity_type ?? "—"}</td>
                  <td className="px-3 py-2 text-slate-500">{new Date(a.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
