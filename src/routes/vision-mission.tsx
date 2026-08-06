import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaStrip } from "@/components/site/cta-strip";
import {
  Compass,
  Target,
  ShieldCheck,
  Sparkles,
  Handshake,
  Lightbulb,
  Globe2,
  BookOpen,
  GraduationCap,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/vision-mission")({
  head: () => ({
    meta: [
      { title: "Vision & Mission — INSIGHTONIX" },
      {
        name: "description",
        content:
          "The vision, mission, and commitments guiding the International Journal of Academic Research in Multidisciplinary and Global Research.",
      },
      { property: "og:title", content: "Vision & Mission — INSIGHTONIX" },
      {
        property: "og:description",
        content:
          "Advancing multidisciplinary and global research knowledge through original research, ethical publishing, and responsible dissemination.",
      },
    ],
    links: [{ rel: "canonical", href: "/vision-mission" }],
  }),
  component: VisionMission,
});

const VISION_AREAS = [
  { icon: Sparkles, title: "Academic excellence" },
  { icon: Lightbulb, title: "Research originality" },
  { icon: ShieldCheck, title: "Ethical publication" },
  { icon: Globe2, title: "International scholarly engagement" },
  { icon: BookOpen, title: "Interdisciplinary research" },
  { icon: Handshake, title: "Professional relevance" },
  { icon: GraduationCap, title: "Open knowledge dissemination" },
  { icon: Building2, title: "Institutional & socio-economic development" },
];

const MISSION_COMMITMENTS = [
  "Publishing original and academically relevant research.",
  "Maintaining ethical and transparent editorial practices.",
  "Providing fair and impartial peer review.",
  "Supporting interdisciplinary and practice-oriented scholarship.",
  "Encouraging research on emerging business and global research issues.",
  "Protecting author, reviewer, and participant confidentiality.",
  "Promoting open and accessible scholarly communication.",
  "Preventing plagiarism, data fabrication, duplicate publication, and other misconduct.",
  "Encouraging research that benefits academia, industry, institutions, policy makers, and society.",
];

function VisionMission() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Vision & mission"
        title="Advancing multidisciplinary & global research knowledge responsibly"
        intro="INSIGHTONIX aspires to develop into a credible, widely recognised scholarly platform for quality research, academic innovation, ethical publishing, and professional knowledge."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "About", to: "/about" }, { label: "Vision & Mission" }]} />

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/60 to-transparent p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <Compass className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              Vision statement
            </div>
            <p className="mt-2 font-serif text-xl font-semibold leading-snug">
              To advance multidisciplinary and global research knowledge through original research,
              ethical publishing, academic collaboration, and responsible dissemination of scholarly
              work.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              INSIGHTONIX promotes a research culture in which original ideas, reliable evidence,
              theoretical advancement, practical insights, and policy-oriented studies are shared
              openly and responsibly with the global academic community — supporting established
              researchers as well as emerging scholars.
            </p>
          </article>
          <article className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/60 to-transparent p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <Target className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-brand font-semibold">
              Mission
            </div>
            <p className="mt-2 font-serif text-xl font-semibold leading-snug">
              A dependable platform for meaningful research in multidisciplinary, global research,
              and allied fields — served through editorial screening, external double-blind peer
              review, ethical publication standards, transparent policies, open access, responsible
              authorship, and academic accountability.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
            Core vision areas
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold">What we stand for</h2>
          <div className="mt-2 rule-gold" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VISION_AREAS.map((v) => (
              <article
                key={v.title}
                className="rounded-xl border border-border bg-card p-5 transition hover:border-brand/40 hover:shadow-elev"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-muted text-brand">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-serif text-sm font-semibold">{v.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-border bg-card p-8 lg:p-12">
          <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">
            Mission commitments
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold">INSIGHTONIX is committed to</h2>
          <div className="mt-2 rule-gold" />
          <ul className="mt-6 grid gap-3">
            {MISSION_COMMITMENTS.map((o, i) => (
              <li
                key={o}
                className="flex items-start gap-4 rounded-md border border-border bg-background p-4"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{o}</span>
              </li>
            ))}
          </ul>
        </section>

        <CtaStrip
          eyebrow="Share our vision?"
          title="Join INSIGHTONIX as an author, reviewer, or reader"
          actions={[
            { label: "Submit a paper", to: "/submit", primary: true },
            { label: "Apply as reviewer", to: "/join-reviewer" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}
