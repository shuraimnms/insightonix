import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PersonGrid } from "@/components/site/person-grid";
import { CtaStrip } from "@/components/site/cta-strip";
import { boardQuery } from "@/lib/queries";

export const Route = createFileRoute("/associate-editors")({
  head: () => ({
    meta: [
      { title: "Associate Editors — INSIGHTONIX" },
      { name: "description", content: "Meet the subject editors who handle submissions across finance, marketing, HR, operations, and strategy at INSIGHTONIX." },
      { property: "og:title", content: "Associate Editors — INSIGHTONIX" },
      { property: "og:description", content: "INSIGHTONIX's subject-specialist editorial team." },
    ],
    links: [{ rel: "canonical", href: "/associate-editors" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(boardQuery()),
  component: AssociateEditors,
});

function AssociateEditors() {
  const { data } = useSuspenseQuery(boardQuery());
  const editors = data.filter((m) => m.role === "editorial" && !(m.title ?? "").toLowerCase().includes("editor-in-chief"));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Editorial team"
        title="Associate & subject editors"
        intro="Each submission is assigned to an editor with deep expertise in its subject area, ensuring reviewer selection, timelines, and decisions reflect the state of the art in that field."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Editorial Team", to: "/editorial-board" }, { label: "Associate Editors" }]} />

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold">{editors.length} subject editors · six continents</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Editors are appointed for renewable three-year terms, chosen for their scholarly record, editorial temperament, and demonstrated commitment to double-blind review.
              </p>
            </div>
          </div>
          <div className="mt-2 rule-gold" />
          <div className="mt-8">
            <PersonGrid people={editors} />
          </div>
        </section>

        <CtaStrip
          eyebrow="Nominate an editor"
          title="Know someone who should join the editorial team?"
          intro="We're always growing our subject-editor bench. Nominations from institutions and learned societies are welcome."
          actions={[
            { label: "Contact the Editor-in-Chief", to: "/editor-in-chief", primary: true },
            { label: "Apply as reviewer", to: "/join-reviewer" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
