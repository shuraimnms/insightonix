import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FAQSection } from "@/components/site/faq-section";
import { CtaStrip } from "@/components/site/cta-strip";
import { FileText, Users, ShieldCheck, LineChart, Mail, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — INSIGHTONIX" },
      {
        name: "description",
        content:
          "Answers to common questions about submission, peer review, publication charges, indexing, ethics, and post-publication support at INSIGHTONIX.",
      },
      { property: "og:title", content: "FAQs — INSIGHTONIX" },
      {
        property: "og:description",
        content: "Everything authors, reviewers, and readers ask about INSIGHTONIX.",
      },
    ],
    links: [{ rel: "canonical", href: "/faqs" }],
  }),
  component: FAQs,
});

const CATEGORIES = [
  {
    icon: FileText,
    title: "Submission & manuscript",
    items: [
      {
        q: "How do I submit a manuscript?",
        a: "Use the Submit Manuscript form. You'll create an account, upload an anonymised manuscript and a title page, add co-authors, and confirm the declarations. Submissions receive an acknowledgement within 48 hours.",
      },
      {
        q: "What file formats do you accept?",
        a: "Microsoft Word (.doc, .docx) is preferred for the anonymised manuscript. Supplementary material may be uploaded as PDF, XLSX, PNG, or ZIP up to 25 MB total.",
      },
      {
        q: "Do you accept qualitative, mixed-method, and conceptual papers?",
        a: "Yes. INSIGHTONIX welcomes original research, review articles, technical notes, case studies, conceptual and theoretical papers, thesis notes, and book notes across all scientific, humanities, technical, and medical disciplines.",
      },
      {
        q: "Is there a word limit?",
        a: "Full papers should be 4,000–8,000 words including references. Review articles may extend to 10,000. The editor may waive limits for exceptional contributions.",
      },
    ],
  },
  {
    icon: Users,
    title: "Peer review",
    items: [
      {
        q: "What review model do you use?",
        a: "Strict double-blind peer review. Author identity is withheld from reviewers, and reviewer identity is withheld from authors.",
      },
      {
        q: "How long does peer review take?",
        a: "Editorial screening within 5–7 days; first review round typically completes in 4–6 weeks. Complex manuscripts requiring specialist reviewers may take longer.",
      },
      {
        q: "Can I suggest or oppose reviewers?",
        a: "You may suggest up to three preferred reviewers and up to two opposed reviewers with a brief reason. The handling editor is not bound by these suggestions.",
      },
      {
        q: "How are review decisions communicated?",
        a: "The corresponding author receives a formal decision letter with anonymised reviewer reports and the handling editor's synthesis.",
      },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Ethics & policies",
    items: [
      {
        q: "What is your plagiarism threshold?",
        a: "INSIGHTONIX enforces a maximum similarity index of 15% (excluding references and standard clauses). Manuscripts above this threshold are returned for substantive revision or rejected.",
      },
      {
        q: "Do you allow AI-assisted writing?",
        a: "Authors may use AI tools for language polish or ideation but must disclose the use, take full responsibility for content accuracy, and never list an AI system as an author.",
      },
      {
        q: "How are conflicts of interest handled?",
        a: "All authors and reviewers must declare financial, personal, or institutional interests that could bias the work. Handling editors recuse themselves where a conflict exists.",
      },
      {
        q: "What is your correction and retraction policy?",
        a: "INSIGHTONIX follows COPE guidelines. Corrections, expressions of concern, and retractions are issued transparently and linked to the original article.",
      },
    ],
  },
  {
    icon: LineChart,
    title: "Publication, DOI & indexing",
    items: [
      {
        q: "How quickly are accepted papers published?",
        a: "Accepted manuscripts appear in the next scheduled issue, typically within 6–8 weeks of acceptance. An 'In Press' listing is available immediately on acceptance.",
      },
      {
        q: "Will my article have a DOI?",
        a: "Yes. Every article receives a permanent Crossref DOI at publication, with full metadata deposit including ORCIDs, references, licence, and funding.",
      },
      {
        q: "Where is INSIGHTONIX indexed?",
        a: "See the Indexing page for a live status list - Crossref, Google Scholar, ROAD, and Index Copernicus are covered, with DOAJ(APPLIED FOR) in the pipeline.",
      },
      {
        q: "Can I get an indexing / publication certificate?",
        a: "Yes — a verifiable certificate with a unique ID (INSIGHTONIX-YYYY-####) is issued to every author and can be validated on the Verify page.",
      },
    ],
  },
];

const FLAT_FAQ = CATEGORIES.flatMap((c) => c.items);

function FAQs() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="Frequently asked questions"
        intro="Clear answers about submitting, reviewing, publishing, and being indexed with INSIGHTONIX. If your question isn't here, the editorial office replies within two working days."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Support", to: "/technical-support" }, { label: "FAQs" }]} />

        {/* Category pills */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <a
                key={c.title}
                href={`#${c.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elev"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-muted text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-serif text-sm font-semibold">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.items.length} answers</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Category blocks */}
        <div className="mt-12 space-y-10">
          {CATEGORIES.map((c) => (
            <section
              key={c.title}
              id={c.title.replace(/\s+/g, "-").toLowerCase()}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground">
                  <c.icon className="h-4 w-4" />
                </div>
                <h2 className="font-serif text-2xl font-semibold">{c.title}</h2>
              </div>
              <div className="mt-2 rule-gold" />
              <div className="mt-5">
                <FAQSection title="" items={c.items} />
              </div>
            </section>
          ))}
        </div>

        {/* SEO-friendly complete list (hidden decorative) */}
        <div className="sr-only">
          {FLAT_FAQ.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              <HelpCircle className="h-4 w-4" /> Still stuck?
            </div>
            <h3 className="mt-3 font-serif text-xl font-semibold">Search technical support</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Login trouble, upload errors, DOI queries — the support team resolves most tickets
              within a working day.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/40 to-background p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              <Mail className="h-4 w-4" /> Editorial office
            </div>
            <h3 className="mt-3 font-serif text-xl font-semibold">editor@insightonix.com</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Monday to Saturday · replies within 48 hours.
            </p>
          </div>
        </section>

        <CtaStrip
          eyebrow="Ready to publish?"
          title="Start your submission with INSIGHTONIX"
          intro="Prepare your manuscript with our template, then submit through the online workflow."
          actions={[
            { label: "Submit a manuscript", to: "/submit", primary: true },
            { label: "Author guidelines", to: "/author-guidelines" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
