import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { issueCertificate, revokeCertificate } from "@/lib/certificates.functions";
import { Award, ShieldAlert, Plus, Loader2, Copy, ExternalLink } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
type Article = Pick<Database["public"]["Tables"]["articles"]["Row"], "id" | "title" | "status">;

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  component: CertificatesAdmin,
});

function CertificatesAdmin() {
  const [rows, setRows] = useState<Certificate[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "publication" as const,
    title: "",
    recipient_name: "",
    recipient_email: "",
    recipient_affiliation: "",
    article_id: "",
  });

  const issue = useServerFn(issueCertificate);
  const revoke = useServerFn(revokeCertificate);

  const load = async () => {
    setLoading(true);
    const [{ data: certs }, { data: arts }] = await Promise.all([
      supabase.from("certificates").select("*").order("created_at", { ascending: false }),
      supabase
        .from("articles")
        .select("id, title, status")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
    ]);
    setRows(certs ?? []);
    setArticles(arts ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.recipient_name.trim()) {
      return toast.error("Title and recipient name are required.");
    }
    setCreating(true);
    try {
      const created = await issue({
        data: {
          type: form.type,
          title: form.title.trim(),
          recipient_name: form.recipient_name.trim(),
          recipient_email: form.recipient_email.trim() || null,
          recipient_affiliation: form.recipient_affiliation.trim() || null,
          article_id: form.article_id || null,
        },
      });
      toast.success(`Certificate ${(created as Certificate).tracking_no} issued.`);
      setShowForm(false);
      setForm({
        ...form,
        title: "",
        recipient_name: "",
        recipient_email: "",
        recipient_affiliation: "",
        article_id: "",
      });
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const doRevoke = async (id: string) => {
    const reason = window.prompt("Revocation reason (optional):") ?? "";
    if (!window.confirm("Revoke this certificate? This cannot be undone.")) return;
    try {
      await revoke({ data: { id, reason } });
      toast.success("Certificate revoked.");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Certificates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Issue and manage publication, reviewer, and conference certificates. Every certificate
            is publicly verifiable at{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/verify</code>.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Issue certificate
        </button>
      </header>

      {showForm ? (
        <form onSubmit={submit} className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="publication">Publication</option>
                <option value="reviewer">Reviewer</option>
                <option value="editor">Editor</option>
                <option value="conference">Conference</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Certificate title
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recipient name
              </label>
              <input
                value={form.recipient_name}
                onChange={(e) => setForm({ ...form, recipient_name: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recipient email
              </label>
              <input
                type="email"
                value={form.recipient_email}
                onChange={(e) => setForm({ ...form, recipient_email: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Affiliation
              </label>
              <input
                value={form.recipient_affiliation}
                onChange={(e) => setForm({ ...form, recipient_affiliation: e.target.value })}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              />
            </div>
            {form.type === "publication" ? (
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Linked article (published)
                </label>
                <select
                  value={form.article_id}
                  onChange={(e) => setForm({ ...form, article_id: e.target.value })}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  required
                >
                  <option value="">Select an article…</option>
                  {articles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Award className="h-4 w-4" />
              )}
              {creating ? "Issuing…" : "Issue certificate"}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-10 text-center">
          <Award className="mx-auto h-8 w-8 text-brand" />
          <p className="mt-3 text-sm text-muted-foreground">No certificates issued yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((c) => (
                <tr key={c.id} className={c.is_valid ? "" : "bg-destructive/5"}>
                  <td className="px-4 py-3 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      {c.tracking_no}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(c.tracking_no);
                          toast.success("Copied");
                        }}
                        className="text-muted-foreground hover:text-brand"
                        aria-label="Copy tracking number"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                    {c.type}
                  </td>
                  <td className="px-4 py-3">{c.recipient_name}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{c.title}</td>
                  <td className="px-4 py-3">
                    {c.is_valid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-muted px-2 py-0.5 text-xs font-semibold text-brand">
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                        <ShieldAlert className="h-3 w-3" /> Revoked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(c.issue_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <a
                        href={`/verify?id=${c.tracking_no}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-xs hover:bg-accent"
                      >
                        <ExternalLink className="h-3 w-3" /> View
                      </a>
                      {c.is_valid ? (
                        <button
                          onClick={() => doRevoke(c.id)}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-destructive/40 px-2 text-xs text-destructive hover:bg-destructive/10"
                        >
                          Revoke
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
