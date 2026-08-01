import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — INSIGHTONIX" }], links: [{ rel: "canonical", href: "/privacy" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("privacy")),
  component: () => <ContentPage slug="privacy" title="Privacy Policy" crumb="Privacy" />,
});
