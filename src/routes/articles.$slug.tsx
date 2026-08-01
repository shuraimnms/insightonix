import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { articleBySlugQuery } from "@/lib/queries";
import { Download, FileText, Copy, Quote } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(articleBySlugQuery(params.slug));
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — INSIGHTONIX` },
          { name: "description", content: (loaderData.abstract ?? "").slice(0, 155) },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: (loaderData.abstract ?? "").slice(0, 200) },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Article — INSIGHTONIX" }],
    links: loaderData ? [{ rel: "canonical", href: `/articles/${loaderData.slug}` }] : [],
  }),
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleBySlugQuery(slug));
  const [citeOpen, setCiteOpen] = useState<"apa" | "bibtex" | null>(null);
  if (!a) return null;

  const issue = a.issues as { volume: number; number: number; year: number } | null;

  const apa = `${(a.authors as string[]).join(", ")} (${issue?.year ?? new Date(a.published_at ?? Date.now()).getFullYear()}). ${a.title}. International Journal of Academic Research in Multidisciplinary & Global Research, ${issue?.volume ?? "-"}(${issue?.number ?? "-"}), ${a.page_start ?? "-"}–${a.page_end ?? "-"}.${a.doi ? " https://doi.org/" + a.doi : ""}`;

  const bibtex = `@article{insightonix${issue?.year ?? ""}${slug.split("-")[0]},
  title = {${a.title}},
  author = {${(a.authors as string[]).join(" and ")}},
  journal = {International Journal of Academic Research in Multidisciplinary & Global Research},
  volume = {${issue?.volume ?? ""}},
  number = {${issue?.number ?? ""}},
  pages = {${a.page_start ?? ""}--${a.page_end ?? ""}},
  year = {${issue?.year ?? ""}},
  doi = {${a.doi ?? ""}}
}`;

  const copy = (v: string) => {
    navigator.clipboard.writeText(v);
    toast.success("Citation copied");
  };

  return (
    <SiteLayout>
      <article>
        <header className="border-b border-border bg-gradient-to-b from-brand-muted/40 to-transparent">
          <div className="container-page py-12">
            <Breadcrumbs trail={[{ label: "Articles", to: "/articles" }, { label: a.title }]} />
            {issue ? (
              <div className="text-xs uppercase tracking-widest text-brand font-semibold">
                Vol. {issue.volume} · Issue {issue.number} · {issue.year}
              </div>
            ) : null}
            <h1 className="mt-3 max-w-4xl font-serif text-3xl lg:text-4xl font-semibold leading-tight">{a.title}</h1>
            <div className="mt-4 text-base text-muted-foreground">{(a.authors as string[]).join(", ")}</div>
            {(a.affiliations as string[]).length > 0 && (
              <div className="mt-1 text-sm text-muted-foreground italic">{(a.affiliations as string[]).join(" · ")}</div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {a.pdf_url ? (
                <a href={a.pdf_url} className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground">
                  <Download className="h-4 w-4" /> Download PDF
                </a>
              ) : (
                <span className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" /> PDF preparing
                </span>
              )}
              <button
                onClick={() => setCiteOpen("apa")}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                <Quote className="h-4 w-4" /> Cite (APA)
              </button>
              <button
                onClick={() => setCiteOpen("bibtex")}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
              >
                <Quote className="h-4 w-4" /> BibTeX
              </button>
              {a.doi ? (
                <a
                  href={`https://doi.org/${a.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
                >
                  DOI: {a.doi}
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_260px]">
          <div>
            <h2 className="font-serif text-xl font-semibold">Abstract</h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-4 prose-journal">{a.abstract}</p>

            <h2 className="mt-10 font-serif text-xl font-semibold">Keywords</h2>
            <div className="mt-2 rule-gold" />
            <div className="mt-4 flex flex-wrap gap-2">
              {(a.keywords as string[]).map((k) => (
                <span key={k} className="rounded-full border border-border bg-secondary px-3 py-1 text-sm">{k}</span>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 text-sm">
              <div className="font-serif text-base font-semibold">Article metrics</div>
              <div className="mt-2 rule-gold" />
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div><dt className="text-xs text-muted-foreground">Views</dt><dd className="font-serif text-xl">{a.view_count}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Downloads</dt><dd className="font-serif text-xl">{a.download_count}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Citations</dt><dd className="font-serif text-xl">{a.citation_count}</dd></div>
              </dl>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 text-sm">
              <div className="font-serif text-base font-semibold">Licence</div>
              <div className="mt-2 rule-gold" />
              <p className="mt-3 text-muted-foreground">
                Published open access under CC BY-NC 4.0. Attribution required; non-commercial reuse allowed.
              </p>
            </div>
            <Link to="/articles" className="block text-sm text-brand hover:underline">← Back to all articles</Link>
          </aside>
        </div>
      </article>

      {citeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setCiteOpen(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-popover p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">Cite this article — {citeOpen.toUpperCase()}</h3>
              <button onClick={() => setCiteOpen(null)} className="text-sm text-muted-foreground">Close</button>
            </div>
            <pre className="mt-4 max-h-64 overflow-auto rounded-md bg-secondary p-4 text-xs whitespace-pre-wrap">
              {citeOpen === "apa" ? apa : bibtex}
            </pre>
            <button
              onClick={() => copy(citeOpen === "apa" ? apa : bibtex)}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
          </div>
        </div>
      ) : null}
    </SiteLayout>
  );
}
