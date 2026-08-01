import { createFileRoute } from "@tanstack/react-router";
import { ArticleListingPage } from "@/components/site/article-listing-page";
import { articlesQuery } from "@/lib/queries";

export const Route = createFileRoute("/most-cited")({
  head: () => ({
    meta: [
      { title: "Most Cited Papers — INSIGHTONIX" },
      { name: "description", content: "INSIGHTONIX articles with the highest citation counts across Crossref, Google Scholar, and partner databases." },
      { property: "og:title", content: "Most Cited Papers — INSIGHTONIX" },
      { property: "og:description", content: "High-impact INSIGHTONIX research by citation count." },
    ],
    links: [{ rel: "canonical", href: "/most-cited" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery()),
  component: () => <ArticleListingPage mode="most-cited" />,
});
