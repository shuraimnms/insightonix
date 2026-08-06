import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import {
  CheckCircle2,
  ShieldAlert,
  Search,
  Award,
  Calendar,
  User,
  Building2,
  FileText,
} from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({ id: z.string().optional() });

const verifyQuery = (id: string) =>
  queryOptions({
    queryKey: ["certificate-verify", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("tracking_no", id.trim().toUpperCase())
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify a Certificate — INSIGHTONIX" },
      {
        name: "description",
        content: "Verify the authenticity of any INSIGHTONIX certificate by its tracking number.",
      },
      { property: "og:title", content: "Verify a Certificate — INSIGHTONIX" },
      {
        property: "og:description",
        content: "Verify INSIGHTONIX publication, reviewer, and conference certificates.",
      },
    ],
    links: [{ rel: "canonical", href: "/verify" }],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  loaderDeps: ({ search }) => ({ id: search.id ?? "" }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(verifyQuery(deps.id)),
  component: Verify,
});

function Verify() {
  const { id } = Route.useSearch();
  const nav = useNavigate({ from: "/verify" });
  const [input, setInput] = useState(id ?? "");
  const { data: cert } = useSuspenseQuery(verifyQuery(id ?? ""));

  useEffect(() => setInput(id ?? ""), [id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav({ search: { id: input.trim().toUpperCase() }, replace: true });
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Trust & authenticity"
        title="Verify an INSIGHTONIX certificate"
        intro="Every certificate we issue has a unique INSIGHTONIX-YYYY-#### tracking number. Enter it below to confirm its authenticity in real time."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Verify" }]} />

        <form onSubmit={submit} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. INSIGHTONIX-2026-4092"
              className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              aria-label="Certificate tracking number"
            />
          </div>
          <button className="h-12 rounded-md bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-elev hover:brightness-110">
            Verify
          </button>
        </form>

        <div className="mx-auto mt-10 max-w-3xl">
          {!id ? (
            <EmptyState />
          ) : !cert ? (
            <NotFoundState id={id} />
          ) : (
            <CertificateCard cert={cert} />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
      <Award className="mx-auto h-10 w-10 text-brand" />
      <h2 className="mt-3 font-serif text-xl font-semibold">Enter a certificate tracking number</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The tracking number appears on every INSIGHTONIX certificate under the recipient's name.
      </p>
    </div>
  );
}

function NotFoundState({ id }: { id: string }) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-destructive">
            Certificate not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            No certificate exists with tracking number{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-xs">{id}</code>. Please
            double-check the value.
          </p>
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ cert }: { cert: Record<string, unknown> }) {
  const valid = cert.is_valid !== false;
  return (
    <article
      className={`rounded-2xl border ${valid ? "border-brand/40 bg-brand-muted/30" : "border-destructive/40 bg-destructive/5"} p-8 shadow-elev`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {valid ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
              <ShieldAlert className="h-6 w-6" />
            </div>
          )}
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold">
              {valid ? "Verified authentic" : "REVOKED"}
            </div>
            <div className="font-serif text-2xl font-semibold">{cert.tracking_no as string}</div>
          </div>
        </div>
        <div className="rounded-md border border-border bg-background px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
          {(cert.type as string) ?? "publication"}
        </div>
      </div>

      <div className="mt-6 rule-gold" />

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <Item icon={Award} k="Title" v={cert.title as string} />
        <Item icon={User} k="Recipient" v={cert.recipient_name as string} />
        {cert.recipient_affiliation ? (
          <Item icon={Building2} k="Affiliation" v={cert.recipient_affiliation as string} />
        ) : null}
        <Item
          icon={Calendar}
          k="Issued on"
          v={new Date(cert.issue_date as string).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
        {cert.article_id ? (
          <Item icon={FileText} k="Article" v={String(cert.article_id).slice(0, 8) + "…"} />
        ) : null}
      </dl>

      {!valid && cert.revoke_reason ? (
        <p className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <strong>Revocation reason:</strong> {cert.revoke_reason as string}
        </p>
      ) : null}
    </article>
  );
}

function Item({
  icon: Icon,
  k,
  v,
}: {
  icon: React.ComponentType<{ className?: string }>;
  k: string;
  v: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md bg-brand-muted text-brand">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <dt className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</dt>
        <dd className="mt-0.5 font-medium text-foreground">{v}</dd>
      </div>
    </div>
  );
}
