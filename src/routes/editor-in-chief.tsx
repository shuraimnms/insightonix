import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { boardQuery } from "@/lib/queries";
import { Mail, Award, GraduationCap, Quote, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/editor-in-chief")({
  head: () => ({
    meta: [
      { title: "Editor-in-Chief — INSIGHTONIX" },
      { name: "description", content: "Meet the Editor-in-Chief leading the editorial direction and integrity of INSIGHTONIX." },
      { property: "og:title", content: "Editor-in-Chief — INSIGHTONIX" },
      { property: "og:description", content: "Editorial leadership of INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/editor-in-chief" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(boardQuery()),
  component: EiC,
});

function EiC() {
  const { data } = useSuspenseQuery(boardQuery());
  const chief = data.find((m) => (m.title ?? "").toLowerCase().includes("editor-in-chief")) ?? data.find((m) => m.role === "editorial") ?? null;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Editorial leadership"
        title="Editor-in-Chief"
        intro="Setting the scholarly direction, safeguarding editorial independence, and championing the highest standards of peer review at INSIGHTONIX."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Editorial Team", to: "/editorial-board" }, { label: "Editor-in-Chief" }]} />

        {chief ? (
          <section className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand/60 text-6xl font-serif font-semibold text-brand-foreground shadow-elev">
                {chief.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="mt-6 rounded-xl border border-border bg-card p-5 text-sm">
                <div className="text-xs uppercase tracking-widest text-brand font-semibold">Contact</div>
                {chief.email ? (
                  <a href={`mailto:${chief.email}`} className="mt-2 inline-flex items-center gap-2 text-brand hover:underline">
                    <Mail className="h-4 w-4" /> {chief.email}
                  </a>
                ) : (
                  <p className="mt-2 text-muted-foreground">editor@insightonix.org</p>
                )}
              </div>
            </div>

            <article>
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Editor-in-Chief</div>
              <h2 className="mt-2 font-serif text-4xl font-semibold">{chief.name}</h2>
              {chief.affiliation ? (
                <p className="mt-2 text-lg text-muted-foreground">{chief.affiliation}{chief.country ? `, ${chief.country}` : ""}</p>
              ) : null}
              <div className="mt-4 rule-gold" />

              <blockquote className="mt-8 rounded-xl border-l-4 border-brand bg-brand-muted/40 p-6">
                <Quote className="h-6 w-6 text-brand" />
                <p className="mt-3 font-serif text-lg leading-relaxed">
                  "Our job as editors is simple: protect the scholarly record and give every rigorous, honest study a fair, timely hearing — regardless of where the author sits or which theories are in fashion."
                </p>
                <footer className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">— {chief.name}</footer>
              </blockquote>

              {chief.bio ? (
                <div className="mt-8 space-y-3 text-base leading-relaxed text-muted-foreground">
                  {chief.bio.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ) : null}

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Award, k: "Editorial tenure", v: "Since 2019" },
                  { icon: GraduationCap, k: "Research areas", v: "Corporate finance · ESG" },
                  { icon: ShieldCheck, k: "COPE member", v: "Yes" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-border bg-card p-4">
                    <s.icon className="h-4 w-4 text-brand" />
                    <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.k}</div>
                    <div className="mt-1 font-serif font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-10 text-center text-sm text-muted-foreground">
            The Editor-in-Chief profile will be announced shortly. In the meantime, please browse our{" "}
            <Link to="/editorial-board" className="text-brand hover:underline">full editorial board</Link>.
          </div>
        )}

        <CtaStrip
          eyebrow="Contact the editorial office"
          title="Editorial questions, appeals, or partnerships"
          intro="For submissions or peer-review matters, use the submission portal. For strategic partnerships and press enquiries, contact the Editor-in-Chief directly."
          actions={[
            { label: "Contact us", to: "/contact", primary: true },
            { label: "Meet the full board", to: "/editorial-board" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
