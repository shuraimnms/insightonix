import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { FAQSection } from "@/components/site/faq-section";
import {
  Award,
  Globe2,
  BookMarked,
  Search,
  Hash,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/indexing")({
  head: () => ({
    meta: [
      { title: "Abstracting & Indexing — INSIGHTONIX" },
      {
        name: "description",
        content:
          "INSIGHTONIX is discoverable through global indexing and abstracting services, DOI registration via Crossref, and open-access directories.",
      },
      { property: "og:title", content: "Abstracting & Indexing — INSIGHTONIX" },
      {
        property: "og:description",
        content: "Discovery services, DOI registration, and indexing partners for INSIGHTONIX.",
      },
    ],
    links: [{ rel: "canonical", href: "/indexing" }],
  }),
  component: Indexing,
});

type Service = {
  name: string;
  status: "indexed" | "in-progress" | "planned";
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  body: string;
  href?: string;
  to?: string;
};

const SERVICES: Service[] = [
  {
    name: "Crossref (DOI)",
    status: "indexed",
    category: "Persistent identifiers",
    icon: Hash,
    body: "Every published article receives a permanent DOI registered with Crossref, ensuring stable citation and machine-readable metadata.",
    to: "/crossref",
  },
  {
    name: "Google Scholar",
    status: "indexed",
    category: "Discovery",
    icon: Search,
    body: "INSIGHTONIX articles are structured with Highwire / Dublin Core meta tags for automatic Google Scholar harvesting and citation tracking.",
    to: "/google-scholar",
  },
  {
    name: "DOAJ(APPLIED FOR)",
    status: "in-progress",
    category: "Directory",
    icon: BookMarked,
    body: "Application filed with the Directory of Open Access Journals. INSIGHTONIX already meets DOAJ's transparency, peer-review, and open-access criteria while the review is in progress.",
  },
  {
    name: "Index Copernicus",
    status: "in-progress",
    category: "Evaluation index",
    icon: Award,
    body: "ICI Journals Master List evaluation in progress with annual re-assessment.",
    to: "/copernicus",
  },
  {
    name: "ROAD (ISSN Portal)",
    status: "indexed",
    category: "ISSN registry",
    icon: Globe2,
    body: "Registered on the Directory of Open Access Scholarly Resources maintained by the ISSN International Centre.",
    to: "/road",
  },
];

const STATUS_META: Record<
  Service["status"],
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  indexed: {
    label: "Indexed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  "in-progress": {
    label: "In progress",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300",
    icon: Clock,
  },
  planned: {
    label: "Planned",
    className: "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-300",
    icon: Sparkles,
  },
};

const METADATA_STANDARDS = [
  {
    title: "Crossref XML deposits",
    body: "Full article metadata, author ORCIDs, funding, licence, and references submitted with every DOI.",
  },
  {
    title: "JATS-ready XML",
    body: "Articles are prepared for JATS 1.3 export for downstream ingestion by aggregators and archives.",
  },
  {
    title: "Highwire / Dublin Core",
    body: "HTML head tags embedded on each article page for automatic Google Scholar harvesting.",
  },
  {
    title: "OAI-PMH endpoint",
    body: "Planned harvesting endpoint at /oai for repositories and library discovery layers.",
  },
];

const FAQS = [
  {
    q: "How can I confirm a specific INSIGHTONIX article is indexed?",
    a: "Copy the article DOI and search it on the target service (Crossref, Google Scholar, DOAJ). Indexing latency for new articles ranges from a few hours (Crossref) to several weeks (Scholar).",
  },
  {
    q: "Does INSIGHTONIX issue DOIs?",
    a: "Yes. Every published article and issue receives a Crossref DOI. DOIs are assigned at final publication and are permanent.",
  },
  {
    q: "When will INSIGHTONIX be listed in additional databases?",
    a: "New indexing applications are filed once the journal meets each database's eligibility window. We publish all indexing milestones on this page as they are confirmed.",
  },
  {
    q: "Where can librarians download metadata in bulk?",
    a: "MARC and JATS bundles are available on request from the editorial office; an OAI-PMH endpoint is on the near-term roadmap.",
  },
];

function Indexing() {
  const indexed = SERVICES.filter((s) => s.status === "indexed").length;
  const inProgress = SERVICES.filter((s) => s.status === "in-progress").length;
  const planned = SERVICES.filter((s) => s.status === "planned").length;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Discovery & indexing"
        title="Abstracting & indexing"
        intro="INSIGHTONIX invests in persistent identifiers, structured metadata, and international discovery services so that every article is easy to find, cite, and archive."
      />

      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Indexing" }]} />

        {/* Stat band */}
        <section className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand text-brand-foreground shadow-elev">
          <div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-6 p-8 sm:grid-cols-3 lg:p-10">
            {[
              { k: indexed, label: "Currently indexed", sub: "Live discovery services" },
              { k: inProgress, label: "Applications in progress", sub: "Under evaluation" },
              { k: planned, label: "Planned partners", sub: "Post-window applications" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/5 p-5 backdrop-blur-sm ring-1 ring-white/10"
              >
                <div className="font-serif text-4xl font-semibold">{s.k}</div>
                <div className="mt-1 text-sm font-semibold uppercase tracking-wider">{s.label}</div>
                <div className="mt-1 text-xs opacity-80">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Traveling marquee — indexing partners in motion */}
        <section className="mt-10 space-y-3" aria-label="Indexing partners in motion">
          <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-brand-muted/60 via-background to-brand-muted/60 py-4">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
              aria-hidden
            />
            <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
              {[...SERVICES, ...SERVICES].map((s, i) => (
                <div
                  key={`${s.name}-${i}`}
                  className="flex items-center gap-3 whitespace-nowrap px-2"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground shadow-elev animate-float">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <span className="font-serif text-base font-semibold">{s.name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-background via-brand-muted/40 to-background py-3">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
              aria-hidden
            />
            <div className="flex w-max animate-marquee-reverse gap-8 group-hover:[animation-play-state:paused]">
              {[...SERVICES, ...SERVICES].reverse().map((s, i) => (
                <span
                  key={`t-${s.name}-${i}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Discovery partners</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                A curated set of persistent identifier, open access, and citation databases that
                make INSIGHTONIX content discoverable to researchers, librarians, and funders
                worldwide.
              </p>
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Updated quarterly
            </div>
          </div>
          <div className="mt-2 rule-gold" />

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((s) => {
              const meta = STATUS_META[s.status];
              const StatusIcon = meta.icon;
              return (
                <article
                  key={s.name}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elev"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-muted text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${meta.className}`}
                    >
                      <StatusIcon className="h-3 w-3" /> {meta.label}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {s.category}
                    </div>
                    <h3 className="mt-1 font-serif text-lg font-semibold">{s.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                  {s.to ? (
                    <Link
                      to={s.to}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                    >
                      More details <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        {/* Metadata pipeline */}
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              <ShieldCheck className="h-4 w-4" /> Metadata standards
            </div>
            <h2 className="mt-3 font-serif text-2xl font-semibold">
              How INSIGHTONIX stays discoverable
            </h2>
            <div className="mt-2 rule-gold" />
            <ul className="mt-5 space-y-4">
              {METADATA_STANDARDS.map((m) => (
                <li key={m.title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-brand" />
                  <div>
                    <div className="font-serif text-base font-semibold">{m.title}</div>
                    <div className="text-sm text-muted-foreground">{m.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/60 to-background p-8">
            <div
              className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
                DOI programme
              </div>
              <h2 className="mt-3 font-serif text-2xl font-semibold">
                Every article gets a permanent DOI
              </h2>
              <div className="mt-2 rule-gold" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                INSIGHTONIX is a Crossref member. On final publication, each article is minted a DOI
                in the form
                <code className="mx-1 rounded bg-secondary px-1.5 py-0.5 text-xs">
                  10.xxxxx/insightonix.v{"{"}vol{"}"}.i{"{"}iss{"}"}.###
                </code>
                and deposited with full metadata: authors, ORCIDs, funding, licence, and reference
                list.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/doi-information"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:brightness-110"
                >
                  DOI information <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/crossref"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold hover:bg-accent"
                >
                  About Crossref
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Librarians & repository managers"
          title="Need bulk metadata or an indexing certificate?"
          intro="We can supply MARC records, JATS bundles, and formal indexing confirmation letters for institutional repositories and library committees."
          actions={[
            { label: "Contact editorial office", to: "/contact", primary: true },
            { label: "View verification tool", to: "/verify" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
