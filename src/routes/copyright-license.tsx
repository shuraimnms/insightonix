import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/copyright-license")({
  head: () => ({
    meta: [{ title: "Copyright & License — INSIGHTONIX" }, { name: "description", content: "Copyright and licensing terms." }],
    links: [{ rel: "canonical", href: "/copyright-license" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("copyright-license")),
  component: () => <ContentPage slug="copyright-license" title="Copyright & License" crumb="Copyright & License" />,
});
