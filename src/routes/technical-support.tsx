import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import { FAQSection } from "@/components/site/faq-section";
import {
  LifeBuoy,
  KeyRound,
  UploadCloud,
  Hash,
  FileWarning,
  Mail,
  MessageSquare,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/technical-support")({
  head: () => ({
    meta: [
      { title: "Technical Support — INSIGHTONIX" },
      {
        name: "description",
        content:
          "Get help with account access, submission uploads, DOI look-up, certificate verification, and any technical issue with the INSIGHTONIX platform.",
      },
      { property: "og:title", content: "Technical Support — INSIGHTONIX" },
      { property: "og:description", content: "Fast help for authors, reviewers, and readers." },
    ],
    links: [{ rel: "canonical", href: "/technical-support" }],
  }),
  component: Support,
});

const TOPICS = [
  {
    icon: KeyRound,
    title: "Account & sign-in",
    body: "Password resets, Google sign-in issues, ORCID linking, and multi-author account merging.",
    to: "/auth",
  },
  {
    icon: UploadCloud,
    title: "Manuscript upload",
    body: "File format guidance, 25 MB size limit, supplementary files, and browser-specific issues.",
    to: "/submit",
  },
  {
    icon: Hash,
    title: "DOI & indexing",
    body: "DOI resolution, Crossref metadata, Google Scholar visibility, and indexing certificate requests.",
    to: "/indexing",
  },
  {
    icon: FileWarning,
    title: "Verification & certificates",
    body: "Certificate ID look-up, re-issue requests, and confirmation letters for institutions.",
    to: "/verify",
  },
];

const SLA = [
  { icon: Clock, k: "< 24 hrs", label: "First response, working days" },
  { icon: MessageSquare, k: "97%", label: "Tickets resolved in first reply" },
  { icon: LifeBuoy, k: "Mon–Sat", label: "Support coverage" },
];

const FAQS = [
  {
    q: "I never received the confirmation email — what should I do?",
    a: "Check spam and any institutional quarantine, then request a resend from the sign-in page. If the address is a Gmail alias with a plus-tag, try the primary address.",
  },
  {
    q: "My upload keeps failing at the last step.",
    a: "Ensure the total size is below 25 MB, that filenames contain no special characters, and that you are on a modern Chromium or Firefox browser. If the issue persists, email support with a screenshot.",
  },
  {
    q: "How do I recover a submission ID?",
    a: "Log in to your author dashboard — every submission is listed with its ID (INSIGHTONIX-YYYY-####). If the account is inaccessible, contact the editorial office with your registered email.",
  },
];

function Support() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Support"
        title="Technical support"
        intro="Practical help for authors, reviewers, and readers using the INSIGHTONIX platform. Most issues are resolved on first reply."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Support" }, { label: "Technical Support" }]} />

        {/* SLA band */}
        <section className="grid gap-4 sm:grid-cols-3">
          {SLA.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-serif text-xl font-semibold">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Topics */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-semibold">Browse by topic</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <a
                key={t.title}
                href={t.to}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elev"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Contact block */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/40 to-background p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold">Email support</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Send a description of the issue plus a screenshot if possible.
            </p>
            <a
              href="mailto:support@insightonix.com"
              className="mt-4 inline-block font-mono text-sm text-brand hover:underline"
            >
              support@insightonix.com
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold">Editorial queries</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For manuscript decisions, ethics, or review conduct, please reach the editorial office
              directly.
            </p>
            <a
              href="mailto:editorial@insightonix.com"
              className="mt-4 inline-block font-mono text-sm text-brand hover:underline"
            >
              editorial@insightonix.com
            </a>
          </div>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Prefer a form?"
          title="Submit a support query"
          intro="Structured intake helps us route your ticket to the right specialist faster."
          actions={[
            { label: "Submit a query", to: "/submit-query", primary: true },
            { label: "Read FAQs", to: "/faqs" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
