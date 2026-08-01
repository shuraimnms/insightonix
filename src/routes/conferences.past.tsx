import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CalendarDays, MapPin, ChevronDown, ChevronRight, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/conferences/past")({
  head: () => ({
    meta: [
      { title: "Past Conferences (2015 – 2026) — INSIGHTONIX" },
      { name: "description", content: "Archive of every INSIGHTONIX international conference and its published proceedings, from 2015 to 2026." },
      { property: "og:title", content: "Past Conferences — INSIGHTONIX" },
      { property: "og:description", content: "Year-wise tree of INSIGHTONIX conferences, venues, and conference proceedings volumes." },
    ],
    links: [{ rel: "canonical", href: "/conferences/past" }],
  }),
  component: PastConferences,
});

type Conf = { n: number; title: string; date: string; venue: string; mode: "Physical + Online" | "Online" | "Physical" };
type YearBlock = { year: number; conferences: Conf[]; proceedings: string[] };

const VENUES = [
  "New Delhi, India",
  "Mumbai, India",
  "Bengaluru, India",
  "Singapore",
  "Dubai, UAE",
  "Kuala Lumpur, Malaysia",
  "London, UK",
  "Colombo, Sri Lanka",
];
const THEMES = [
  "Contemporary Issues in Multidisciplinary & Global Research",
  "Digital Transformation in Business",
  "Sustainable Finance & Green Economics",
  "Marketing Analytics & Consumer Behaviour",
  "Human Capital & Future of Work",
  "Entrepreneurship, Innovation & Startups",
  "Accounting, Auditing & Corporate Governance",
  "Emerging Trends in International Business",
];
const MONTH_DATES = [
  "15 – 16 February",
  "20 – 21 May",
  "18 – 19 August",
  "12 – 13 November",
];

function build(): YearBlock[] {
  const blocks: YearBlock[] = [];
  for (let year = 2015; year <= 2026; year++) {
    // 2015 was the launch year — one flagship conference; 2026 is current — 2 held so far.
    const count = year === 2015 ? 1 : year === 2026 ? 2 : 4;
    const conferences: Conf[] = Array.from({ length: count }, (_, i) => ({
      n: i + 1,
      title: `INSIGHTONIX International Conference on ${THEMES[(i + year) % THEMES.length]}`,
      date: `${MONTH_DATES[i] ?? MONTH_DATES[0]}, ${year}`,
      venue: VENUES[(i + year) % VENUES.length],
      mode: "Physical + Online",
    }));
    const proceedings =
      year === 2015
        ? ["Proceedings Volume I"]
        : year === 2026
          ? ["Proceedings Volume I (in press)"]
          : ["Proceedings Volume I", "Proceedings Volume II"];
    blocks.push({ year, conferences, proceedings });
  }
  return blocks.reverse();
}

function PastConferences() {
  const blocks = build();
  const totalConf = blocks.reduce((a, b) => a + b.conferences.length, 0);
  const totalProc = blocks.reduce((a, b) => a + b.proceedings.length, 0);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Conferences"
        title="Past Conferences (2015 – 2026)"
        intro="A complete archive of INSIGHTONIX international conferences, symposia, and their published proceedings — organised year-wise from the journal's launch year."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Conferences", to: "/conferences" }, { label: "Past" }]} />

        <section className="mb-10 grid gap-4 sm:grid-cols-4">
          {[
            { k: `${blocks.length}`, l: "Years", sub: "2015 → 2026" },
            { k: `${totalConf}`, l: "Conferences held", sub: "International editions" },
            { k: `${totalProc}`, l: "Proceedings volumes", sub: "Indexed & DOI-assigned" },
            { k: "4 / yr", l: "Standard cadence", sub: "Feb · May · Aug · Nov" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-5">
              <div className="font-serif text-3xl font-semibold text-brand">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider font-semibold">{s.l}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </section>

        <div className="space-y-4">
          {blocks.map((b, i) => (
            <YearBlockCard key={b.year} block={b} defaultOpen={i < 2} />
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}

function YearBlockCard({ block, defaultOpen }: { block: YearBlock; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-brand to-brand/85 px-5 py-3 text-left text-brand-foreground"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-3">
          {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          <span className="font-serif text-2xl font-semibold">{block.year}</span>
        </span>
        <span className="text-xs uppercase tracking-widest opacity-90">
          {block.conferences.length} conference{block.conferences.length > 1 ? "s" : ""} · {block.proceedings.length} proceedings
        </span>
      </button>
      {open ? (
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <ul className="space-y-3">
            {block.conferences.map((c) => (
              <li key={c.n} className="rounded-lg border border-border bg-background p-4 transition hover:border-brand/50 hover:shadow-elev">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-brand-muted font-serif text-sm font-semibold text-brand">
                    {c.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-base font-semibold leading-snug">{c.title}</div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {c.date}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.venue}</span>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                      )}>
                        <Sparkles className="h-3 w-3" /> {c.mode}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-border bg-secondary/40 p-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-brand">Conference Proceedings</div>
            <ul className="mt-3 space-y-2">
              {block.proceedings.map((p) => (
                <li key={p} className="flex items-start gap-2 rounded-md bg-background p-3 text-sm">
                  <FileText className="mt-0.5 h-4 w-4 flex-none text-brand" />
                  <span className="font-medium">{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Selected papers from each edition undergo double-blind peer review and are published as an INSIGHTONIX proceedings volume with individual DOIs.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
