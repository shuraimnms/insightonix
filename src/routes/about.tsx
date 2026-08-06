import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FAQSection } from "@/components/site/faq-section";
import { CtaStrip } from "@/components/site/cta-strip";
import { statsQuery } from "@/lib/queries";
import { BookOpen, Globe2, ShieldCheck, Users, Sparkles, Award, Handshake } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About INSIGHTONIX — Insightonix Global Insights Journal" },
      {
        name: "description",
        content:
          "Insightonix Global Insights Journal is an international peer-reviewed open-access multidisciplinary journal dedicated to publishing innovative, high-impact research across science, engineering, technology, medicine, business, education, humanities, social sciences, and environmental studies.",
      },
      { property: "og:title", content: "About INSIGHTONIX" },
      {
        property: "og:description",
        content:
          "Peer-reviewed open-access multidisciplinary journal with external double-blind peer review.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQuery()),
  component: About,
});

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Editorial integrity",
    body: "Confidentiality, impartiality, originality, responsible authorship, and ethical research practices in every editorial decision.",
  },
  {
    icon: Users,
    title: "External double-blind review",
    body: "Every submission is evaluated through external double-blind peer review by subject-matter reviewers.",
  },
  {
    icon: Globe2,
    title: "International reach",
    body: "A platform for academicians, researchers, practitioners, and policy makers across regions and disciplines.",
  },
  {
    icon: BookOpen,
    title: "Open access",
    body: "Freely accessible published content to promote wider dissemination and exchange of academic knowledge.",
  },
];

const JOURNAL_DETAILS: [string, string][] = [
  ["Full Title", "Insightonix Global Insights Journal"],
  ["Abbreviation", "INSIGHTONIX"],
  ["Print ISSN", "Pending"],
  ["Online ISSN", "Pending"],
  ["Country of Publication", "Global"],
  ["Language", "English"],
  ["Publication Frequency", "Quarterly"],
  ["Publication Months", "March, June, September and December"],
  ["Peer-Review Model", "External Double-Blind Peer Review"],
  ["Access Model", "Open Access"],
  ["Website", "insightonix.com"],
  ["Editorial Email", "editor@insightonix.com"],
];

const ACCEPTED_TYPES = [
  "Original Research Papers",
  "Review Articles",
  "Technical Notes",
  "Case Studies",
  "Conceptual Papers",
  "Theoretical Papers",
  "Thesis Notes",
  "Book Notes",
];

const FAQS = [
  {
    q: "Is INSIGHTONIX peer-reviewed?",
    a: "Yes. Every manuscript is evaluated through an external double-blind peer-review process by subject-matter reviewers.",
  },
  {
    q: "How often does INSIGHTONIX publish?",
    a: "INSIGHTONIX normally publishes four regular issues every year — in March, June, September, and December.",
  },
  {
    q: "Is there a publication fee?",
    a: "The applicable publication or processing charges, if any, will be communicated transparently to the corresponding author before final publication. See the Publication Charges page.",
  },
  {
    q: "Which subject areas are accepted?",
    a: "Science, engineering, technology, medicine, business, education, humanities, social sciences, and environmental studies. See Focus & Scope.",
  },
  {
    q: "What manuscript types are accepted?",
    a: "Original research, review articles, technical notes, case studies, conceptual and theoretical papers, thesis notes, and book notes.",
  },
];

function About() {
  const { data: stats } = useSuspenseQuery(statsQuery());
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About the journal"
        title="Insightonix Global Insights Journal"
        intro="Insightonix Global Insights Journal is an international peer-reviewed open-access multidisciplinary journal dedicated to publishing innovative, high-impact research across science, engineering, technology, medicine, business, education, humanities, social sciences, and environmental studies."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/submit"
            className="inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-elev hover:brightness-110"
          >
            Submit your paper
          </Link>
          <Link
            to="/aims-scope"
            className="inline-flex h-11 items-center rounded-md border border-border bg-background px-5 text-sm font-semibold hover:bg-accent"
          >
            Focus & Scope
          </Link>
        </div>
      </PageHero>

      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About" }]} />

        <section className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={BookOpen} v={stats.articles} l="Published articles" />
          <Stat icon={Sparkles} v={stats.issues} l="Journal issues" />
          <Stat icon={Users} v={stats.authors} l="Distinct authors" />
          <Stat icon={Award} v={stats.board} l="Editorial board" />
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              Overview
            </div>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              A platform for academic and professional scholarship
            </h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-5 text-muted-foreground leading-relaxed">
              The journal provides a professional platform for academicians, researchers, teachers,
              students, industry professionals, managers, entrepreneurs, policy makers, and
              institutional leaders to communicate research findings, theoretical perspectives,
              practical experiences, business models, policy analyses, and interdisciplinary
              developments.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Manuscripts may be empirical, analytical, conceptual, quantitative, qualitative, or
              mixed-method, provided they make a meaningful contribution to knowledge, policy,
              professional practice, education, or socio-economic development.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              All manuscripts submitted to INSIGHTONIX are initially screened by the editorial
              office for relevance, originality, formatting, plagiarism, language quality, ethical
              compliance, and adherence to journal guidelines. Manuscripts found suitable are
              evaluated through an external double-blind peer-review process.
            </p>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold">
              Accepted manuscript categories
            </div>
            <ul className="mt-4 space-y-1.5 text-sm">
              {ACCEPTED_TYPES.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-16">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
            Editorial pillars
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold">What we stand for</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <article
                key={p.title}
                className="rounded-xl border border-border bg-card p-6 transition hover:border-brand/40 hover:shadow-elev"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
            Journal details
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold">At a glance</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {JOURNAL_DETAILS.map(([k, v]) => (
                  <tr key={k}>
                    <td className="w-64 bg-secondary/40 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                      {k}
                    </td>
                    <td className="px-5 py-3 font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
            Indexing
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold">
            Discoverable where researchers work
          </h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              "Google Scholar",
              "Crossref",
              "Dimensions",
              "ROAD",
              "BASE",
              "OpenAlex",
              "ResearchBib",
              "Scilit",
            ].map((p) => (
              <div
                key={p}
                className="flex h-16 items-center justify-center rounded-md border border-border bg-card font-serif text-sm text-muted-foreground"
              >
                {p}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              to="/indexing"
              className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
            >
              See full indexing coverage <Handshake className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Ready to publish?"
          title="Submit your manuscript to INSIGHTONIX"
          intro="Manuscripts are evaluated through external double-blind peer review. Track your submission from your author dashboard."
          actions={[
            { label: "Submit a manuscript", to: "/submit", primary: true },
            { label: "Author guidelines", to: "/author-guidelines" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}

function Stat({
  icon: Icon,
  v,
  l,
}: {
  icon: React.ComponentType<{ className?: string }>;
  v: number;
  l: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-serif text-2xl font-semibold">{v.toLocaleString()}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
      </div>
    </div>
  );
}
