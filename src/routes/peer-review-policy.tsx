import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Search, Users, CheckCircle, FileSignature } from "lucide-react";

export const Route = createFileRoute("/peer-review-policy")({
  head: () => ({
    meta: [
      { title: "Peer Review Policy" },
      { name: "description", content: "Details of our double-blind peer review process." },
    ],
  }),
  component: PeerReview,
});

function PeerReview() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Peer Review"
        title="Double-Blind Peer Review Policy"
        intro="We employ a rigorous double-blind peer review process to ensure the highest quality of published research and maintain scholarly integrity."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Peer Review Policy" }]} />

        <div className="mt-8 space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-semibold">1. Initial Screening</h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Search className="mt-1 h-6 w-6 text-brand" />
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Upon submission, manuscripts undergo an initial administrative check by the Editorial Office. We verify formatting compliance, scope alignment, and conduct a thorough plagiarism check using industry-standard software. Manuscripts failing this stage may be rejected immediately or returned to authors for correction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">2. Double-Blind Review</h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Users className="mt-1 h-6 w-6 text-brand" />
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Manuscripts passing the initial screening are sent to at least two independent expert reviewers. We strictly adhere to a <strong>double-blind</strong> review model, meaning the identities of both the authors and the reviewers are concealed from each other throughout the process to prevent any bias.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">3. Reviewer Evaluation</h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <FileSignature className="mt-1 h-6 w-6 text-brand" />
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Reviewers evaluate the manuscript based on originality, methodological rigor, clarity of presentation, and relevance to the field. They provide constructive feedback and recommend one of the following decisions:
                  </p>
                  <ul className="mt-3 ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Accept without revisions</li>
                    <li>Accept with minor revisions</li>
                    <li>Revise and resubmit (major revisions)</li>
                    <li>Reject</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">4. Final Decision</h2>
            <div className="mt-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="mt-1 h-6 w-6 text-brand" />
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The Editor-in-Chief or the assigned handling Editor makes the final decision based on the reviewer reports. In cases of conflicting reviews, an additional reviewer may be consulted. The final decision, along with reviewer comments (anonymized), is communicated to the corresponding author.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
