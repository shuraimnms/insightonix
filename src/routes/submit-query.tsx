import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { CheckCircle2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/submit-query")({
  head: () => ({
    meta: [
      { title: "Submit a Query — INSIGHTONIX" },
      {
        name: "description",
        content:
          "Send a structured query to the INSIGHTONIX editorial or technical team and get a reply within two working days.",
      },
      { property: "og:title", content: "Submit a Query — INSIGHTONIX" },
      {
        property: "og:description",
        content: "Structured intake for author, reviewer, and reader queries.",
      },
    ],
    links: [{ rel: "canonical", href: "/submit-query" }],
  }),
  component: SubmitQuery,
});

const TOPICS = [
  "Manuscript submission",
  "Peer review status",
  "Revision & resubmission",
  "DOI / metadata correction",
  "Certificate / indexing letter",
  "Payment or invoice",
  "Account & login",
  "Ethics concern",
  "Other",
];

function SubmitQuery() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      topic: String(fd.get("topic") ?? ""),
      submission_id: String(fd.get("submission_id") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    try {
      await supabase.from("audit_log").insert({
        action: "query.submitted",
        entity_type: "support_query",
        meta: payload as Record<string, string>,
      });
      setSent(true);
      toast.success("Query sent — you'll hear back within two working days.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Something went wrong. Please email editorial@insightonix.com directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="Submit a query"
        intro="Send a structured question to the editorial or technical team. We reply within two working days, Monday to Saturday."
      />
      <div className="container-page py-12">
        <Breadcrumbs
          trail={[{ label: "Support", to: "/technical-support" }, { label: "Submit a Query" }]}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h2 className="font-serif text-2xl font-semibold">Your query</h2>
            <div className="mt-2 rule-gold" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" required placeholder="Dr. Aisha Rahman" />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@institution.edu"
              />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Topic *
                </label>
                <select
                  name="topic"
                  required
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Field
                label="Submission ID (if any)"
                name="submission_id"
                placeholder="INSIGHTONIX-2026-0123"
              />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Please describe your query in detail."
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                By submitting you agree to our{" "}
                <a href="/privacy" className="text-brand hover:underline">
                  privacy policy
                </a>
                .
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-elev hover:brightness-110 disabled:opacity-60"
              >
                {sent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                {loading ? "Sending…" : sent ? "Sent" : "Send query"}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/40 to-background p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
                Response times
              </div>
              <div className="mt-2 rule-gold" />
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">First reply</span>
                  <span className="font-semibold">≤ 48 hrs</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Ethics review</span>
                  <span className="font-semibold">5 days</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Certificate re-issue</span>
                  <span className="font-semibold">3 days</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
                Direct email
              </div>
              <div className="mt-2 rule-gold" />
              <p className="mt-4 text-sm text-muted-foreground">
                Editorial:{" "}
                <a href="mailto:editorial@insightonix.com" className="text-brand hover:underline">
                  editorial@insightonix.com
                </a>
                <br />
                Support:{" "}
                <a href="mailto:support@insightonix.com" className="text-brand hover:underline">
                  support@insightonix.com
                </a>
              </p>
            </div>
          </aside>
        </div>

        <CtaStrip
          eyebrow="Faster answers"
          title="Check FAQs before writing"
          intro="Many common questions about submission, DOI, and certificates are already answered."
          actions={[
            { label: "Read FAQs", to: "/faqs", primary: true },
            { label: "Technical support", to: "/technical-support" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </label>
  );
}
