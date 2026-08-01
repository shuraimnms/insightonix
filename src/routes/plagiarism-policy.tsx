import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/plagiarism-policy")({
  head: () => ({
    meta: [
      { title: "Plagiarism Policy — INSIGHTONIX" },
      { name: "description", content: "Plagiarism detection and prevention policy." },
      { property: "og:title", content: "Plagiarism Policy — INSIGHTONIX" },
      { property: "og:description", content: "Plagiarism detection and prevention policy." },
    ],
    links: [{ rel: "canonical", href: "/plagiarism-policy" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("plagiarism-policy")),
  component: () => <ContentPage slug="plagiarism-policy" title="Plagiarism Policy" crumb="Plagiarism" />,
});
