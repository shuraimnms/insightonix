import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Inbox, Users, BookOpen, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDash,
});

type Stats = {
  submissionsThisMonth: number;
  pendingReviews: number;
  published: number;
  boardCount: number;
  totalSubmissions: number;
  accepted: number;
  rejected: number;
  totalCitations: number;
  totalViews: number;
};

function AdminDash() {
  const [s, setS] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<{ id: string; title: string; status: string; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const monthAgo = new Date(); monthAgo.setDate(1);
      const [sub, subMonth, pending, pub, board, acc, rej, arts, subsRecent] = await Promise.all([
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }).gte("created_at", monthAgo.toISOString()),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "under_review"),
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("board_members").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("submissions").select("*", { count: "exact", head: true }).in("status", ["accepted", "published"]),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "rejected"),
        supabase.from("articles").select("citation_count,view_count").eq("status", "published"),
        supabase.from("submissions").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(6),
      ]);
      setS({
        submissionsThisMonth: subMonth.count ?? 0,
        pendingReviews: pending.count ?? 0,
        published: pub.count ?? 0,
        boardCount: board.count ?? 0,
        totalSubmissions: sub.count ?? 0,
        accepted: acc.count ?? 0,
        rejected: rej.count ?? 0,
        totalCitations: (arts.data ?? []).reduce((s, a) => s + (a.citation_count ?? 0), 0),
        totalViews: (arts.data ?? []).reduce((s, a) => s + (a.view_count ?? 0), 0),
      });
      setRecent(subsRecent.data ?? []);
    })();
  }, []);

  const acceptanceRate = s && s.accepted + s.rejected > 0
    ? Math.round((s.accepted / (s.accepted + s.rejected)) * 100)
    : null;

  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">Overview</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Editorial dashboard</h1>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={Inbox} label="Submissions this month" value={s?.submissionsThisMonth ?? "…"} />
        <Card icon={Clock} label="Pending reviews" value={s?.pendingReviews ?? "…"} />
        <Card icon={FileText} label="Published articles" value={s?.published ?? "…"} />
        <Card icon={Users} label="Active board members" value={s?.boardCount ?? "…"} />
        <Card icon={CheckCircle2} label="Acceptance rate" value={acceptanceRate === null ? "—" : `${acceptanceRate}%`} />
        <Card icon={TrendingUp} label="Total citations" value={s?.totalCitations ?? "…"} />
        <Card icon={BookOpen} label="Total submissions" value={s?.totalSubmissions ?? "…"} />
        <Card icon={FileText} label="Article views" value={s?.totalViews ?? "…"} />
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-xl font-semibold">Recent submissions</h2>
        <div className="mt-2 rule-gold" />
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Submitted</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{r.status.replace("_", " ")}</span></td>
                  <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No submissions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Card({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <div className="mt-2 font-serif text-3xl font-semibold">{value}</div>
    </div>
  );
}
