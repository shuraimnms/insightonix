import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/peer-review-policy")({
  head: () => ({
    meta: [
      { title: "Peer Review Policy — INSIGHTONIX" },
      { name: "description", content: "Double-blind peer review policy and procedures." },
      { property: "og:title", content: "Peer Review Policy — INSIGHTONIX" },
      { property: "og:description", content: "Double-blind peer review policy and procedures." },
    ],
    links: [{ rel: "canonical", href: "/peer-review-policy" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("peer-review-policy")),
  component: () => (
    <ContentPage slug="peer-review-policy" title="Peer Review Policy" crumb="Peer Review" />
  ),
});
