import { createFileRoute } from "@tanstack/react-router";
import { ArticleListingPage } from "@/components/site/article-listing-page";
import { articlesQuery } from "@/lib/queries";

export const Route = createFileRoute("/in-press")({
  head: () => ({
    meta: [
      { title: "Articles In Press — INSIGHTONIX" },
      { name: "description", content: "Accepted INSIGHTONIX manuscripts in final production, awaiting issue assignment and DOI registration." },
      { property: "og:title", content: "Articles In Press — INSIGHTONIX" },
      { property: "og:description", content: "Peer-reviewed manuscripts in final production at INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/in-press" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery()),
  component: () => <ArticleListingPage mode="in-press" />,
});
