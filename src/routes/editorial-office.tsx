import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { FAQSection } from "@/components/site/faq-section";
import { Mail, Phone, MapPin, Clock, Users, Send, Shield } from "lucide-react";

export const Route = createFileRoute("/editorial-office")({
  head: () => ({
    meta: [
      { title: "Editorial Office — INSIGHTONIX" },
      { name: "description", content: "Contact details, working hours, and remit of the INSIGHTONIX editorial office — the operational heart of the journal." },
      { property: "og:title", content: "Editorial Office — INSIGHTONIX" },
      { property: "og:description", content: "How to reach the INSIGHTONIX editorial office." },
    ],
    links: [{ rel: "canonical", href: "/editorial-office" }],
  }),
  component: Office,
});

const CHANNELS = [
  { icon: Mail, label: "Editorial email", value: "editorial@insightonix.com", href: "mailto:editorial@insightonix.com" },
  { icon: Mail, label: "Technical support", value: "support@insightonix.com", href: "mailto:support@insightonix.com" },
  { icon: Phone, label: "Phone (office hours)", value: "+91 000 000 0000", href: "tel:+910000000000" },
  { icon: MapPin, label: "Correspondence", value: "INSIGHTONIX Editorial Office, Registered Address (to be published).", href: "#" },
];

const REMIT = [
  { icon: Users, title: "Manuscript coordination", body: "Author correspondence, reviewer invitations, decision letters, and revision tracking." },
  { icon: Shield, title: "Ethics & compliance", body: "COPE-aligned handling of misconduct allegations, corrections, and expressions of concern." },
  { icon: Send, title: "Production & DOI", body: "Copy-editing, typesetting, proof cycles, Crossref DOI deposits, and indexing metadata." },
];

const HOURS = [
  { d: "Monday – Friday", t: "09:00 – 18:00 IST" },
  { d: "Saturday", t: "10:00 – 14:00 IST" },
  { d: "Sunday & public holidays", t: "Closed (auto-acknowledgement only)" },
];

const FAQS = [
  { q: "How quickly does the editorial office respond?", a: "First response within two working days. Ethics or misconduct queries are escalated within 24 hours to the Editor-in-Chief." },
  { q: "Can I visit the editorial office?", a: "INSIGHTONIX operates a distributed editorial team. All correspondence is handled by email; in-person meetings are by scheduled appointment at conferences." },
  { q: "Whom should I contact about DOIs or metadata corrections?", a: "Email editorial@insightonix.com with your article DOI and the correction requested. Metadata is re-deposited with Crossref within five working days." },
];

function Office() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Editorial office"
        intro="The INSIGHTONIX editorial office is the operational heart of the journal — coordinating peer review, ethics, production, and post-publication support."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Contact", to: "/contact" }, { label: "Editorial Office" }]} />

        <div className="grid gap-6 lg:grid-cols-2">
          {CHANNELS.map((c) => (
            <a key={c.label} href={c.href} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elev">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-brand-muted text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="mt-1 font-serif text-lg font-semibold">{c.value}</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-serif text-2xl font-semibold">What the office handles</h2>
            <div className="mt-2 rule-gold" />
            <ul className="mt-5 space-y-4">
              {REMIT.map((r) => (
                <li key={r.title} className="flex gap-3">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-brand-muted text-brand"><r.icon className="h-4 w-4" /></div>
                  <div>
                    <div className="font-serif text-base font-semibold">{r.title}</div>
                    <div className="text-sm text-muted-foreground">{r.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/40 to-background p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              <Clock className="h-4 w-4" /> Working hours
            </div>
            <h2 className="mt-3 font-serif text-2xl font-semibold">When we're online</h2>
            <div className="mt-2 rule-gold" />
            <ul className="mt-5 divide-y divide-border rounded-xl border border-border bg-card">
              {HOURS.map((h) => (
                <li key={h.d} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-serif font-semibold">{h.d}</span>
                  <span className="text-muted-foreground">{h.t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">All times listed in Indian Standard Time (UTC+05:30).</p>
          </div>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Prefer a form?"
          title="Submit a structured query"
          intro="Choose a topic and we'll route your request to the right specialist."
          actions={[
            { label: "Submit a query", to: "/submit-query", primary: true },
            { label: "Contact page", to: "/contact" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
