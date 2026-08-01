import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/conferences/call-for-papers")({
  head: () => ({
    meta: [
      { title: "Call for Papers — INSIGHTONIX" },
      { name: "description", content: "Open calls for conference papers." },
      { property: "og:title", content: "Call for Papers — INSIGHTONIX" },
      { property: "og:description", content: "Open calls for conference papers." },
    ],
    links: [{ rel: "canonical", href: "/conferences/call-for-papers" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("conferences-call-for-papers")),
  component: () => <ContentPage slug="conferences-call-for-papers" title="Call for Papers" crumb="Call for Papers" />,
});
