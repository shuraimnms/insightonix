import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Send, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Submission = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

function Dashboard() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [email, setEmail] = useState<string>("");
  const [isStaff, setIsStaff] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEmail(user?.email ?? "");
      const { data } = await supabase
        .from("submissions")
        .select("id,title,status,created_at")
        .eq("author_id", user?.id ?? "")
        .order("created_at", { ascending: false });
      setSubs(data ?? []);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id ?? "");
      setIsStaff(!!roles?.some((r) => r.role === "super_admin" || r.role === "editor"));
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/", replace: true });
  };

  return (
    <SiteLayout>
      <PageHero eyebrow="Your account" title="Author dashboard" intro={email} />
      <div className="container-page py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <Link
              to="/submit"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"
            >
              <Send className="h-4 w-4" /> New submission
            </Link>
            {isStaff && (
              <Link
                to="/admin"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                <ShieldCheck className="h-4 w-4" /> Admin dashboard
              </Link>
            )}
          </div>
          <button
            onClick={signOut}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <h2 className="font-serif text-2xl font-semibold">My submissions</h2>
        <div className="mt-2 rule-gold" />
        {subs.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            You have no submissions yet.
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
            {subs.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Submitted {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "bg-secondary text-secondary-foreground",
    under_review: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    revision_requested: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    published: "bg-brand text-brand-foreground",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    withdrawn: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${map[status] ?? "bg-secondary"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
