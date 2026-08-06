import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { BookOpen, ShieldCheck, Info } from "lucide-react";

export const Route = createFileRoute("/open-access-policy")({
  head: () => ({
    meta: [
      { title: "Open Access Policy — INSIGHTONIX" },
      {
        name: "description",
        content:
          "INSIGHTONIX provides open access to published content to promote wider dissemination of academic knowledge.",
      },
      { property: "og:title", content: "Open Access Policy — INSIGHTONIX" },
      {
        property: "og:description",
        content:
          "Open access statement, user and author responsibilities, and archiving policy of INSIGHTONIX.",
      },
    ],
    links: [{ rel: "canonical", href: "/open-access-policy" }],
  }),
  component: OpenAccess,
});

const USER_RESP = [
  "Provide proper citation and acknowledgement.",
  "Respect copyright and licensing conditions.",
  "Avoid unauthorized commercial reuse.",
  "Avoid misrepresentation, alteration, or misuse of published material.",
  "Obtain permission wherever required for reproduction of copyrighted content.",
];

const AUTHOR_RESP = [
  "Their manuscripts are original and unpublished.",
  "All sources are properly acknowledged.",
  "Copyrighted third-party material is used with permission.",
  "Copyright or licensing forms are completed after acceptance, wherever applicable.",
  "Published work is not republished in the same or substantially similar form without permission.",
];

function OpenAccess() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Open access"
        title="Open Access Policy"
        intro="INSIGHTONIX provides open access to its published content with the objective of promoting wider dissemination and exchange of academic knowledge."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Open Access Policy" }]} />

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">Open access statement</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Readers may access published articles for legitimate academic, educational, research,
              and professional purposes, subject to the journal's copyright and licensing
              conditions.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">Why open access</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Open access helps researchers, academicians, students, practitioners, professionals,
              policy makers, and institutions access scholarly information without subscription
              barriers.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">Access & archiving</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Published articles may be made available through the journal website and other
              approved academic, digital, archival, or indexing platforms in accordance with the
              journal's copyright and dissemination policy.
            </p>
          </article>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h2 className="font-serif text-xl font-semibold">User responsibilities</h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-3 text-sm text-muted-foreground">
              Readers using INSIGHTONIX content must:
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {USER_RESP.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h2 className="font-serif text-xl font-semibold">Author responsibilities</h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-3 text-sm text-muted-foreground">Authors must ensure that:</p>
            <ul className="mt-3 space-y-2 text-sm">
              {AUTHOR_RESP.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-12 rounded-2xl border border-amber-400/40 bg-amber-50/40 p-6 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-none text-amber-600" />
            <div>
              <div className="font-serif text-lg font-semibold">Licence notice</div>
              <p className="mt-1 text-sm text-muted-foreground">
                INSIGHTONIX follows open access. A specific Creative Commons licence has not yet
                been formally adopted by the journal administration. Until adoption, no CC BY, CC
                BY-NC, or other licence badge is displayed on published articles.
              </p>
            </div>
          </div>
        </section>

        <CtaStrip
          eyebrow="Related"
          title="Copyright policy & current issue"
          actions={[
            { label: "Copyright policy", to: "/copyright-policy", primary: true },
            { label: "Current issue", to: "/current-issue" },
            { label: "Browse archives", to: "/archives" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
