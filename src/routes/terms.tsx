import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms — INSIGHTONIX" }],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("terms")),
  component: () => <ContentPage slug="terms" title="Terms of Use" crumb="Terms" />,
});
