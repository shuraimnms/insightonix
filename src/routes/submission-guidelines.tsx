import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/submission-guidelines")({
  head: () => ({
    meta: [
      { title: "Submission Guidelines — INSIGHTONIX" },
      { name: "description", content: "How to submit a manuscript to INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/submission-guidelines" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("submission-guidelines")),
  component: () => <ContentPage slug="submission-guidelines" title="Submission Guidelines" crumb="Submission Guidelines" />,
});
