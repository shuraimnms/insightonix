import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/copyright-policy")({
  head: () => ({
    meta: [
      { title: "Copyright Policy — INSIGHTONIX" },
      { name: "description", content: "Copyright and author rights policy." },
      { property: "og:title", content: "Copyright Policy — INSIGHTONIX" },
      { property: "og:description", content: "Copyright and author rights policy." },
    ],
    links: [{ rel: "canonical", href: "/copyright-policy" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pageQuery("copyright-policy")),
  component: () => <ContentPage slug="copyright-policy" title="Copyright Policy" crumb="Copyright" />,
});
