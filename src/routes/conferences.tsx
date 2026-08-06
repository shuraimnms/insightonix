import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { conferencesQuery } from "@/lib/queries";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/conferences")({
  head: () => ({
    meta: [
      { title: "Conferences — INSIGHTONIX" },
      {
        name: "description",
        content: "INSIGHTONIX-affiliated conferences, symposia, and workshops.",
      },
    ],
    links: [{ rel: "canonical", href: "/conferences" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(conferencesQuery()),
  component: Conferences,
});

function Conferences() {
  const { data } = useSuspenseQuery(conferencesQuery());
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Events"
        title="Conferences & workshops"
        intro="Academic events organised or co-hosted by INSIGHTONIX."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Conferences" }]} />
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((c) => (
            <article key={c.id} className="rounded-xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-widest text-brand font-semibold">
                Symposium
              </div>
              <h2 className="mt-2 font-serif text-xl font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                {c.start_date ? (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {c.start_date} → {c.end_date}
                  </span>
                ) : null}
                {c.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {c.location}
                  </span>
                ) : null}
              </div>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                >
                  Learn more <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
