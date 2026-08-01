import { createFileRoute } from "@tanstack/react-router";
import { ArticleListingPage } from "@/components/site/article-listing-page";
import { articlesQuery } from "@/lib/queries";

export const Route = createFileRoute("/latest-articles")({
  head: () => ({
    meta: [
      { title: "Latest Articles — INSIGHTONIX" },
      { name: "description", content: "Recently published, peer-reviewed research from INSIGHTONIX in multidisciplinary, global research, finance, marketing, HRM, and allied disciplines." },
      { property: "og:title", content: "Latest Articles — INSIGHTONIX" },
      { property: "og:description", content: "The newest open-access research from INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/latest-articles" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery()),
  component: () => <ArticleListingPage mode="latest" />,
});
