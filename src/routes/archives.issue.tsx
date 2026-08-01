import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/archives/issue")({
  head: () => ({
    meta: [
      { title: "Archives by Issue — INSIGHTONIX" },
      { name: "description", content: "Browse INSIGHTONIX archives by issue." },
      { property: "og:title", content: "Archives by Issue — INSIGHTONIX" },
      { property: "og:description", content: "Browse INSIGHTONIX archives by issue." },
    ],
    links: [{ rel: "canonical", href: "/archives/issue" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("archives-issue")),
  component: () => <ContentPage slug="archives-issue" title="Archives by Issue" crumb="By Issue" />,
});
