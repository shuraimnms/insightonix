import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { articlesQuery, issuesQuery } from "@/lib/queries";
import { Search } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
  year: z.string().optional(),
  issue: z.string().optional(),
});

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Articles — INSIGHTONIX" },
      {
        name: "description",
        content: "Search and browse all peer-reviewed articles published in INSIGHTONIX.",
      },
    ],
    links: [{ rel: "canonical", href: "/articles" }],
  }),
  validateSearch: searchSchema,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(articlesQuery()),
      context.queryClient.ensureQueryData(issuesQuery()),
    ]);
  },
  component: Articles,
});

function Articles() {
  const { data: articles } = useSuspenseQuery(articlesQuery());
  const { data: issues } = useSuspenseQuery(issuesQuery());
  const initial = Route.useSearch();

  const [q, setQ] = useState(initial.q ?? "");
  const [year, setYear] = useState(initial.year ?? "");
  const [issueId, setIssueId] = useState(initial.issue ?? "");

  const years = Array.from(new Set(issues.map((i) => i.year))).sort((a, b) => b - a);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (issueId && a.issue_id !== issueId) return false;
      const iss = issues.find((i) => i.id === a.issue_id);
      if (year && String(iss?.year ?? "") !== year) return false;
      if (q) {
        const s = q.toLowerCase();
        const hay = [
          a.title,
          a.abstract ?? "",
          (a.authors as string[]).join(" "),
          (a.keywords as string[]).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [articles, issues, q, year, issueId]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Library"
        title="All articles"
        intro="Search across every peer-reviewed paper published in INSIGHTONIX."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Articles" }]} />

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
          <label className="flex-1 min-w-[240px]">
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Search
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Title, author, keyword…"
                className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-brand"
              />
            </div>
          </label>
          <label>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Year</div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Issue</div>
            <select
              value={issueId}
              onChange={(e) => setIssueId(e.target.value)}
              className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand"
            >
              <option value="">All issues</option>
              {issues.map((i) => (
                <option key={i.id} value={i.id}>
                  Vol. {i.volume} · {i.number} · {i.year}
                </option>
              ))}
            </select>
          </label>
          {(q || year || issueId) && (
            <button
              onClick={() => {
                setQ("");
                setYear("");
                setIssueId("");
              }}
              className="h-11 rounded-md border border-border bg-background px-4 text-sm hover:bg-accent"
            >
              Reset
            </button>
          )}
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          {filtered.length} of {articles.length} articles
        </div>

        <ul className="space-y-3">
          {filtered.map((a) => {
            const iss = issues.find((i) => i.id === a.issue_id);
            return (
              <li key={a.id}>
                <Link
                  to="/articles/$slug"
                  params={{ slug: a.slug }}
                  className="group block rounded-xl border border-border bg-card p-5 hover:border-brand transition"
                >
                  <div className="flex flex-wrap items-baseline gap-2 text-xs text-muted-foreground">
                    {iss ? (
                      <span>
                        Vol. {iss.volume} · Issue {iss.number} · {iss.year}
                      </span>
                    ) : null}
                    {a.doi ? <span>· DOI: {a.doi}</span> : null}
                  </div>
                  <div className="mt-1 font-serif text-lg font-semibold group-hover:text-brand">
                    {a.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {(a.authors as string[]).join(", ")}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.abstract}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(a.keywords as string[]).slice(0, 5).map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No articles match those filters.
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
