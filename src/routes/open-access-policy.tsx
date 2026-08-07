import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { BookOpen, ShieldCheck, Info } from "lucide-react";

export const Route = createFileRoute("/open-access-policy")({
  head: () => ({
    meta: [
      { title: "Open Access Policy" },
      { name: "description", content: "Open access statement, user and author responsibilities, and archiving policy." },
    ],
  }),
  component: OpenAccess,
});

const USER_RESP = [
  "Provide proper citation and acknowledgement of the original author and source.",
  "Respect copyright and licensing conditions under the Creative Commons framework.",
  "Avoid unauthorized commercial reuse of the material unless permitted.",
  "Avoid misrepresentation, alteration, or misuse of published material.",
  "Obtain permission wherever required for reproduction of copyrighted content.",
];

const AUTHOR_RESP = [
  "Ensure manuscripts are original and unpublished elsewhere.",
  "All sources must be properly acknowledged and cited.",
  "Copyrighted third-party material must be used with explicit permission.",
  "Copyright or licensing forms must be completed accurately after acceptance.",
  "Published work must not be republished in the same or substantially similar form without explicit permission.",
];

function OpenAccess() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Open access"
        title="Open Access Policy"
        intro="We provide immediate open access to published content to promote wider dissemination and exchange of global academic knowledge."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Open Access Policy" }]} />

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">Open access statement</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Readers may access, download, copy, distribute, print, search, or link to the full texts of articles for legitimate academic, educational, research, and professional purposes, subject to the journal's licensing conditions.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">Why open access?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Open access breaks down paywalls and subscription barriers, helping researchers, academicians, students, practitioners, policy makers, and institutions access critical scholarly information freely.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
              <Info className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">Archiving Policy</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Published articles are permanently archived on the journal website and may be deposited in approved academic, digital, archival, or indexing repositories in accordance with our preservation strategy.
            </p>
          </article>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h2 className="font-serif text-xl font-semibold">User responsibilities</h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-3 text-sm text-muted-foreground">Readers using content must:</p>
            <ul className="mt-3 space-y-2 text-sm">
              {USER_RESP.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h2 className="font-serif text-xl font-semibold">Author responsibilities</h2>
            <div className="mt-2 rule-gold" />
            <p className="mt-3 text-sm text-muted-foreground">Authors must ensure that:</p>
            <ul className="mt-3 space-y-2 text-sm">
              {AUTHOR_RESP.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-12 rounded-2xl border border-amber-400/40 bg-amber-50/40 p-6 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-none text-amber-600" />
            <div>
              <div className="font-serif text-lg font-semibold">Licence Notice</div>
              <p className="mt-1 text-sm text-muted-foreground">
                All articles are published under the Creative Commons Attribution (CC BY) license. This permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.
              </p>
            </div>
          </div>
        </section>

        <CtaStrip
          eyebrow="Related"
          title="Copyright policy & current issue"
          actions={[
            { label: "Copyright policy", to: "/copyright-policy", primary: true },
            { label: "Current issue", to: "/current-issue" },
            { label: "Browse archives", to: "/archives" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
