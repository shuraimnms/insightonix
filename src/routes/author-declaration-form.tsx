import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/content-page";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/author-declaration-form")({
  head: () => ({
    meta: [
      { title: "Author Declaration Form — INSIGHTONIX" },
      { name: "description", content: "Declaration and originality form." },
      { property: "og:title", content: "Author Declaration Form — INSIGHTONIX" },
      { property: "og:description", content: "Declaration and originality form." },
    ],
    links: [{ rel: "canonical", href: "/author-declaration-form" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(pageQuery("author-declaration-form")),
  component: () => (
    <ContentPage
      slug="author-declaration-form"
      title="Author Declaration Form"
      crumb="Declaration"
    />
  ),
});
