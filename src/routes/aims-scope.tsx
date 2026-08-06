import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FAQSection } from "@/components/site/faq-section";
import { CtaStrip } from "@/components/site/cta-strip";
import { Layers, Database, Zap, Heart, Leaf, Globe2, BookOpen, Cpu } from "lucide-react";

export const Route = createFileRoute("/aims-scope")({
  head: () => ({
    meta: [
      { title: "Focus & Scope — INSIGHTONIX" },
      {
        name: "description",
        content:
          "INSIGHTONIX publishes original research across 60+ multidisciplinary areas including Computer Science, Engineering, Medicine, Humanities, and Social Sciences.",
      },
      { property: "og:title", content: "Focus & Scope — INSIGHTONIX" },
      {
        property: "og:description",
        content:
          "Subject areas, methodological standards, and manuscript types accepted by INSIGHTONIX.",
      },
    ],
    links: [{ rel: "canonical", href: "/aims-scope" }],
  }),
  component: AimsScope,
});

const AREAS = [
  {
    icon: Cpu,
    title: "Artificial Intelligence & Computer Science",
    body: "Machine Learning, Data Science, Blockchain, Cybersecurity, Software Engineering, NLP, Computer Vision, Robotics, IoT.",
  },
  {
    icon: Database,
    title: "Engineering & Technology",
    body: "Electrical, Mechanical, Civil, Chemical, Aerospace, Biomedical, Nanotechnology, Materials Science, Telecommunications.",
  },
  {
    icon: Heart,
    title: "Medicine & Health Sciences",
    body: "Public Health, Clinical Research, Pharmacology, Nursing, Dentistry, Veterinary Medicine, Neuroscience, Immunology.",
  },
  {
    icon: Leaf,
    title: "Environmental & Earth Sciences",
    body: "Renewable Energy, Climate Change, Ecology, Geology, Oceanography, Agriculture, Sustainability, Smart Cities.",
  },
  {
    icon: BookOpen,
    title: "Humanities & Arts",
    body: "Literature, History, Philosophy, Linguistics, Cultural Studies, Performing Arts, Archaeology, Religion, Ethics.",
  },
  {
    icon: Globe2,
    title: "Social Sciences & Education",
    body: "Sociology, Psychology, Political Science, Anthropology, Pedagogy, Curriculum Development, Educational Technology, Economics.",
  },
  {
    icon: Zap,
    title: "Business & Global Research",
    body: "Finance, Marketing, Human Resources, Supply Chain, Entrepreneurship, Innovation, Organizational Behavior, Accounting.",
  },
  {
    icon: Layers,
    title: "Multidisciplinary Studies",
    body: "Cross-disciplinary research, Bioinformatics, Computational Biology, Socio-technical systems, Policy Analysis, Mathematics, Physics, Chemistry, Biology.",
  },
];

const MANUSCRIPT_TYPES = [
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
    q: "Do you accept qualitative research?",
    a: "Yes. INSIGHTONIX welcomes theoretical, empirical, conceptual, qualitative, quantitative and mixed-method studies that make a meaningful contribution.",
  },
  {
    q: "Are interdisciplinary papers welcome?",
    a: "Yes, multidisciplinary and interdisciplinary research is a core focus of INSIGHTONIX.",
  },
  {
    q: "Can I submit a case study?",
    a: "Yes. Case studies are one of the accepted manuscript categories alongside original research, reviews, technical notes, conceptual and theoretical papers, thesis notes, and book notes.",
  },
  {
    q: "Are country- or region-specific studies welcome?",
    a: "Absolutely — provided the findings are of broader theoretical, empirical, methodological, policy-based, or practical relevance.",
  },
];

function AimsScope() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Focus & Scope"
        title="What INSIGHTONIX publishes"
        intro="INSIGHTONIX focuses on the publication of original, authentic, and high-quality research across over 60 subject areas in science, engineering, technology, medicine, business, education, humanities, and social sciences."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Focus & Scope" }]} />

        <section className="grid gap-8 lg:grid-cols-3">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
                Focus of the journal
              </div>
              <p className="mt-2 font-serif text-lg leading-snug">
                Theoretical and practice-oriented research that contributes to academic knowledge,
                professional understanding, institutional development, policy formulation, business
                decision-making, and contemporary global challenges.
              </p>
              <div className="mt-6 rule-gold" />
              <div className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
                Manuscripts accepted
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {MANUSCRIPT_TYPES.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Layers className="mt-0.5 h-3.5 w-3.5 flex-none text-brand" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-semibold">Scope of the journal</h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-4 text-sm text-muted-foreground">
              INSIGHTONIX welcomes submissions across the following multidisciplinary fields.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {AREAS.map((a) => (
                <article
                  key={a.title}
                  className="rounded-xl border border-border bg-card p-5 transition hover:border-brand/40 hover:shadow-elev"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-muted text-brand">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-serif text-base font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-brand/30 bg-brand-muted/20 p-8">
          <h2 className="font-serif text-2xl font-semibold">Scope disclaimer</h2>
          <div className="mt-2 rule-gold" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A manuscript must make a clear contribution to its respective field. Interdisciplinary
            papers are highly encouraged and considered when their connection to global insights is
            adequately established.
          </p>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Match our scope?"
          title="Start your submission"
          intro="If your work fits our aims, submit today. Manuscripts are evaluated through external double-blind peer review."
          actions={[
            { label: "Submit a manuscript", to: "/submit", primary: true },
            { label: "Read author guidelines", to: "/author-guidelines" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
