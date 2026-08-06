import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { articlesQuery } from "@/lib/queries";
import { ArrowUpRight, Calendar, Eye, Quote, Download, FileText } from "lucide-react";

export type ArticleListMode = "latest" | "in-press" | "accepted" | "most-viewed" | "most-cited";

const COPY: Record<
  ArticleListMode,
  {
    eyebrow: string;
    title: string;
    intro: string;
    crumb: string;
    empty: string;
    sort?: (a: A, b: A) => number;
    limit?: number;
  }
> = {
  latest: {
    eyebrow: "Freshly published",
    title: "Latest articles",
    intro:
      "The newest research from INSIGHTONIX — original studies, reviews, and conceptual pieces, freshly indexed and open to read.",
    crumb: "Latest Articles",
    empty:
      "Articles from the next issue will appear here as soon as they are typeset and DOI-registered.",
    limit: 24,
  },
  "in-press": {
    eyebrow: "In press",
    title: "Articles in press",
    intro:
      "Accepted manuscripts that have completed peer review and are being prepared for their final issue. DOIs are assigned on final publication.",
    crumb: "In Press",
    empty:
      "There are no articles currently in press. Follow us on the announcements page to be notified as soon as new work is accepted.",
  },
  accepted: {
    eyebrow: "Editorially accepted",
    title: "Accepted papers",
    intro:
      "Manuscripts that have received an editorial acceptance decision and are entering the production queue.",
    crumb: "Accepted Papers",
    empty:
      "No newly accepted papers are listed yet. The list refreshes at the end of each editorial cycle.",
  },
  "most-viewed": {
    eyebrow: "Reader favourites",
    title: "Most viewed articles",
    intro:
      "The most-read INSIGHTONIX articles across all issues — a live snapshot of what's driving conversation in multidisciplinary and global research research.",
    crumb: "Most Viewed",
    empty:
      "View data is being aggregated. Popular reads will appear here once traffic is recorded.",
    sort: (a, b) => (b.view_count ?? 0) - (a.view_count ?? 0),
    limit: 24,
  },
  "most-cited": {
    eyebrow: "Scholarly impact",
    title: "Most cited articles",
    intro:
      "INSIGHTONIX articles that have accumulated the most citations across Crossref, Scholar, and partner databases.",
    crumb: "Most Cited",
    empty:
      "Citation counts sync monthly from Crossref. Highly cited works will surface here as data accrues.",
    sort: (a, b) => (b.citation_count ?? 0) - (a.citation_count ?? 0),
    limit: 24,
  },
};

type A = {
  id: string;
  slug: string;
  title: string;
  abstract: string | null;
  authors: string[];
  published_at: string | null;
  view_count: number;
  citation_count: number;
  download_count: number;
  doi: string | null;
  keywords: string[];
};

export function ArticleListingPage({ mode }: { mode: ArticleListMode }) {
  const copy = COPY[mode];
  const { data } = useSuspenseQuery(articlesQuery());
  let list = (data as A[]) ?? [];
  if (copy.sort) list = [...list].sort(copy.sort);
  if (copy.limit) list = list.slice(0, copy.limit);

  return (
    <SiteLayout>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Articles", to: "/articles" }, { label: copy.crumb }]} />

        {list.length === 0 ? (
          <EmptyState message={copy.empty} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{list.length}</span> article
                {list.length === 1 ? "" : "s"} listed
              </div>
            </div>
            <div className="mt-2 rule-gold" />

            <ul className="mt-8 grid gap-5 md:grid-cols-2">
              {list.map((a) => (
                <li key={a.id}>
                  <Link
                    to="/articles/$slug"
                    params={{ slug: a.slug }}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elev"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[11px] uppercase tracking-wider text-brand font-semibold">
                        {a.doi ? "DOI · Crossref" : "Article"}
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-semibold leading-snug line-clamp-3">
                      {a.title}
                    </h3>
                    {a.authors?.length ? (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
                        {a.authors.join(", ")}
                      </p>
                    ) : null}
                    {a.abstract ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {a.abstract}
                      </p>
                    ) : null}
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted-foreground">
                      {a.published_at ? (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />{" "}
                          {new Date(a.published_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> {a.view_count ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Quote className="h-3.5 w-3.5" /> {a.citation_count ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" /> {a.download_count ?? 0}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <CtaStrip
          eyebrow="Browse further"
          title="Explore the full archive"
          intro="All INSIGHTONIX volumes and issues remain permanently open access, indexed, and free to cite."
          actions={[
            { label: "Open archive", to: "/archives", primary: true },
            { label: "Current issue", to: "/current-issue" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/40 to-background p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground">
        <FileText className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-serif text-2xl font-semibold">Nothing to list right now</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/archives"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground hover:brightness-110"
        >
          Browse archive
        </Link>
        <Link
          to="/current-issue"
          className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-semibold hover:bg-accent"
        >
          Current issue
        </Link>
      </div>
    </section>
  );
}
