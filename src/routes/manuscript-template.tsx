import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/manuscript-template")({
  head: () => ({
    meta: [
      { title: "Manuscript Template — INSIGHTONIX" },
      { name: "description", content: "Official DOCX manuscript template." },
      { property: "og:title", content: "Manuscript Template — INSIGHTONIX" },
      { property: "og:description", content: "Official DOCX manuscript template." },
    ],
    links: [{ rel: "canonical", href: "/manuscript-template" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("manuscript-template")),
  component: () => (
    <ContentPage slug="manuscript-template" title="Manuscript Template" crumb="Template" />
  ),
});
