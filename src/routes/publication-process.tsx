import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { FAQSection } from "@/components/site/faq-section";
import {
  UploadCloud,
  ShieldCheck,
  Users,
  MessageSquare,
  FileCheck2,
  BookOpen,
  Hash,
  Award,
  Clock,
} from "lucide-react";
import { StepFlow } from "@/components/site/step-flow";

export const Route = createFileRoute("/publication-process")({
  head: () => ({
    meta: [
      { title: "Publication Process — INSIGHTONIX" },
      {
        name: "description",
        content:
          "The end-to-end INSIGHTONIX publication journey: submission, editorial screening, double-blind review, decision, production, DOI registration, and post-publication support.",
      },
      { property: "og:title", content: "Publication Process — INSIGHTONIX" },
      {
        property: "og:description",
        content: "The eight-step editorial workflow from submission to indexing.",
      },
    ],
    links: [{ rel: "canonical", href: "/publication-process" }],
  }),
  component: Process,
});

const STEPS = [
  {
    icon: UploadCloud,
    title: "Submission",
    sla: "Day 0",
    body: "Upload anonymised manuscript, title page, and declarations via the online submission workflow. Acknowledgement email within 48 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Editorial screening",
    sla: "Day 1–7",
    body: "Scope, structure, language, and similarity check (≤15% via iThenticate). Out-of-scope or under-prepared work is desk-rejected transparently.",
  },
  {
    icon: Users,
    title: "Double-blind peer review",
    sla: "Week 2–6",
    body: "Two independent expert reviewers evaluate originality, methodology, contribution, and clarity. A third reviewer is added when opinions diverge.",
  },
  {
    icon: MessageSquare,
    title: "First decision",
    sla: "Week 6–8",
    body: "Handling editor synthesises reviews and issues one of: Accept, Minor Revision, Major Revision, or Reject — with a full anonymised report.",
  },
  {
    icon: FileCheck2,
    title: "Revision & re-review",
    sla: "Week 8–12",
    body: "Authors submit a point-by-point response and revised manuscript. Revisions are re-evaluated by the original reviewers whenever possible.",
  },
  {
    icon: BookOpen,
    title: "Production & proofing",
    sla: "1–2 weeks",
    body: "Copy-editing, typesetting, figure clean-up, and reference validation. Authors approve the proof before final publication.",
  },
  {
    icon: Hash,
    title: "DOI & publication",
    sla: "Next issue",
    body: "Article is assigned a permanent Crossref DOI, deposited with full metadata, and published open access under CC BY.",
  },
  {
    icon: Award,
    title: "Indexing & certificate",
    sla: "Rolling",
    body: "Metadata is pushed to Google Scholar, Crossref, ROAD, and other partners. Authors receive a verifiable publication certificate.",
  },
];

const SLAS = [
  { label: "Acknowledgement", value: "≤ 48 hrs" },
  { label: "First decision", value: "4–6 weeks" },
  { label: "Revision review", value: "2–4 weeks" },
  { label: "Publication after acceptance", value: "6–8 weeks" },
];

const FAQS = [
  {
    q: "How do I check the status of my submission?",
    a: "Log in to your author dashboard. Each stage — screening, review, decision, production — updates in real time and is emailed to the corresponding author.",
  },
  {
    q: "Can I withdraw a manuscript mid-review?",
    a: "Yes, until a decision is issued. Send a signed withdrawal request from all co-authors to the editorial office; withdrawal after acceptance is discouraged and may attract processing costs.",
  },
  {
    q: "What happens if reviewers disagree?",
    a: "The handling editor may invite an additional reviewer or make a considered decision based on the balance of the reports, always weighted toward rigour and reproducibility.",
  },
];

function Process() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Editorial workflow"
        title="From submission to indexed publication"
        intro="A transparent, service-level-driven pipeline designed to give authors fast, fair, and constructive decisions — without compromising on academic rigour."
      />
      <div className="container-page py-12">
        <Breadcrumbs
          trail={[
            { label: "For Authors", to: "/author-guidelines" },
            { label: "Publication Process" },
          ]}
        />

        {/* SLA band */}
        <section className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand text-brand-foreground shadow-elev">
          <div className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4 lg:p-10">
            {SLAS.map((s) => (
              <div key={s.label} className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                <Clock className="h-5 w-5 opacity-80" />
                <div className="mt-3 font-serif text-2xl font-semibold">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider opacity-90">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sequential flow */}
        <section className="mt-14">
          <h2 className="font-serif text-3xl font-semibold">The eight-step editorial pipeline</h2>
          <div className="mt-2 rule-gold" />
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Each stage unlocks the next — watch the workflow assemble step by step, mirroring how
            your manuscript progresses through the editorial system.
          </p>

          <div className="mt-10 overflow-x-auto pb-4">
            <StepFlow steps={STEPS} variant="detailed" stagger={0.5} />
          </div>
        </section>

        {/* Detailed timeline */}
        <section className="mt-14">
          <h3 className="font-serif text-2xl font-semibold">Stage-by-stage detail</h3>
          <div className="mt-2 rule-gold" />
          <ol className="relative mt-8 space-y-6 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-border sm:before:left-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative pl-16 sm:pl-20">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-brand/30 bg-background text-brand shadow-elev sm:h-16 sm:w-16">
                  <s.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <article className="rounded-xl border border-border bg-card p-5 transition hover:border-brand/40 hover:shadow-elev">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        Step {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-serif text-xl font-semibold">{s.title}</h4>
                    </div>
                    <span className="rounded-full border border-brand/30 bg-brand-muted/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
                      {s.sla}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Ready to begin?"
          title="Start your submission today"
          intro="Follow the online workflow — anonymised manuscript, title page, declarations. You'll have an acknowledgement in your inbox within 48 hours."
          actions={[
            { label: "Submit a manuscript", to: "/submit", primary: true },
            { label: "Publication timeline", to: "/publication-timeline" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
