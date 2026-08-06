import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, BookOpen, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Markdown } from "@/components/site/markdown";
import { pageQuery } from "@/lib/queries";

type QuickLink = { label: string; to: LinkProps["to"]; hint?: string };

const DEFAULT_LINKS: QuickLink[] = [
  { label: "Aims & Scope", to: "/aims-scope", hint: "What we publish" },
  { label: "Author Guidelines", to: "/author-guidelines", hint: "How to prepare a manuscript" },
  { label: "Submit a Manuscript", to: "/submit", hint: "Start a new submission" },
  { label: "Editorial Board", to: "/editorial-board", hint: "Meet the editors" },
  { label: "Publication Ethics", to: "/publication-ethics", hint: "COPE-aligned policy" },
  { label: "Contact Editorial Office", to: "/contact", hint: "Email the office" },
];

export function ContentPage({
  slug,
  title,
  crumb,
  intro,
  eyebrow = "Journal",
  highlights,
  quickLinks = DEFAULT_LINKS,
}: {
  slug: string;
  title: string;
  crumb: string;
  intro?: string;
  eyebrow?: string;
  highlights?: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    body: string;
  }[];
  quickLinks?: QuickLink[];
}) {
  const { data: page } = useSuspenseQuery(pageQuery(slug));
  const pageIntro = (page as { excerpt?: string | null } | null)?.excerpt ?? intro;

  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={page?.title ?? title} intro={pageIntro ?? undefined} />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: crumb }]} />

        {page?.content ? (
          <div className="mt-2 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="min-w-0">
              <Markdown source={page.content} />
            </article>
            <aside className="space-y-6">
              <QuickLinksCard links={quickLinks} />
              <SupportCard />
            </aside>
          </div>
        ) : (
          <PremiumFallback
            title={page?.title ?? title}
            intro={pageIntro}
            highlights={highlights}
            quickLinks={quickLinks}
          />
        )}
      </div>
    </SiteLayout>
  );
}

const DEFAULT_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Peer-reviewed & indexed",
    body: "Every article undergoes double-blind peer review and is assigned a permanent DOI on publication.",
  },
  {
    icon: BookOpen,
    title: "Open access, no paywall",
    body: "Readers worldwide can freely download, share, and cite — under a permissive CC BY licence.",
  },
  {
    icon: Sparkles,
    title: "Fast, transparent workflow",
    body: "Editorial acknowledgement within 48 hours; first decision typically within 4–6 weeks.",
  },
];

function PremiumFallback({
  title,
  intro,
  highlights = DEFAULT_HIGHLIGHTS,
  quickLinks,
}: {
  title: string;
  intro?: string;
  highlights?: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    body: string;
  }[];
  quickLinks: QuickLink[];
}) {
  return (
    <div className="mt-2 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-10">
        <section className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/50 via-background to-background p-8 lg:p-10">
          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="h-3.5 w-3.5" /> Section overview
            </div>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">{title}</h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              {intro ??
                `Detailed material for this section is being finalised by the INSIGHTONIX editorial office. Meanwhile, everything you need to plan a submission, understand our review workflow, or reach the editors is available through the resources below.`}
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-semibold">What you should know</h3>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {highlights.map((h) => (
              <article
                key={h.title}
                className="group rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elev"
              >
                {h.icon ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-muted text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
                    <h.icon className="h-5 w-5" />
                  </div>
                ) : null}
                <h4 className="mt-3 font-serif text-base font-semibold">{h.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-serif text-2xl font-semibold">Editorial commitment</h3>
          <div className="mt-2 rule-gold" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            INSIGHTONIX is committed to transparent, ethical, and internationally-benchmarked
            academic publishing across multidisciplinary and global research disciplines. Every
            policy on this site aligns with COPE guidelines, the DOAJ principles of transparency,
            and best practice for double-blind peer review. If a specific point on this page is not
            yet addressed, our editorial office will respond within two working days.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-elev hover:brightness-110"
            >
              Contact editorial office <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/submit"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-semibold hover:bg-accent"
            >
              Submit a manuscript
            </Link>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <QuickLinksCard links={quickLinks} />
        <SupportCard />
      </aside>
    </div>
  );
}

function QuickLinksCard({ links }: { links: QuickLink[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">Quick links</div>
      <div className="mt-2 rule-gold" />
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.to as string}>
            <Link
              to={l.to}
              className="group flex items-start justify-between gap-3 rounded-lg border border-transparent px-3 py-2 hover:border-brand/30 hover:bg-brand-muted/30"
            >
              <span>
                <span className="block font-serif text-sm font-semibold text-foreground">
                  {l.label}
                </span>
                {l.hint ? (
                  <span className="block text-xs text-muted-foreground">{l.hint}</span>
                ) : null}
              </span>
              <ArrowRight className="mt-1 h-4 w-4 flex-none text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SupportCard() {
  return (
    <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/40 to-background p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-brand-foreground">
        <Mail className="h-5 w-5" />
      </div>
      <div className="mt-3 font-serif text-lg font-semibold">Need help right now?</div>
      <p className="mt-1 text-sm text-muted-foreground">
        Write to the editorial office — we reply within two working days, Monday to Saturday.
      </p>
      <Link
        to="/contact"
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:brightness-110"
      >
        Contact us <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
