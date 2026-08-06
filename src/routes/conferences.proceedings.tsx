import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/conferences/proceedings")({
  head: () => ({
    meta: [
      { title: "Conference Proceedings — INSIGHTONIX" },
      { name: "description", content: "Published conference proceedings." },
      { property: "og:title", content: "Conference Proceedings — INSIGHTONIX" },
      { property: "og:description", content: "Published conference proceedings." },
    ],
    links: [{ rel: "canonical", href: "/conferences/proceedings" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(pageQuery("conferences-proceedings")),
  component: () => (
    <ContentPage
      slug="conferences-proceedings"
      title="Conference Proceedings"
      crumb="Proceedings"
    />
  ),
});
