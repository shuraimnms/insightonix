import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/author-guidelines")({
  head: () => ({
    meta: [{ title: "Author Guidelines — INSIGHTONIX" }, { name: "description", content: "Formatting and authorship guidelines." }],
    links: [{ rel: "canonical", href: "/author-guidelines" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("author-guidelines")),
  component: () => <ContentPage slug="author-guidelines" title="Author Guidelines" crumb="Author Guidelines" />,
});
