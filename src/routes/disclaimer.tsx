import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — INSIGHTONIX" },
      { name: "description", content: "Legal disclaimers for INSIGHTONIX." },
      { property: "og:title", content: "Disclaimer — INSIGHTONIX" },
      { property: "og:description", content: "Legal disclaimers for INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("disclaimer")),
  component: () => <ContentPage slug="disclaimer" title="Disclaimer" crumb="Disclaimer" />,
});
