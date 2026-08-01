import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/road")({
  head: () => ({
    meta: [
      { title: "ROAD — INSIGHTONIX" },
      { name: "description", content: "Directory of Open Access scholarly Resources." },
      { property: "og:title", content: "ROAD — INSIGHTONIX" },
      { property: "og:description", content: "Directory of Open Access scholarly Resources." },
    ],
    links: [{ rel: "canonical", href: "/road" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("road")),
  component: () => <ContentPage slug="road" title="ROAD" crumb="ROAD" />,
});
