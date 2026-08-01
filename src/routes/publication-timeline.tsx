import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { CalendarDays, Info } from "lucide-react";

export const Route = createFileRoute("/publication-timeline")({
  head: () => ({
    meta: [
      { title: "Publication Frequency — INSIGHTONIX" },
      { name: "description", content: "INSIGHTONIX publishes four regular quarterly issues every year — March, June, September, and December — with occasional special and theme-based issues." },
      { property: "og:title", content: "Publication Frequency — INSIGHTONIX" },
      { property: "og:description", content: "Quarterly publication schedule and special-issue policy of INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/publication-timeline" }],
  }),
  component: Timeline,
});

const ISSUES: [string, string][] = [
  ["First Quarterly Issue", "March"],
  ["Second Quarterly Issue", "June"],
  ["Third Quarterly Issue", "September"],
  ["Fourth Quarterly Issue", "December"],
];

const SPECIAL = [
  "Special issues",
  "Theme-based issues",
  "Conference issues",
  "Supplementary issues",
];

const CONDITIONS = [
  "Submission does not guarantee publication in a particular issue.",
  "Manuscripts are scheduled only after satisfactory peer review and final acceptance.",
  "Revision may affect the issue in which an article is published.",
  "The Editor-in-Chief retains final authority over issue scheduling.",
  "Special-issue manuscripts are subject to the same academic and ethical standards as regular submissions.",
];

function Timeline() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Publication frequency"
        title="Quarterly publication schedule"
        intro="INSIGHTONIX normally publishes four regular issues every year on a quarterly basis."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Publication Frequency" }]} />

        <section>
          <h2 className="font-serif text-2xl font-semibold">Regular issues</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ISSUES.map(([name, month]) => (
              <article key={name} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-muted text-brand">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="mt-4 font-serif text-lg font-semibold">{name}</div>
                <div className="mt-1 text-sm text-brand font-semibold uppercase tracking-wider">{month}</div>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-md border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
            The exact date of publication within each scheduled month may depend upon completion of peer review, revision, copyediting, proofreading, formatting, and editorial approval.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold">Special publications</h2>
          <div className="mt-2 rule-gold" />
          <p className="mt-3 text-sm text-muted-foreground">INSIGHTONIX may also publish:</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {SPECIAL.map((s) => (
              <li key={s} className="flex items-start gap-2 rounded-md border border-border bg-card p-3 text-sm">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Such issues shall be published only with editorial approval and must follow the journal's peer-review, ethical, plagiarism, authorship, and publication requirements.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-amber-400/40 bg-amber-50/40 p-6 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-amber-600" />
            <h2 className="font-serif text-xl font-semibold">Important conditions</h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {CONDITIONS.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-amber-600" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <CtaStrip
          eyebrow="Explore"
          title="Current issue & archives"
          actions={[
            { label: "View current issue", to: "/current-issue", primary: true },
            { label: "Browse archives", to: "/archives" },
            { label: "Submit manuscript", to: "/submit" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
