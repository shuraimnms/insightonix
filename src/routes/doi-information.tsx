import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/doi-information")({
  head: () => ({
    meta: [
      { title: "DOI Information — INSIGHTONIX" },
      { name: "description", content: "DOI registration and policy information." },
      { property: "og:title", content: "DOI Information — INSIGHTONIX" },
      { property: "og:description", content: "DOI registration and policy information." },
    ],
    links: [{ rel: "canonical", href: "/doi-information" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("doi-information")),
  component: () => <ContentPage slug="doi-information" title="DOI Information" crumb="DOI" />,
});
