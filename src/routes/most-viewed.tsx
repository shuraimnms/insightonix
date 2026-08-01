import { createFileRoute } from "@tanstack/react-router";
import { ArticleListingPage } from "@/components/site/article-listing-page";
import { articlesQuery } from "@/lib/queries";

export const Route = createFileRoute("/most-viewed")({
  head: () => ({
    meta: [
      { title: "Most Viewed Papers — INSIGHTONIX" },
      { name: "description", content: "The most-read INSIGHTONIX articles across all volumes, ranked by verified reader views." },
      { property: "og:title", content: "Most Viewed Papers — INSIGHTONIX" },
      { property: "og:description", content: "Top-read research from INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/most-viewed" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery()),
  component: () => <ArticleListingPage mode="most-viewed" />,
});
