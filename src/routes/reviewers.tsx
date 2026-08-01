import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PersonGrid } from "@/components/site/person-grid";
import { CtaStrip } from "@/components/site/cta-strip";
import { boardQuery } from "@/lib/queries";
import { Search, Globe2, Award, Clock } from "lucide-react";

export const Route = createFileRoute("/reviewers")({
  head: () => ({
    meta: [
      { title: "Reviewer Board — INSIGHTONIX" },
      { name: "description", content: "Search the standing peer-review panel of INSIGHTONIX — expert reviewers across multidisciplinary and global research, drawn from institutions worldwide." },
      { property: "og:title", content: "Reviewer Board — INSIGHTONIX" },
      { property: "og:description", content: "Our standing peer-review panel." },
    ],
    links: [{ rel: "canonical", href: "/reviewers" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(boardQuery()),
  component: Reviewers,
});

function Reviewers() {
  const { data } = useSuspenseQuery(boardQuery());
  const all = data.filter((m) => m.role === "reviewer");
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("");

  const countries = useMemo(
    () => Array.from(new Set(all.map((r) => r.country).filter(Boolean) as string[])).sort(),
    [all],
  );

  const filtered = useMemo(() => {
    return all.filter((r) => {
      if (country && r.country !== country) return false;
      if (!q) return true;
      const hay = `${r.name} ${r.affiliation ?? ""} ${r.title ?? ""} ${r.country ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [all, q, country]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Peer review"
        title="Our reviewer board"
        intro="Every published article in INSIGHTONIX has passed through the hands of at least two independent, double-blind peer reviewers drawn from this standing panel."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Editorial Team", to: "/editorial-board" }, { label: "Reviewers" }]} />

        {/* Stats strip */}
        <section className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3">
          <Kpi icon={Award} v={all.length} l="Active reviewers" />
          <Kpi icon={Globe2} v={countries.length} l="Countries represented" />
          <Kpi icon={Clock} v={21} l="Median review turnaround (days)" />
        </section>

        {/* Filters */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, institution, or specialism…"
                className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                aria-label="Search reviewers"
              />
            </div>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              aria-label="Filter by country"
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {all.length}
            </div>
          </div>

          <div className="mt-8">
            <PersonGrid people={filtered} />
          </div>
        </section>

        <CtaStrip
          eyebrow="Want to review?"
          title="Join our reviewer panel"
          intro="We're always looking for rigorous scholars with a track record of peer review. Applications from early-career researchers are welcome."
          actions={[
            { label: "Apply as reviewer", to: "/join-reviewer", primary: true },
            { label: "Read our peer-review policy", to: "/peer-review-policy" },
          ]}
        />
      </div>
    </SiteLayout>
  );
}

function Kpi({ icon: Icon, v, l }: { icon: React.ComponentType<{ className?: string }>; v: number; l: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-muted text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-serif text-2xl font-semibold">{v.toLocaleString()}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
      </div>
    </div>
  );
}
