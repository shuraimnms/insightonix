import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import {
  currentIssueQuery,
  articlesQuery,
  announcementsQuery,
  settingsQuery,
} from "@/lib/queries";
import { JOURNAL } from "@/lib/journal";
import {
  ArrowRight,
  BookOpen,
  Users,
  CalendarDays,
  Globe,
  Unlock,
  ChevronRight,
  Mail,
  MapPin,
  Globe2,
  FileText,
  UserCheck,
  Target,
  BookOpenCheck,
  ShieldCheck,
  Calendar,
  MessageCircle,
  HelpCircle,
  Download,
  Quote,
  CheckCircle2,
  Sparkles,
  Send,
  ClipboardCheck,
  Search as SearchIcon,
  ScrollText,
  Stamp,
  Rocket,
  Zap,
  Hash,
  Award,
  BookMarked,
  Database,
  LineChart,
} from "lucide-react";
import { StepFlow } from "@/components/site/step-flow";

const INDEXING_PARTNERS = [
  { name: "Crossref (DOI)", category: "Persistent ID", icon: Hash },
  { name: "Google Scholar", category: "Discovery", icon: SearchIcon },
  { name: "DOAJ(APPLIED FOR)", category: "Directory", icon: BookMarked },
  { name: "Index Copernicus", category: "Evaluation", icon: Award },
  { name: "ROAD (ISSN)", category: "Registry", icon: Globe },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Insightonix Global Insights Journal" },
      {
        name: "description",
        content:
          "INSIGHTONIX is an international peer-reviewed open-access multidisciplinary journal dedicated to publishing innovative, high-impact research.",
      },
      { property: "og:title", content: "Insightonix Global Insights Journal" },
      {
        property: "og:description",
        content: "Peer-reviewed, open access multidisciplinary journal.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(currentIssueQuery());
    void context.queryClient.ensureQueryData(announcementsQuery());
    void context.queryClient.ensureQueryData(settingsQuery());
  },
  component: Home,
});

const QUICK_LINKS = [
  { label: "Editorial Team", to: "/editorial-board", icon: Users },
  { label: "Reviewer", to: "/join-reviewer", icon: UserCheck },
  { label: "Focus and Scope", to: "/aims-scope", icon: Target },
  { label: "Author Guidelines", to: "/author-guidelines", icon: BookOpenCheck },
  { label: "Publication Ethics", to: "/publication-ethics", icon: ShieldCheck },
  { label: "Publication Frequency", to: "/publication-timeline", icon: Calendar },
  { label: "Peer Review Process", to: "/peer-review-policy", icon: FileText },
  { label: "Contact Us", to: "/contact", icon: MessageCircle },
  { label: "FAQ", to: "/faqs", icon: HelpCircle },
] as const;

const FEATURES = [
  { icon: Globe, title: "International Journal", body: "Reach scholars and researchers worldwide" },
  { icon: Database, title: "Multidisciplinary Research", body: "Publishing across all major disciplines" },
  { icon: Zap, title: "Global Research Visibility", body: "High impact and wide discoverability" },
  { icon: Unlock, title: "Open Access", body: "Freely available for reading and download" },
] as const;

const WHY_POINTS = [
  "High Visibility",
  "Fast & Fair Review",
  "Global Readership",
  "Open Access",
  "DOI for Every Article",
] as const;

function Home() {
  const { data: issue } = useSuspenseQuery(currentIssueQuery());
  const { data: announcements } = useSuspenseQuery(announcementsQuery());
  const { data: settings } = useSuspenseQuery(settingsQuery());
  const { data: currentArticles } = useSuspenseQuery(articlesQuery(issue?.id));

  const indexing = (settings.indexing as { name: string; url: string }[] | undefined) ?? [];

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-brand-muted/30">
        <div className="container-page flex items-center gap-2 py-3 text-sm">
          <Link to="/" className="text-brand hover:underline">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{JOURNAL.name}</span>
        </div>
      </div>

      {/* Main grid: content + sidebar */}
      <section className="container-page py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT: hero + cover */}
          <div>
            <div className="grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start">
              {/* Copy */}
              <div>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] font-bold uppercase leading-[1.15] text-brand">
                  Insightonix Global Insights Journal
                  <span className="block text-brand/90">(INSIGHTONIX)</span>
                </h1>
                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground max-w-xl">
                  INSIGHTONIX is an international peer-reviewed open-access multidisciplinary journal committed to publishing
                  innovative, high-impact research across science, engineering, technology, medicine, business, education, humanities, and more.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/submit"
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-5 text-sm font-semibold text-white shadow-elev hover:brightness-105 transition"
                    style={{ background: "var(--gold)" }}
                  >
                    <FileText className="h-4 w-4" /> Submit Manuscript
                  </Link>
                  <Link
                    to="/current-issue"
                    className="inline-flex h-11 items-center gap-2 rounded-md border-2 border-gold bg-background px-5 text-sm font-semibold text-brand hover:bg-gold/5 transition"
                    style={{ borderColor: "var(--gold)" }}
                  >
                    <BookOpen className="h-4 w-4" /> View Current Issue
                  </Link>
                </div>
              </div>

              {/* Cover */}
              <div className="mx-auto w-full max-w-[280px]">
                <div className="relative aspect-[3/4] rounded-sm border border-border bg-[oklch(0.97_0.02_75)] shadow-elev overflow-hidden">
                  {/* Bookmark ribbon */}
                  <div className="absolute left-6 top-0 h-16 w-8" style={{ background: "var(--gold)" }}>
                    <div className="absolute -bottom-2 left-0 h-0 w-0 border-l-[16px] border-r-[16px] border-t-[10px] border-l-transparent border-r-transparent" style={{ borderTopColor: "var(--gold)" }} />
                  </div>
                  <div className="absolute left-6 top-0 h-16 w-8 -translate-x-[10px] opacity-70" style={{ background: "var(--brand)" }}>
                    <div className="absolute -bottom-2 left-0 h-0 w-0 border-l-[16px] border-r-[16px] border-t-[10px] border-l-transparent border-r-transparent" style={{ borderTopColor: "var(--brand)" }} />
                  </div>
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <div className="font-serif text-4xl font-bold text-brand">INSIGHTONIX</div>
                    <div className="mt-3 h-[2px] w-14" style={{ background: "var(--gold)" }} />
                    <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-brand/80 leading-snug">
                      Insightonix Global Insights Journal
                    </div>
                  </div>
                  {/* wave */}
                  <svg className="absolute inset-x-0 bottom-0" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <path d="M0,40 Q50,10 100,35 T200,30 L200,60 L0,60 Z" fill="var(--brand)" opacity="0.08" />
                    <path d="M0,45 Q50,20 100,45 T200,40 L200,60 L0,60 Z" fill="var(--gold)" opacity="0.15" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature strip */}
            <div className="mt-8 rounded-lg border border-border bg-card shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
                {FEATURES.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="p-5 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ color: "var(--gold)" }}>
                      <Icon className="h-8 w-8" strokeWidth={1.75} />
                    </div>
                    <div className="mt-2 font-semibold text-sm text-foreground">{title}</div>
                    <div className="mt-1 text-xs text-muted-foreground leading-snug">{body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-column info panels */}
            <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="grid gap-6 md:grid-cols-4">
                {/* Call for papers */}
                <InfoBlock title="CALL FOR PAPERS">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    INSIGHTONIX invites original and unpublished research papers for upcoming issues.
                  </p>
                  <Link
                    to="/conferences/call-for-papers"
                    className="mt-3 inline-flex h-8 items-center rounded border px-3 text-xs font-semibold text-gold hover:bg-gold/5"
                    style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
                  >
                    Read More
                  </Link>
                </InfoBlock>

                {/* Announcements */}
                <InfoBlock title="LATEST ANNOUNCEMENTS">
                  <ul className="space-y-1.5 text-sm">
                    {(announcements.slice(0, 4).length > 0
                      ? announcements.slice(0, 4)
                      : [
                          { id: "1", title: "Call for Papers – Volume 11, Issue 3" },
                          { id: "2", title: "Special Issue on Emerging Trends" },
                          { id: "3", title: "Reviewer Invitation" },
                          { id: "4", title: "Website Update" },
                        ]
                    ).map((a) => (
                      <li key={a.id} className="flex items-start gap-1.5 text-foreground/85">
                        <span className="mt-1.5 h-1 w-1 flex-none rounded-full" style={{ background: "var(--gold)" }} />
                        <span className="leading-snug">{a.title}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/archives" className="mt-3 inline-block text-xs font-semibold underline" style={{ color: "var(--gold)" }}>
                    View All
                  </Link>
                </InfoBlock>

                {/* Latest articles */}
                <InfoBlock title="LATEST ARTICLES">
                  <ul className="space-y-1.5 text-sm">
                    {currentArticles.slice(0, 4).map((a) => (
                      <li key={a.id} className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 flex-none rounded-full" style={{ background: "var(--gold)" }} />
                        <Link
                          to="/articles/$slug"
                          params={{ slug: a.slug }}
                          className="leading-snug text-foreground/85 hover:text-brand line-clamp-2"
                        >
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to="/latest-articles" className="mt-3 inline-block text-xs font-semibold underline" style={{ color: "var(--gold)" }}>
                    View All Articles
                  </Link>
                </InfoBlock>

                {/* Why publish */}
                <InfoBlock title="WHY PUBLISH WITH INSIGHTONIX?">
                  <ul className="space-y-1.5 text-sm">
                    {WHY_POINTS.map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-foreground/85">
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-none" style={{ color: "var(--gold)" }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/about" className="mt-3 inline-block text-xs font-semibold underline" style={{ color: "var(--gold)" }}>
                    Read More
                  </Link>
                </InfoBlock>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5">
            {/* Quick Menu */}
            <SidebarCard title="QUICK MENU">
              <ul className="divide-y divide-border">
                {QUICK_LINKS.map(({ label, to, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-brand-muted/40 transition"
                    >
                      <Icon className="h-4 w-4" style={{ color: "var(--gold)" }} />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarCard>

            {/* User login */}
            <SidebarCard title="USER LOGIN">
              <form
                className="space-y-3 p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = "/auth";
                }}
              >
                <div>
                  <label className="text-xs font-medium text-foreground">Username</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" className="h-3.5 w-3.5" /> Remember me
                </label>
                <button
                  type="submit"
                  className="w-full rounded px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition"
                  style={{ background: "var(--gold)" }}
                >
                  Login
                </button>
                <div className="flex justify-between text-xs">
                  <Link to="/auth" className="underline" style={{ color: "var(--gold)" }}>Forgot Password?</Link>
                  <Link to="/auth" search={{ mode: "up" }} className="underline" style={{ color: "var(--gold)" }}>Create Account</Link>
                </div>
              </form>
            </SidebarCard>

            {/* Indexing */}
            <SidebarCard title="ABSTRACTING & INDEXING">
              <div className="grid grid-cols-2 gap-3 p-4">
                {(indexing.length > 0
                  ? indexing.slice(0, 6)
                  : [
                      { name: "Google Scholar", url: "/google-scholar" },
                      { name: "Dimensions", url: "/indexing" },
                      { name: "Crossref", url: "/crossref" },
                      { name: "DOAJ(APPLIED FOR)", url: "/indexing" },
                    ]
                ).map((i) => (
                  <a
                    key={i.name}
                    href={i.url}
                    target={i.url.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex h-16 items-center justify-center rounded border border-border bg-background px-2 text-center text-xs font-semibold text-brand hover:border-brand transition"
                  >
                    {i.name}
                  </a>
                ))}
              </div>
            </SidebarCard>
          </aside>
        </div>
      </section>

      {/* ============ PREMIUM SECTIONS BELOW ============ */}

      {/* Journal at a glance — stat band with brand gradient */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--brand) 0%, oklch(0.32 0.08 200) 55%, oklch(0.22 0.06 220) 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
            backgroundSize: "42px 42px, 68px 68px",
          }}
        />
        <div className="container-page relative py-14 lg:py-16">
          <div className="text-center">
            <div
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase backdrop-blur"
              style={{ color: "var(--gold)" }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Journal at a Glance
            </div>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold">
              Advancing global research
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-[15px] text-white/75">
              INSIGHTONIX has been advancing peer-reviewed multidisciplinary research with global visibility, ethical publishing and open access.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: BookOpen, value: "1,240+", label: "Published Articles" },
              { icon: Users, value: "6,500+", label: "Authors Worldwide" },
              { icon: Download, value: "185K", label: "Downloads / Year" },
              { icon: Globe, value: "62", label: "Countries Reached" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-white/15 bg-white/[0.06] p-5 text-center backdrop-blur-sm transition hover:bg-white/[0.1]"
              >
                <div
                  className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: "var(--gold)", color: "var(--brand)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-serif text-3xl md:text-4xl font-semibold text-white">
                  {value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publication Process — 6 step workflow */}
      <section className="relative bg-gradient-to-b from-brand-muted/20 via-background to-background">
        <div className="container-page py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
              How it works
            </div>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-brand">
              From submission to publication
            </h2>
            <p className="mt-3 text-sm md:text-[15px] text-muted-foreground">
              A transparent, double-blind peer review workflow designed for authors who value speed,
              fairness and academic rigor.
            </p>
          </div>

          <div className="relative mt-12">
            <StepFlow
              steps={[
                { icon: Send, title: "Submit", body: "Upload manuscript" },
                { icon: ClipboardCheck, title: "Screening", body: "Editorial check" },
                { icon: SearchIcon, title: "Peer Review", body: "Double-blind" },
                { icon: ScrollText, title: "Revision", body: "Author response" },
                { icon: Stamp, title: "Acceptance", body: "Decision & proof" },
                { icon: Rocket, title: "Publication", body: "DOI & indexing" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Indexing marquee */}
      <section className="border-y border-border bg-gradient-to-r from-brand-muted/50 via-background to-brand-muted/50 py-10">
        <div className="container-page">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
              Abstracting &amp; Indexing
            </div>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-brand">
              Discoverable across leading databases
            </h2>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border bg-card py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card to-transparent" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-card to-transparent" aria-hidden />
            <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
              {[...INDEXING_PARTNERS, ...INDEXING_PARTNERS].map((p, i) => (
                <div key={`${p.name}-${i}`} className="flex items-center gap-3 whitespace-nowrap px-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md text-brand-foreground shadow-elev animate-float" style={{ background: "var(--brand)" }}>
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span className="font-serif text-base font-semibold text-brand">{p.name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="group relative mt-3 overflow-hidden rounded-xl border border-border bg-background py-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" aria-hidden />
            <div className="flex w-max animate-marquee-reverse gap-8 group-hover:[animation-play-state:paused]">
              {[...INDEXING_PARTNERS, ...INDEXING_PARTNERS].reverse().map((p, i) => (
                <span key={`t-${p.name}-${i}`} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gold)" }} />
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subject areas grid */}
      <section className="border-y border-border bg-card">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-center">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                Focus & Scope
              </div>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-brand">
                Subject areas we publish
              </h2>
              <p className="mt-4 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                INSIGHTONIX welcomes original manuscripts across Computer Science, Engineering, Medicine, Humanities, and Multidisciplinary global research domains, from empirical studies and conceptual reviews to case research and policy analysis.
              </p>
              <Link
                to="/aims-scope"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-semibold text-white shadow-elev hover:brightness-105 transition"
                style={{ background: "var(--brand)" }}
              >
                Read full scope <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                "Computer Science",
                "Engineering",
                "Medicine",
                "Humanities",
                "Multidisciplinary Research",
                "Technology",
                "Business",
                "Social Sciences",
                "Environmental Studies",
              ].map((s) => (
                <div
                  key={s}
                  className="group flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-3 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-elev"
                  style={{ boxShadow: "inset 0 0 0 0 var(--gold)" }}
                >
                  <span
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-md transition group-hover:scale-110"
                    style={{ background: "var(--brand-muted)", color: "var(--brand)" }}
                  >
                    <CheckCircle2 className="h-4 w-4" style={{ color: "var(--gold)" }} />
                  </span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call for Papers banner */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, var(--brand) 0%, oklch(0.30 0.09 210) 60%, oklch(0.55 0.14 60) 130%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gold)" }}
        />
        <div className="container-page relative py-14 lg:py-16">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="text-white">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur"
                style={{ color: "var(--gold)" }}
              >
                <Zap className="h-3.5 w-3.5" /> Call for Papers
              </div>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold leading-tight">
                Submit to the upcoming issue &mdash;{" "}
                <span style={{ color: "var(--gold)" }}>Volume 11, Issue 3</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-[15px] text-white/80">
                Original, unpublished research across all major disciplines is
                invited. Fast-track peer review, DOI on acceptance, and open access indexing.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/submit"
                  className="inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-semibold text-brand shadow-elev hover:brightness-105 transition"
                  style={{ background: "var(--gold)" }}
                >
                  Submit manuscript <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/author-guidelines"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-white/40 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Author guidelines
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "Deadline", v: "Sep 30, 2026" },
                { k: "Review", v: "14–21 days" },
                { k: "APC", v: "Waivers avail." },
                { k: "Indexed", v: "12+ databases" },
              ].map((it) => (
                <div
                  key={it.k}
                  className="rounded-xl border border-white/15 bg-white/[0.07] p-4 text-center backdrop-blur"
                >
                  <div className="text-[10.5px] font-bold uppercase tracking-widest text-white/70">
                    {it.k}
                  </div>
                  <div className="mt-1 font-serif text-lg font-semibold text-white">{it.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background">
        <div className="container-page py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
              Trusted by researchers
            </div>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-brand">
              What our authors say
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "The review process was thorough yet remarkably quick. My paper was strengthened by the reviewers' insights.",
                name: "Dr. Anjali Menon",
                role: "Associate Professor, Delhi",
              },
              {
                quote:
                  "Transparent editorial communication and a clean production process. INSIGHTONIX is now my first choice.",
                name: "Prof. R. Krishnan",
                role: "IIM Bangalore",
              },
              {
                quote:
                  "Open access with DOI made my work highly discoverable. Citations grew within months.",
                name: "Dr. Sarah Ibrahim",
                role: "University of Lagos",
              },
            ].map((t) => (
              <figure
                key={t.name}
                className="relative rounded-xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-elev"
              >
                <Quote
                  className="absolute -top-3 left-5 h-8 w-8 rounded-full bg-background p-1.5"
                  style={{ color: "var(--gold)" }}
                />
                <blockquote className="text-sm leading-relaxed text-foreground/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full font-serif text-sm font-bold text-white"
                    style={{ background: "var(--brand)" }}
                  >
                    {t.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-brand">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter handled by site footer — kept single source */}

      {/* Contact strip */}
      <section className="border-t border-border bg-card">
        <div className="container-page grid gap-6 py-8 md:grid-cols-3">
          <ContactItem icon={Mail} label="EDITORIAL EMAIL" value={JOURNAL.email} />
          <ContactItem icon={Globe2} label="WEBSITE" value="www.insightonix.com" />
          <ContactItem icon={MapPin} label="ADDRESS" value="India" />
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[13px] font-bold tracking-wide text-brand">{title}</h3>
      <div className="mt-1 h-[2px] w-10" style={{ background: "var(--gold)" }} />
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <div
        className="px-4 py-2.5 text-[13px] font-bold tracking-wide text-brand-foreground"
        style={{ background: "var(--brand)" }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-11 w-11 flex-none items-center justify-center rounded-full"
        style={{ background: "var(--brand-muted)", color: "var(--brand)" }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] font-bold tracking-wider text-brand">{label}</div>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}
