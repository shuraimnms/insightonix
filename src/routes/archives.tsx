import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ChevronRight, ChevronDown, CalendarDays, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/archives")({
  head: () => ({
    meta: [
      { title: "Archives (2015 – 2026) — INSIGHTONIX" },
      { name: "description", content: "Complete INSIGHTONIX publication archive — Volumes 1 through 12, quarterly issues (March, June, September, December) since 2015." },
      { property: "og:title", content: "INSIGHTONIX Publication Archive (2015 – 2026)" },
      { property: "og:description", content: "Browse every volume and issue of INSIGHTONIX from Volume 1 (2015) to the current Volume 12 (2026)." },
    ],
    links: [{ rel: "canonical", href: "/archives" }],
  }),
  component: Archives,
});

type IssueRow = { volume: number; issue: number; month: "March" | "June" | "September" | "December" };

// Deterministic build of the entire archive from 2015 → 2026.
// V1 (2015) started in June, so only 3 issues (June, Sep, Dec).
// V12 (2026) is current — 2 issues so far (March, June).
function buildArchive(): { year: number; volume: number; issues: IssueRow[] }[] {
  const rows: { year: number; volume: number; issues: IssueRow[] }[] = [];
  for (let year = 2015; year <= 2026; year++) {
    const volume = year - 2014;
    let issues: IssueRow[];
    if (year === 2015) {
      issues = [
        { volume, issue: 1, month: "June" },
        { volume, issue: 2, month: "September" },
        { volume, issue: 3, month: "December" },
      ];
    } else if (year === 2026) {
      issues = [
        { volume, issue: 1, month: "March" },
        { volume, issue: 2, month: "June" },
      ];
    } else {
      issues = [
        { volume, issue: 1, month: "March" },
        { volume, issue: 2, month: "June" },
        { volume, issue: 3, month: "September" },
        { volume, issue: 4, month: "December" },
      ];
    }
    rows.push({ year, volume, issues });
  }
  return rows.reverse(); // newest first
}

const MONTH_COLOR: Record<IssueRow["month"], string> = {
  March: "text-emerald-600 dark:text-emerald-400",
  June: "text-sky-600 dark:text-sky-400",
  September: "text-amber-600 dark:text-amber-400",
  December: "text-fuchsia-600 dark:text-fuchsia-400",
};
const MONTH_DOT: Record<IssueRow["month"], string> = {
  March: "bg-emerald-500",
  June: "bg-sky-500",
  September: "bg-amber-500",
  December: "bg-fuchsia-500",
};

function Archives() {
  const archive = buildArchive();
  const flatRows = archive.flatMap((y) => y.issues.map((i) => ({ year: y.year, ...i })));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Publication Archive"
        title="INSIGHTONIX Publication Archive (2015 – 2026)"
        intro="Quarterly Publication · March • June • September • December. Volume 1 launched in June 2015; the archive now spans twelve continuous volumes."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Archives" }]} />

        {/* Summary strip */}
        <section className="mb-10 rounded-2xl border border-brand/30 bg-gradient-to-br from-brand to-brand/80 p-6 text-brand-foreground shadow-elev md:p-8">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { k: "12", l: "Volumes" },
              { k: `${flatRows.length}`, l: "Total issues" },
              { k: "4", l: "Issues / year" },
              { k: "2015 → 2026", l: "Continuous years" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                <div className="font-serif text-2xl font-semibold md:text-3xl">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-wider opacity-90">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Left: Volume & Issue List table */}
          <section>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <header className="border-b border-border bg-brand px-5 py-3 text-brand-foreground">
                <h2 className="font-serif text-lg font-semibold tracking-tight">Volume & Issue List</h2>
              </header>
              <div className="max-h-[720px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-secondary/70 backdrop-blur">
                    <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5 font-semibold">Year</th>
                      <th className="px-4 py-2.5 font-semibold">Volume</th>
                      <th className="px-4 py-2.5 font-semibold">Issue</th>
                      <th className="px-4 py-2.5 font-semibold">Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flatRows.map((r, idx) => (
                      <tr key={`${r.year}-${r.volume}-${r.issue}`} className={cn("border-t border-border/60 hover:bg-accent/60 transition-colors", idx % 2 === 0 && "bg-background")}>
                        <td className="px-4 py-2 font-medium">
                          <Link to="/articles" search={{ year: r.year } as never} className="hover:text-brand hover:underline">
                            {r.year}
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          <Link to="/articles" search={{ volume: r.volume } as never} className="hover:text-brand hover:underline">
                            Volume {r.volume}
                          </Link>
                        </td>
                        <td className={cn("px-4 py-2 font-semibold", MONTH_COLOR[r.month])}>
                          <Link to="/articles" search={{ volume: r.volume, issue: r.issue } as never} className="hover:underline">
                            Issue {r.issue}
                          </Link>
                        </td>
                        <td className={cn("px-4 py-2 font-semibold", MONTH_COLOR[r.month])}>
                          <Link to="/articles" search={{ volume: r.volume, issue: r.issue } as never} className="hover:underline">
                            {r.month}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Right: Journal stack tree */}
          <section>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <header className="border-b border-border bg-brand px-5 py-3 text-brand-foreground">
                <h2 className="font-serif text-lg font-semibold tracking-tight">Archive Structure (Journal Stack)</h2>
              </header>
              <div className="max-h-[720px] overflow-y-auto p-4 space-y-2">
                {archive.map((yr, i) => (
                  <YearNode key={yr.year} year={yr.year} issues={yr.issues} defaultOpen={i < 3} />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Legend (Issues)</div>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  {(["March", "June", "September", "December"] as const).map((m) => (
                    <li key={m} className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", MONTH_DOT[m])} />
                      <span>Issue {m === "March" ? 1 : m === "June" ? 2 : m === "September" ? 3 : 4} – {m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-400/40 bg-amber-50/50 p-4 dark:bg-amber-950/20">
                <div className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-300">Important Note</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  The journal is published quarterly in March, June, September and December. This archive is organised as per the standard volume-per-year system.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer band */}
        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold">INSIGHTONIX is published <span className="text-brand">QUARTERLY</span> in March, June, September and December.</div>
              <div className="text-xs text-muted-foreground">2015 (started in June) → 2026 (up to June)</div>
            </div>
          </div>
          <Link to="/current-issue" className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:brightness-110">
            <BookOpen className="h-4 w-4" /> Current Issue
          </Link>
        </section>
      </div>
    </SiteLayout>
  );
}

function YearNode({ year, issues, defaultOpen }: { year: number; issues: IssueRow[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-lg border border-border/70 bg-background/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-accent"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 font-serif text-lg font-semibold">
          {open ? <ChevronDown className="h-4 w-4 text-brand" /> : <ChevronRight className="h-4 w-4 text-brand" />}
          {year}
        </span>
        <span className="text-xs text-muted-foreground">{issues.length} issue{issues.length > 1 ? "s" : ""}</span>
      </button>
      {open ? (
        <ul className="relative ml-6 border-l border-dashed border-border pl-4 pb-3 pt-1">
          {issues
            .slice()
            .reverse()
            .map((i) => (
              <li key={i.issue} className="relative py-1.5">
                <span className={cn("absolute -left-[19px] top-3 h-2.5 w-2.5 rounded-full ring-2 ring-background", MONTH_DOT[i.month])} />
                <Link
                  to="/articles"
                  search={{ volume: i.volume, issue: i.issue } as never}
                  className={cn("group inline-flex items-center gap-2 text-sm font-medium hover:underline", MONTH_COLOR[i.month])}
                >
                  Volume {i.volume} Issue {i.issue} <span className="text-muted-foreground group-hover:text-inherit">({i.month})</span>
                </Link>
              </li>
            ))}
        </ul>
      ) : null}
    </div>
  );
}
