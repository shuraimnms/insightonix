import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/crossref")({
  head: () => ({
    meta: [
      { title: "Crossref — INSIGHTONIX" },
      { name: "description", content: "Crossref membership and metadata." },
      { property: "og:title", content: "Crossref — INSIGHTONIX" },
      { property: "og:description", content: "Crossref membership and metadata." },
    ],
    links: [{ rel: "canonical", href: "/crossref" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("crossref")),
  component: () => <ContentPage slug="crossref" title="Crossref" crumb="Crossref" />,
});
