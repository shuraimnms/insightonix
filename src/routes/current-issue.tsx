import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { currentIssueQuery, articlesQuery } from "@/lib/queries";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/current-issue")({
  head: () => ({
    meta: [
      { title: "Current Issue — INSIGHTONIX" },
      {
        name: "description",
        content: "The latest peer-reviewed issue of INSIGHTONIX with full table of contents.",
      },
    ],
    links: [{ rel: "canonical", href: "/current-issue" }],
  }),
  loader: async ({ context }) => {
    const issue = await context.queryClient.ensureQueryData(currentIssueQuery());
    if (issue?.id) await context.queryClient.ensureQueryData(articlesQuery(issue.id));
  },
  component: CurrentIssue,
});

function CurrentIssue() {
  const { data: issue } = useSuspenseQuery(currentIssueQuery());
  const { data: articles } = useSuspenseQuery(articlesQuery(issue?.id));

  return (
    <SiteLayout>
      <PageHero
        eyebrow={issue ? `Vol. ${issue.volume}, Issue ${issue.number} · ${issue.year}` : "Current"}
        title={issue?.title ?? "No published issues yet"}
        intro={issue?.description ?? undefined}
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Current Issue" }]} />
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-semibold">Table of contents</h2>
          <span className="text-sm text-muted-foreground">{articles.length} articles</span>
        </div>
        <ol className="divide-y divide-border rounded-xl border border-border bg-card">
          {articles.map((a, i) => (
            <li key={a.id} className="p-6">
              <div className="flex items-baseline gap-4">
                <div className="w-8 flex-none font-serif text-2xl text-muted-foreground">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/articles/$slug"
                    params={{ slug: a.slug }}
                    className="block font-serif text-lg font-semibold leading-snug text-foreground hover:text-brand"
                  >
                    {a.title}
                  </Link>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {(a.authors as string[]).join(", ")}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.abstract}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {a.page_start ? (
                      <span>
                        Pages {a.page_start}–{a.page_end}
                      </span>
                    ) : null}
                    {a.doi ? <span>DOI: {a.doi}</span> : null}
                    <Link
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      className="inline-flex items-center gap-1 text-brand hover:underline"
                    >
                      <FileText className="h-3 w-3" /> Abstract
                    </Link>
                    {a.pdf_url ? (
                      <a
                        href={a.pdf_url}
                        className="inline-flex items-center gap-1 text-brand hover:underline"
                      >
                        <Download className="h-3 w-3" /> PDF
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SiteLayout>
  );
}
