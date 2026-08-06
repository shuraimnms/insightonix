import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ebooksQuery } from "@/lib/queries";
import { Download, Book } from "lucide-react";

export const Route = createFileRoute("/ebooks")({
  head: () => ({
    meta: [
      { title: "E-Books — INSIGHTONIX" },
      { name: "description", content: "Open-access e-books curated by INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/ebooks" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(ebooksQuery()),
  component: Ebooks,
});

function Ebooks() {
  const { data } = useSuspenseQuery(ebooksQuery());
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Library"
        title="E-Books"
        intro="Curated open-access volumes drawn from INSIGHTONIX research."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "E-Books" }]} />
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((b) => (
            <article key={b.id} className="flex gap-5 rounded-xl border border-border bg-card p-6">
              <div className="flex h-24 w-16 flex-none items-center justify-center rounded-md bg-brand text-brand-foreground">
                <Book className="h-8 w-8" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-semibold leading-snug">{b.title}</h2>
                <div className="mt-1 text-sm text-muted-foreground">
                  {(b.authors as string[]).join(", ")}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{b.description}</p>
                {b.download_url ? (
                  <a
                    href={b.download_url}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
