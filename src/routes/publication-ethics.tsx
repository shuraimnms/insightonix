import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FAQSection } from "@/components/site/faq-section";
import { CtaStrip } from "@/components/site/cta-strip";
import { ShieldCheck, AlertTriangle, Users, FileText, BadgeAlert, Scale, Repeat, EyeOff, Ban } from "lucide-react";

export const Route = createFileRoute("/publication-ethics")({
  head: () => ({
    meta: [
      { title: "Publication Ethics & Malpractice Statement — INSIGHTONIX" },
      { name: "description", content: "INSIGHTONIX follows COPE guidelines for authorship, peer review, conflicts of interest, plagiarism, corrections, and retractions." },
      { property: "og:title", content: "Publication Ethics — INSIGHTONIX" },
      { property: "og:description", content: "COPE-aligned ethics and malpractice statement." },
    ],
    links: [{ rel: "canonical", href: "/publication-ethics" }],
  }),
  component: Ethics,
});

const RESP = [
  {
    icon: FileText,
    who: "Authors",
    points: [
      "Submit original, un-published work; disclose all prior versions and preprints.",
      "List only those who materially contributed; acknowledge all funders and conflicts.",
      "Provide raw data on reasonable editorial request; retain data for at least 5 years.",
      "Cite sources fully and transparently — including self-citations.",
    ],
  },
  {
    icon: Users,
    who: "Reviewers",
    points: [
      "Treat manuscripts as confidential; do not share or use unpublished data.",
      "Decline invitations where a conflict of interest exists.",
      "Provide constructive, evidence-based feedback within the agreed timeline.",
      "Alert editors to suspected duplicate publication, plagiarism, or fabrication.",
    ],
  },
  {
    icon: ShieldCheck,
    who: "Editors",
    points: [
      "Make decisions based solely on scholarly merit and fit with the journal.",
      "Preserve reviewer anonymity and manuscript confidentiality.",
      "Recuse from handling any submission with a real or perceived conflict.",
      "Publish corrections, expressions of concern, and retractions promptly.",
    ],
  },
];

const MISCONDUCT = [
  { icon: EyeOff, title: "Plagiarism", body: "All submissions are screened with Turnitin. Similarity above 15% (excluding references/quoted matter) is grounds for immediate rejection." },
  { icon: Repeat, title: "Duplicate submission", body: "Concurrent submission to multiple journals or re-publication of substantially similar work is not permitted." },
  { icon: BadgeAlert, title: "Data fabrication", body: "Manipulated, invented, or selectively reported data results in rejection and possible institutional notification." },
  { icon: Ban, title: "Authorship disputes", body: "Ghost, gift, and guest authorship are prohibited. Contributions should follow the CRediT taxonomy." },
];

const FAQS = [
  { q: "What is the correction and retraction policy?", a: "Minor errors trigger a corrigendum; substantial errors an erratum. Fraud, fabrication, or repeat plagiarism trigger a retraction per COPE guidelines with a permanent, linked retraction notice." },
  { q: "How do you handle conflicts of interest?", a: "All authors and reviewers must declare financial and non-financial COIs at submission. Editors with a COI recuse; a co-editor handles the paper." },
  { q: "Do you use AI-assisted screening?", a: "Yes — for plagiarism, statistical anomalies, and image manipulation. AI is a decision-support tool; a human editor makes every final call." },
  { q: "Can I appeal an editorial decision?", a: "Yes. Send a written appeal to the Editor-in-Chief within 30 days of the decision. Appeals are handled by an editor who was not involved in the original decision." },
  { q: "Are generative AI tools allowed in manuscripts?", a: "Authors may use generative AI for language polishing but must disclose its use. AI cannot be listed as an author and cannot produce novel scientific claims without human verification." },
];

function Ethics() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ethics & integrity"
        title="Publication ethics & malpractice statement"
        intro="INSIGHTONIX follows the Committee on Publication Ethics (COPE) Core Practices. Everyone in our workflow — authors, reviewers, editors — is bound by these standards."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Publication Ethics" }]} />

        {/* Responsibilities */}
        <section>
          <h2 className="font-serif text-3xl font-semibold">Responsibilities</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {RESP.map((r) => (
              <article key={r.who} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand text-brand-foreground">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">{r.who}</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Misconduct */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h2 className="font-serif text-3xl font-semibold">Research misconduct</h2>
          </div>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {MISCONDUCT.map((m) => (
              <article key={m.title} className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive text-destructive-foreground">
                  <m.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-serif text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Corrections / retractions */}
        <section className="mt-16 rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-brand" />
            <h2 className="font-serif text-2xl font-semibold">Corrections, expressions of concern & retractions</h2>
          </div>
          <div className="mt-2 rule-gold" />
          <ol className="mt-6 space-y-4 text-sm">
            {[
              ["Corrigendum", "Author-initiated correction of small factual errors that do not change the paper's conclusions."],
              ["Erratum", "Publisher-initiated correction of typesetting or production errors."],
              ["Expression of concern", "Public notice that a paper is under investigation but not yet retracted."],
              ["Retraction", "Full withdrawal of a paper due to major errors, misconduct, or invalid conclusions. Retracted articles remain visible with a clear notice."],
            ].map(([k, v]) => (
              <li key={k} className="grid gap-2 border-b border-dashed border-border pb-4 last:border-0 sm:grid-cols-[200px_1fr]">
                <div className="font-serif font-semibold">{k}</div>
                <div className="text-muted-foreground leading-relaxed">{v}</div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Report a concern"
          title="See something that doesn't look right?"
          intro="If you suspect ethical breach, plagiarism, or misconduct in any INSIGHTONIX article, please write to the Editor-in-Chief. We investigate every credible allegation."
          actions={[
            { label: "Contact the editors", to: "/contact", primary: true },
            { label: "Read peer-review policy", to: "/peer-review-policy" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
