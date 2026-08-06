import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { AlertTriangle, Info } from "lucide-react";

export const Route = createFileRoute("/apc")({
  head: () => ({
    meta: [
      { title: "Publication Charges — INSIGHTONIX" },
      {
        name: "description",
        content:
          "INSIGHTONIX's publication charges policy, waiver conditions, refund terms, and ethical safeguards for authors.",
      },
      { property: "og:title", content: "Publication Charges — INSIGHTONIX" },
      {
        property: "og:description",
        content: "Publication and processing charges policy for INSIGHTONIX.",
      },
    ],
    links: [{ rel: "canonical", href: "/apc" }],
  }),
  component: APC,
});

const CHARGE_ROWS: [string, string][] = [
  ["Article Processing Charge", "To be officially confirmed"],
  ["Submission Fee", "To be confirmed"],
  ["Peer-Review Fee", "To be confirmed"],
  ["Publication Fee", "To be confirmed"],
  ["DOI Fee", "To be confirmed"],
  ["Printed Copy Charges", "To be confirmed (if printed copies offered)"],
  ["Certificate Charges", "To be confirmed (if separate certificates issued)"],
];

const REFUND_CASES = [
  "Payment made before editorial screening",
  "Rejected manuscripts",
  "Author withdrawal",
  "Duplicate payment",
  "Technical payment failure",
  "Withdrawal after peer review",
  "Withdrawal after acceptance",
  "Published articles",
];

const ETHICS_NOTES = [
  "Payment must never guarantee acceptance.",
  "Peer-review decisions must remain independent of payment.",
  "Charges will be communicated before publication.",
  "All payments will be acknowledged through an official receipt.",
  "No hidden charges will be imposed after acceptance.",
];

function APC() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Publication charges"
        title="Publication charges policy"
        intro="The applicable publication or processing charges, if any, will be communicated transparently to the corresponding author before final publication. Authors should not make any payment unless an official communication is received from the journal through its authorized email address."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Publication Charges" }]} />

        <section className="rounded-2xl border border-amber-400/40 bg-amber-50/40 p-6 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 flex-none text-amber-600" />
            <div>
              <div className="font-serif text-lg font-semibold">Charges not yet finalised</div>
              <p className="mt-1 text-sm text-muted-foreground">
                The journal administration is finalising the official schedule of publication
                charges. Until confirmed, the applicable amounts, if any, will be communicated to
                the corresponding author before final publication.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold">Charge schedule</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CHARGE_ROWS.map(([k, v]) => (
                  <tr key={k}>
                    <td className="px-5 py-3 font-serif font-semibold">{k}</td>
                    <td className="px-5 py-3 text-muted-foreground">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-serif text-lg font-semibold">Waiver policy</h3>
            <div className="mt-2 rule-gold" />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The journal will clearly state whether full or partial fee waivers are available and
              the conditions under which they may be granted. Details will be published here once
              approved by the journal administration.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-serif text-lg font-semibold">Refund policy</h3>
            <div className="mt-2 rule-gold" />
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {REFUND_CASES.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h2 className="font-serif text-2xl font-semibold">Important ethical notice</h2>
          </div>
          <div className="mt-2 rule-gold" />
          <ul className="mt-5 space-y-2 text-sm">
            {ETHICS_NOTES.map((n) => (
              <li key={n} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-destructive" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <CtaStrip
          eyebrow="Questions?"
          title="Contact the editorial office"
          intro="For any question about charges, waivers, or refunds, please write to the editorial office."
          actions={[
            { label: "Contact editorial office", to: "/contact", primary: true },
            { label: "Submit manuscript", to: "/submit" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
