import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PersonGrid } from "@/components/site/person-grid";
import { CtaStrip } from "@/components/site/cta-strip";
import { FAQSection } from "@/components/site/faq-section";
import { boardQuery } from "@/lib/queries";

export const Route = createFileRoute("/advisory-board")({
  head: () => ({
    meta: [
      { title: "International Advisory Board — INSIGHTONIX" },
      {
        name: "description",
        content:
          "Senior scholars and practitioners advising INSIGHTONIX on strategic direction, ethics, and long-term editorial policy.",
      },
      { property: "og:title", content: "Advisory Board — INSIGHTONIX" },
      { property: "og:description", content: "Strategic advisors to INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/advisory-board" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(boardQuery()),
  component: Advisory,
});

const FAQS = [
  {
    q: "What does the advisory board do?",
    a: "The board advises on long-term editorial strategy, ethics policy, indexing partnerships, and the appointment of the Editor-in-Chief. It does not handle individual manuscripts.",
  },
  {
    q: "How are advisory board members selected?",
    a: "Members are invited by the Editor-in-Chief in consultation with existing advisors, on the basis of scholarly record, editorial experience, and international representation.",
  },
  {
    q: "How long do advisors serve?",
    a: "Three-year renewable terms with staggered rotation to ensure continuity and fresh perspectives.",
  },
];

function Advisory() {
  const { data } = useSuspenseQuery(boardQuery());
  const people = data.filter((m) => m.role === "advisory");

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Governance"
        title="International Advisory Board"
        intro="Distinguished scholars and practitioners who shape INSIGHTONIX's long-term direction, ethics posture, and international presence."
      />
      <div className="container-page py-12">
        <Breadcrumbs
          trail={[{ label: "Editorial Team", to: "/editorial-board" }, { label: "Advisory Board" }]}
        />

        <section>
          <h2 className="font-serif text-3xl font-semibold">
            {people.length} advisors · advising editorial strategy
          </h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-8">
            <PersonGrid people={people} />
          </div>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Governance & transparency"
          title="Full transparency about how INSIGHTONIX is run"
          intro="Read our editorial independence, conflict-of-interest, and appeals policies."
          actions={[
            { label: "Publication ethics", to: "/publication-ethics", primary: true },
            { label: "Peer-review policy", to: "/peer-review-policy" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
