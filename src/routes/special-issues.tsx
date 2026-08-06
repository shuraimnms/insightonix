import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/special-issues")({
  head: () => ({
    meta: [
      { title: "Special Issues — INSIGHTONIX" },
      { name: "description", content: "Calls and collections for special issues." },
      { property: "og:title", content: "Special Issues — INSIGHTONIX" },
      { property: "og:description", content: "Calls and collections for special issues." },
    ],
    links: [{ rel: "canonical", href: "/special-issues" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("special-issues")),
  component: () => (
    <ContentPage slug="special-issues" title="Special Issues" crumb="Special Issues" />
  ),
});
