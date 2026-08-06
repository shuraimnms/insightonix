import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FAQSection } from "@/components/site/faq-section";
import { CtaStrip } from "@/components/site/cta-strip";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, ShieldCheck, Clock, Award, Users, Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/join-reviewer")({
  head: () => ({
    meta: [
      { title: "Become a Peer Reviewer — INSIGHTONIX" },
      {
        name: "description",
        content:
          "Apply to join the INSIGHTONIX standing peer-review panel. Recognised contributions, reviewer certificates, and priority consideration for editorial roles.",
      },
      { property: "og:title", content: "Join as Reviewer — INSIGHTONIX" },
      { property: "og:description", content: "Apply to review for INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/join-reviewer" }],
  }),
  component: JoinReviewer,
});

const BENEFITS = [
  {
    icon: Award,
    title: "Reviewer certificate",
    body: "A verifiable INSIGHTONIX-YYYY-#### certificate for every completed review, publicly verifiable on our /verify page.",
  },
  {
    icon: ShieldCheck,
    title: "Editorial recognition",
    body: "Top reviewers are invited to the annual Reviewer Honour Roll and considered for editorial appointments.",
  },
  {
    icon: Users,
    title: "Scholarly community",
    body: "Access to reviewer workshops, methods clinics, and networking with editors and authors across six continents.",
  },
  {
    icon: Clock,
    title: "Reasonable timelines",
    body: "Standard invitation windows of 21 days. Editors respect your workload and never over-assign.",
  },
];

const CRITERIA = [
  "Doctoral degree (or equivalent research standing) in multidisciplinary, global research, or an adjacent field.",
  "At least two peer-reviewed publications as first or corresponding author.",
  "Demonstrable expertise in one or more INSIGHTONIX subject areas.",
  "Commitment to double-blind, constructive, and timely review.",
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  affiliation: z.string().trim().min(2, "Please share your institution").max(200),
  country: z.string().trim().min(2).max(100),
  degree: z.string().trim().min(2).max(100),
  specialisms: z.string().trim().min(3, "List at least one specialism").max(400),
  publications: z.string().trim().min(3).max(200),
  motivation: z
    .string()
    .trim()
    .min(50, "A short motivation (min 50 chars) helps us match you well")
    .max(2000),
  orcid: z.string().trim().max(50).optional(),
});

const FAQS = [
  {
    q: "How many reviews will I be asked to complete?",
    a: "Typically 2–6 per year, depending on your specialism and availability. You are always free to decline any single invitation.",
  },
  {
    q: "Is there any compensation?",
    a: "Peer review is a voluntary service to the community. In return we provide certificates, discounted APCs on your own submissions, and formal recognition.",
  },
  {
    q: "How is my identity protected?",
    a: "INSIGHTONIX uses double-blind review. Author identity is stripped from manuscripts before you receive them, and your identity is never shared with the authors.",
  },
  {
    q: "When will I hear back?",
    a: "The editorial office reviews applications monthly. Successful applicants receive a reviewer welcome pack and are added to the standing panel.",
  },
];

function JoinReviewer() {
  const [f, setF] = useState({
    full_name: "",
    email: "",
    affiliation: "",
    country: "",
    degree: "",
    specialisms: "",
    publications: "",
    motivation: "",
    orcid: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // Prefill from session if signed in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u && !f.email) {
        setF((s) => ({
          ...s,
          email: u.email ?? s.email,
          full_name: (u.user_metadata?.full_name as string) ?? s.full_name,
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(f);
    if (!parsed.success)
      return toast.error(parsed.error.errors[0]?.message ?? "Please complete the form.");
    setBusy(true);
    try {
      const { error } = await supabase.from("audit_log").insert({
        action: "reviewer_application",
        entity_type: "reviewer",
        meta: parsed.data as never,
      });
      if (error) throw error;
      // Also subscribe email so the editorial office can follow up
      await supabase
        .from("subscribers")
        .insert({ email: parsed.data.email })
        .select()
        .maybeSingle();
      setDone(true);
      toast.success("Application received — we'll be in touch within 30 days.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Join the panel"
        title="Become an INSIGHTONIX peer reviewer"
        intro="Help shape the scholarly record in multidisciplinary and global research. Rigorous, timely, double-blind peer review is the heart of what we do."
      />
      <div className="container-page py-12">
        <Breadcrumbs
          trail={[
            { label: "Editorial Team", to: "/editorial-board" },
            { label: "Join as Reviewer" },
          ]}
        />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <article key={b.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              Who we're looking for
            </div>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Application criteria</h2>
            <div className="mt-2 rule-gold" />
            <ul className="mt-6 space-y-3 text-sm">
              {CRITERIA.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-brand" />
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-md border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
              Early-career researchers with a strong publication record and a mentor's
              recommendation are warmly encouraged to apply.
            </p>
          </div>

          <div>
            {done ? (
              <div className="rounded-2xl border border-brand/40 bg-brand-muted/30 p-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
                <h3 className="mt-4 font-serif text-2xl font-semibold">Application received</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you, {f.full_name}. Our editorial office reviews applications monthly and
                  will reply to <span className="text-foreground font-medium">{f.email}</span>{" "}
                  within 30 days.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    to="/reviewers"
                    className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold"
                  >
                    Browse reviewer board
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="rounded-2xl border border-border bg-card p-6 lg:p-8"
              >
                <h2 className="font-serif text-2xl font-semibold">Reviewer application</h2>
                <div className="mt-2 rule-gold" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    value={f.full_name}
                    onChange={(v) => setF({ ...f, full_name: v })}
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={f.email}
                    onChange={(v) => setF({ ...f, email: v })}
                    required
                  />
                  <Field
                    label="Affiliation / institution"
                    value={f.affiliation}
                    onChange={(v) => setF({ ...f, affiliation: v })}
                    required
                  />
                  <Field
                    label="Country"
                    value={f.country}
                    onChange={(v) => setF({ ...f, country: v })}
                    required
                  />
                  <Field
                    label="Highest degree"
                    value={f.degree}
                    onChange={(v) => setF({ ...f, degree: v })}
                    placeholder="e.g. PhD, Finance"
                    required
                  />
                  <Field
                    label="ORCID (optional)"
                    value={f.orcid}
                    onChange={(v) => setF({ ...f, orcid: v })}
                    placeholder="0000-0000-0000-0000"
                  />
                  <Field
                    label="Specialisms"
                    value={f.specialisms}
                    onChange={(v) => setF({ ...f, specialisms: v })}
                    placeholder="e.g. ESG, capital structure, panel econometrics"
                    required
                  />
                  <Field
                    label="Selected publications (Google Scholar URL or DOIs)"
                    value={f.publications}
                    onChange={(v) => setF({ ...f, publications: v })}
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block">
                    <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                      Why do you want to review for INSIGHTONIX?
                    </div>
                    <textarea
                      rows={5}
                      value={f.motivation}
                      onChange={(e) => setF({ ...f, motivation: e.target.value })}
                      className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      required
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-elev hover:brightness-110 disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {busy ? "Submitting…" : "Submit application"}
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Link to="/publication-ethics" className="text-brand hover:underline">
                    ethics policy
                  </Link>{" "}
                  and confirm the information above is accurate.
                </p>
              </form>
            )}
          </div>
        </section>

        <div className="mt-16">
          <FAQSection items={FAQS} />
        </div>

        <CtaStrip
          eyebrow="Prefer to browse first?"
          title="See the current reviewer board"
          actions={[
            { label: "View reviewers", to: "/reviewers", primary: true },
            { label: "Peer-review policy", to: "/peer-review-policy" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
