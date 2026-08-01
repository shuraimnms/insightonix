import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/ebooks/submit")({
  head: () => ({
    meta: [
      { title: "Submit an E-Book — INSIGHTONIX" },
      { name: "description", content: "Submit a new e-book proposal." },
      { property: "og:title", content: "Submit an E-Book — INSIGHTONIX" },
      { property: "og:description", content: "Submit a new e-book proposal." },
    ],
    links: [{ rel: "canonical", href: "/ebooks/submit" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("ebooks-submit")),
  component: () => <ContentPage slug="ebooks-submit" title="Submit an E-Book" crumb="Submit" />,
});
