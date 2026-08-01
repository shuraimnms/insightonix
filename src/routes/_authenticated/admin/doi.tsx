import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { registerArticleDoi, updateDoiStatus } from "@/lib/doi.functions";
import { Fingerprint, ExternalLink, Loader2, RefreshCw, Copy, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Article = Pick<
  Database["public"]["Tables"]["articles"]["Row"],
  "id" | "slug" | "title" | "status" | "doi" | "doi_status" | "doi_url" | "doi_registered_at"
>;
type Submission = Database["public"]["Tables"]["crossref_submissions"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/doi")({
  component: DoiAdmin,
});

const statusChip: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  registered: { label: "Registered", cls: "bg-brand-muted text-brand", icon: CheckCircle2 },
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", icon: Clock },
  failed: { label: "Failed", cls: "bg-destructive/10 text-destructive", icon: XCircle },
  none: { label: "No DOI", cls: "bg-muted text-muted-foreground", icon: Fingerprint },
};

function DoiAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [customDoi, setCustomDoi] = useState<Record<string, string>>({});

  const registerFn = useServerFn(registerArticleDoi);
  const updateFn = useServerFn(updateDoiStatus);

  const load = async () => {
    setLoading(true);
    const [{ data: arts }, { data: subs }] = await Promise.all([
      supabase
        .from("articles")
        .select("id, slug, title, status, doi, doi_status, doi_url, doi_registered_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase.from("crossref_submissions").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setArticles(arts ?? []);
    setSubmissions(subs ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const register = async (article: Article) => {
    setBusyId(article.id);
    try {
      const custom = customDoi[article.id]?.trim() || undefined;
      const res = await registerFn({ data: { article_id: article.id, doi: custom || null } });
      toast.success(`DOI registered: ${res.doi}`);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const setStatus = async (id: string, status: "none" | "pending" | "registered" | "failed") => {
    try {
      await updateFn({ data: { article_id: id, status } });
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const stats = {
    total: articles.length,
    registered: articles.filter((a) => a.doi_status === "registered").length,
    pending: articles.filter((a) => a.doi_status === "pending").length,
    none: articles.filter((a) => a.doi_status === "none" || !a.doi_status).length,
  };

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold">Metadata</div>
          <h1 className="mt-1 font-serif text-2xl font-semibold">DOI & Crossref</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mint DOIs for published articles and track Crossref deposit history. Format: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">10.63001/insightonix.&lt;slug&gt;</code>
          </p>
        </div>
        <button onClick={load} className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm hover:bg-accent">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Published articles", val: stats.total },
          { label: "DOIs registered", val: stats.registered },
          { label: "Pending", val: stats.pending },
          { label: "Awaiting DOI", val: stats.none },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-serif text-2xl font-semibold">{s.val}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-10 text-center">
          <Fingerprint className="mx-auto h-8 w-8 text-brand" />
          <p className="mt-3 text-sm text-muted-foreground">No published articles yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">DOI</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((a) => {
                const key = (a.doi_status ?? "none") as keyof typeof statusChip;
                const chip = statusChip[key] ?? statusChip.none;
                const Icon = chip.icon;
                return (
                  <tr key={a.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium leading-tight">{a.title}</div>
                      <div className="mt-0.5 font-mono text-xs text-muted-foreground">{a.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${chip.cls}`}>
                        <Icon className="h-3 w-3" /> {chip.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.doi ? (
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs">{a.doi}</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(a.doi!);
                              toast.success("Copied");
                            }}
                            className="text-muted-foreground hover:text-brand"
                            aria-label="Copy DOI"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          {a.doi_url ? (
                            <a
                              href={a.doi_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand hover:underline"
                              aria-label="Open DOI"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : null}
                        </div>
                      ) : (
                        <input
                          value={customDoi[a.id] ?? ""}
                          onChange={(e) => setCustomDoi({ ...customDoi, [a.id]: e.target.value })}
                          placeholder="Optional custom DOI"
                          className="h-8 w-64 rounded-md border border-border bg-background px-2 text-xs"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {a.doi_status !== "registered" ? (
                          <button
                            onClick={() => register(a)}
                            disabled={busyId === a.id}
                            className="inline-flex h-8 items-center gap-1 rounded-md bg-brand px-3 text-xs font-semibold text-brand-foreground disabled:opacity-60"
                          >
                            {busyId === a.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Fingerprint className="h-3 w-3" />}
                            Register
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatus(a.id, "pending")}
                            className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-3 text-xs hover:bg-accent"
                          >
                            Mark pending
                          </button>
                        )}
                        {a.doi_status !== "failed" ? (
                          <button
                            onClick={() => setStatus(a.id, "failed")}
                            className="inline-flex h-8 items-center gap-1 rounded-md border border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10"
                          >
                            Fail
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-lg font-semibold">Recent Crossref submissions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Latest 50 deposit attempts, newest first.</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Deposit ID</th>
                <th className="px-4 py-3">DOI</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-mono text-xs">{s.deposit_id ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{s.doi ?? "—"}</td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wider">{s.status}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
