import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/ebooks/download")({
  head: () => ({
    meta: [
      { title: "Download E-Books — INSIGHTONIX" },
      { name: "description", content: "Download available INSIGHTONIX e-books." },
      { property: "og:title", content: "Download E-Books — INSIGHTONIX" },
      { property: "og:description", content: "Download available INSIGHTONIX e-books." },
    ],
    links: [{ rel: "canonical", href: "/ebooks/download" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("ebooks-download")),
  component: () => <ContentPage slug="ebooks-download" title="Download E-Books" crumb="Download" />,
});
