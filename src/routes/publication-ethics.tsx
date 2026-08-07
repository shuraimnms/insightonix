import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ShieldAlert, Users, Scale, FileWarning } from "lucide-react";

export const Route = createFileRoute("/publication-ethics")({
  head: () => ({
    meta: [
      { title: "Publication Ethics" },
      { name: "description", content: "Ethical guidelines for authors, reviewers, and editors in accordance with COPE standards." },
    ],
  }),
  component: PublicationEthics,
});

function PublicationEthics() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ethics & Integrity"
        title="Publication Ethics and Malpractice Statement"
        intro="We adhere to the best practices and ethical standards outlined by the Committee on Publication Ethics (COPE)."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Publication Ethics" }]} />

        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          <div className="space-y-8">
            <article className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-brand" />
                <h3 className="font-serif text-xl font-semibold">Duties of Authors</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
                <li><strong>Originality:</strong> Authors must guarantee that their submitted work is entirely original and not published elsewhere.</li>
                <li><strong>Data Access:</strong> Authors may be asked to provide raw data in connection with a paper for editorial review.</li>
                <li><strong>Authorship:</strong> Authorship should be limited to those who have made a significant contribution to the conception, design, execution, or interpretation of the study.</li>
                <li><strong>Disclosure:</strong> Authors must disclose any financial or other substantive conflicts of interest that might influence the results or interpretation of their manuscript.</li>
                <li><strong>Errors:</strong> If an author discovers a significant error in their published work, it is their obligation to promptly notify the journal editor.</li>
              </ul>
            </article>

            <article className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-6 w-6 text-brand" />
                <h3 className="font-serif text-xl font-semibold">Duties of Reviewers</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
                <li><strong>Confidentiality:</strong> Any manuscripts received for review must be treated as confidential documents.</li>
                <li><strong>Objectivity:</strong> Reviews should be conducted objectively, with clear supporting arguments. Personal criticism of the author is inappropriate.</li>
                <li><strong>Promptness:</strong> Any selected referee who feels unqualified to review the research or knows that its prompt review will be impossible should notify the editor and withdraw.</li>
                <li><strong>Acknowledgment of Sources:</strong> Reviewers should identify relevant published work that has not been cited by the authors.</li>
              </ul>
            </article>
          </div>

          <div className="space-y-8">
            <article className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="h-6 w-6 text-brand" />
                <h3 className="font-serif text-xl font-semibold">Duties of Editors</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
                <li><strong>Fair Play:</strong> Editors evaluate manuscripts for their intellectual content without regard to race, gender, sexual orientation, religious belief, ethnic origin, citizenship, or political philosophy of the authors.</li>
                <li><strong>Publication Decisions:</strong> The Editor-in-Chief is responsible for deciding which articles submitted to the journal should be published, often in conjunction with the editorial board and reviewers.</li>
                <li><strong>Confidentiality:</strong> The editorial staff must not disclose any information about a submitted manuscript to anyone other than the corresponding author, reviewers, and the publisher.</li>
                <li><strong>Conflicts of Interest:</strong> Unpublished materials disclosed in a submitted manuscript must not be used in an editor's own research without the express written consent of the author.</li>
              </ul>
            </article>

            <article className="rounded-xl border border-amber-400/40 bg-amber-50/40 p-6 dark:bg-amber-950/20">
              <div className="flex items-center gap-3 mb-4">
                <FileWarning className="h-6 w-6 text-amber-600" />
                <h3 className="font-serif text-xl font-semibold text-amber-800 dark:text-amber-200">AI and Generative Tools</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                The use of AI and AI-assisted technologies in the writing process must be explicitly disclosed in the manuscript. 
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>AI tools cannot be listed as an author.</li>
                <li>Authors are fully responsible for the accuracy and originality of the content generated by AI tools.</li>
                <li>AI should only be used to improve readability and language, not to replace researcher insights or data analysis.</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
