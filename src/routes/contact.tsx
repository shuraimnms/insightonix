import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JOURNAL } from "@/lib/journal";
import { Mail, MapPin, Globe, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — INSIGHTONIX" },
      { name: "description", content: "Contact the INSIGHTONIX editorial office for submissions, editorial enquiries, reviewer registration, ethics complaints, and technical support." },
      { property: "og:title", content: "Contact — INSIGHTONIX" },
      { property: "og:description", content: "Editorial office and enquiry channels for INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const CATEGORIES = [
  "New Manuscript Submission",
  "Manuscript Status",
  "Revision Submission",
  "Reviewer Registration",
  "Editorial Board Enquiry",
  "Publication Charges",
  "Copyright and Licensing",
  "Correction or Retraction",
  "Ethics Complaint",
  "Technical Support",
  "General Enquiry",
];

const CONTACT_CHANNELS = [
  { title: "Manuscript Submission", body: "For submitting new manuscripts and supporting documents." },
  { title: "Editorial Enquiries", body: "For manuscript status, editorial screening, revision, acceptance, or publication." },
  { title: "Reviewer Enquiries", body: "For reviewer registration, review assignments, guidelines, or communication." },
  { title: "Ethics & Complaints", body: "For plagiarism complaints, authorship issues, conflicts of interest, corrections, withdrawals, or retractions." },
  { title: "Technical Assistance", body: "For website registration, login, file upload, or submission-system difficulties." },
];

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  institution: z.string().trim().max(200).optional(),
  country: z.string().trim().max(100).optional(),
  manuscript_id: z.string().trim().max(50).optional(),
  category: z.string().trim().min(2).max(80),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal("on"),
});

function Contact() {
  const [busy, setBusy] = useState(false);
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Contact the editorial office"
        intro="Authors, reviewers, readers, institutions, and academic partners may contact the editorial office regarding manuscript submission, peer review, revision, publication, corrections, ethical matters, and general journal enquiries."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Contact" }]} />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Send us a message</h2>
            <div className="mt-2 rule-gold" />
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const parsed = schema.safeParse(Object.fromEntries(fd));
                if (!parsed.success) {
                  toast.error(parsed.error.errors[0]?.message ?? "Please check the form.");
                  return;
                }
                setBusy(true);
                setTimeout(() => {
                  setBusy(false);
                  toast.success("Message sent to the editorial office. We usually reply within 2 working days.");
                  (e.target as HTMLFormElement).reset();
                }, 600);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Email address" name="email" type="email" required />
                <Field label="Institution" name="institution" />
                <Field label="Country" name="country" />
                <Field label="Manuscript ID (if any)" name="manuscript_id" />
                <label className="block">
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Nature of enquiry *</div>
                  <select name="category" required className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand">
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </div>
              <Field label="Subject" name="subject" required />
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Message *</label>
                <textarea name="message" rows={6} required className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-brand" />
              </div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" name="consent" required className="mt-0.5" />
                <span>I consent to INSIGHTONIX storing the information above solely to respond to my enquiry.</span>
              </label>
              <button disabled={busy} type="submit" className="inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground disabled:opacity-60">
                {busy ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 text-sm">
              <div className="font-serif text-lg font-semibold">Editorial office</div>
              <div className="mt-2 rule-gold" />
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-brand" /><a href={`mailto:${JOURNAL.email}`} className="hover:text-brand">{JOURNAL.email}</a></div>
                <div className="flex items-start gap-3"><Globe className="mt-0.5 h-4 w-4 text-brand" /><span>insightonix.com</span></div>
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-brand" /><span>India</span></div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Publisher, postal address, telephone, and office hours will be updated once officially confirmed by the journal administration.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-400/40 bg-amber-50/40 p-6 text-sm dark:bg-amber-950/20">
              <div className="flex items-center gap-2 font-serif text-base font-semibold">
                <ShieldAlert className="h-4 w-4 text-amber-600" /> Communication notice
              </div>
              <p className="mt-2 text-muted-foreground">
                Authors should communicate only through the journal's official email address. Manuscript acceptance, publication charges, and payment instructions should be treated as valid only when issued through an authorized journal communication channel.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-2xl font-semibold">Enquiry categories</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTACT_CHANNELS.map((c) => (
              <article key={c.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-serif text-base font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                <a href={`mailto:${JOURNAL.email}`} className="mt-3 inline-block text-xs font-semibold text-brand hover:underline">{JOURNAL.email}</a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}{required ? " *" : ""}</div>
      <input name={name} type={type} required={required} className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand" />
    </label>
  );
}
