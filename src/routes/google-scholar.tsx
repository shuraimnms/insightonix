import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/google-scholar")({
  head: () => ({
    meta: [
      { title: "Google Scholar — INSIGHTONIX" },
      { name: "description", content: "Google Scholar indexing status." },
      { property: "og:title", content: "Google Scholar — INSIGHTONIX" },
      { property: "og:description", content: "Google Scholar indexing status." },
    ],
    links: [{ rel: "canonical", href: "/google-scholar" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("google-scholar")),
  component: () => (
    <ContentPage slug="google-scholar" title="Google Scholar" crumb="Google Scholar" />
  ),
});
