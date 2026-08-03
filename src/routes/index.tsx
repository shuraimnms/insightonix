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
      { title: "Insightonix — Insightonix Global Insights Journal" },
      {
        name: "description",
        content:
          "INSIGHTONIX is a peer-reviewed, open access journal publishing innovative research in global insights, analytics and multidisciplinary trends.",
      },
      { property: "og:title", content: "Insightonix — Insightonix Global Insights Journal" },
      {
        property: "og:description",
        content: "Peer-reviewed, open access quarterly journal in global insights.",
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
  { icon: Unlock, title: "Open Access", body: "Freely available for reading and download" },
  { icon: Users, title: "Double Blind Review", body: "All submissions are reviewed anonymously" },
  { icon: CalendarDays, title: "Quarterly Publication", body: "4 Issues per year (Mar, Jun, Sep, Dec)" },
  { icon: Globe, title: "Global Readership", body: "Reach scholars and researchers worldwide" },
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
      {/* Exact Hero Section from Image */}
      <section className="relative w-full min-h-[100svh] md:min-h-[600px] lg:min-h-[700px] overflow-hidden bg-[#000000]">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/insightonix_hero_bg.jpg" 
            alt="Global Research" 
            className="w-full h-full object-cover object-center"
          />
        </div>
          {/* Elegant Dark gradient for text readability without blocking the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/5 pointer-events-none z-0"></div>

        {/* Right Edge Call for Papers Tab */}
        <Link to="/conferences/call-for-papers" className="hidden md:flex absolute right-0 top-[20%] z-30 bg-[#2563eb] text-white py-4 px-2 rounded-l-md font-bold text-sm tracking-widest writing-mode-vertical hover:bg-[#1d4ed8] transition-colors shadow-lg" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          CALL FOR PAPERS
        </Link>

        {/* Left Dark Blue Overlay Box */}
        <div className="relative z-10 container-page h-full flex items-center">
          <div className="w-full max-w-[650px] bg-transparent px-4 py-24 sm:px-6 md:py-10 md:px-10 md:pt-16 relative z-10">
            
            {/* Green top-left corner accent to mimic image's swoosh from header (optional, but requested exactness so we focus on the box content) */}
            
            {/* Small Gold Squares */}
            <div className="flex gap-1.5 mb-6">
              <div className="w-2 h-2 bg-[#3b82f6]"></div>
              <div className="w-2 h-2 bg-[#3b82f6]"></div>
              <div className="w-2 h-2 bg-[#3b82f6]"></div>
              <div className="w-2 h-2 bg-[#3b82f6]"></div>
            </div>
            
            <div className="text-[11.5px] md:text-[13px] font-bold tracking-[0.15em] text-white/90 uppercase mb-4 leading-relaxed">
              WELCOME TO Insightonix
            </div>
            <h1 className="font-serif text-[32px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.25] md:leading-[1.15] font-bold text-white mb-6 drop-shadow-lg">
              Insightonix <br />
              <span className="text-[#3b82f6]">Global Insights Journal</span>
            </h1>
            
            <p className="text-white/90 text-[15px] leading-relaxed mb-8 max-w-lg md:text-[17px]">
              Data-driven perspectives and analytical insights on global trends.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10 relative z-20">
              <Link
                to="/current-issue"
                className="bg-[#3b82f6] hover:brightness-110 text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                Explore Research
              </Link>
              <Link
                to="/submit"
                className="bg-transparent border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 font-bold text-[15px] px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5"
              >
                Submit Manuscript
              </Link>
            </div>

            {/* Icons List */}
            <div className="space-y-4 max-w-[320px]">
              <div className="flex items-center gap-4">
                <div className="w-6 flex justify-center"><Stamp className="h-5 w-5 text-[#3b82f6]" /></div>
                <span className="text-white font-medium text-sm tracking-wider uppercase whitespace-nowrap">ANALYTICS</span>
                <div className="flex-1 flex items-center">
                  <div className="h-[1px] bg-black/20 flex-1"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 flex justify-center"><LineChart className="h-5 w-5 text-[#3b82f6]" /></div>
                <span className="text-white font-medium text-sm tracking-wider uppercase whitespace-nowrap">INSIGHTS</span>
                <div className="flex-1 flex items-center">
                  <div className="h-[1px] bg-black/20 flex-1"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 flex justify-center"><Zap className="h-5 w-5 text-[#3b82f6]" /></div>
                <span className="text-white font-medium text-sm tracking-wider uppercase whitespace-nowrap">GLOBAL</span>
                <div className="flex-1 flex items-center">
                  <div className="h-[1px] bg-black/20 flex-1"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Research Network Strip */}
      <div className="relative bg-[#111111] py-6 border-b-4 border-[#3b82f6]">
        {/* Overlapping Badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-[#3b82f6] px-6 py-1.5 rounded-full shadow-sm z-20">
          <span className="text-[#3b82f6] font-serif font-bold text-sm tracking-widest uppercase">
            RESEARCH NETWORK
          </span>
        </div>

        <div className="container-page relative z-10 flex flex-wrap items-center justify-center gap-6 md:justify-between px-4 lg:px-12 py-6 md:py-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#3b82f6] flex items-center justify-center bg-[#3b82f6]">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif font-bold text-[#000000] tracking-wide">ANALYTICS</span>
          </div>

          <div className="hidden md:block flex-1 mx-4">
            <div className="flex items-center justify-center w-full">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] opacity-50"></div>
              <div className="h-[1px] w-full bg-[#3b82f6] opacity-30"></div>
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] opacity-50"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#3b82f6] flex items-center justify-center bg-[#3b82f6]">
              <LineChart className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif font-bold text-[#000000] tracking-wide">INSIGHTS</span>
          </div>

          <div className="hidden md:block flex-1 mx-4">
            <div className="flex items-center justify-center w-full">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] opacity-50"></div>
              <div className="h-[1px] w-full bg-[#3b82f6] opacity-30"></div>
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] opacity-50"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#3b82f6] flex items-center justify-center bg-[#3b82f6]">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif font-bold text-[#000000] tracking-wide">GLOBAL TRENDS</span>
          </div>

          <div className="hidden md:block flex-1 mx-4">
            <div className="flex items-center justify-center w-full">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] opacity-50"></div>
              <div className="h-[1px] w-full bg-[#3b82f6] opacity-30"></div>
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] opacity-50"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#3b82f6] flex items-center justify-center bg-[#3b82f6]">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif font-bold text-[#000000] tracking-wide">DATA</span>
          </div>

        </div>
      </div>

      {/* Existing content layout wrappers */}
      <section className="container-page py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {/* 4-column info panels */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
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

            {/* Bottom Widgets */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="grid gap-6 md:grid-cols-2">
                {/* User login */}
                <InfoBlock title="USER LOGIN">
                  <form
                    className="space-y-3 mt-1"
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
                </InfoBlock>

                {/* Indexing */}
                <InfoBlock title="ABSTRACTING & INDEXING">
                  <div className="grid grid-cols-2 gap-3 mt-1">
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
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase backdrop-blur"
              style={{ color: "var(--gold)" }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Journal at a Glance
            </div>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold">
              A decade of rigorous scholarship
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-[15px] text-white/75">
              INSIGHTONIX has been advancing peer-reviewed research in commerce, management and allied
              disciplines with global visibility, ethical publishing and open access.
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
                className="rounded-xl border border-white/15 bg-black/[0.06] p-5 text-center backdrop-blur-sm transition hover:bg-black/[0.1]"
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
                INSIGHTONIX welcomes original manuscripts across commerce, management, finance and allied
                interdisciplinary domains, from empirical studies and conceptual reviews to case
                research and policy analysis.
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
                "Data Analytics",
                "Global Economics",
                "Market Trends",
                "Business Intelligence",
                "Strategic Management",
                "Consumer Insights",
                "Policy Analysis",
                "Social Studies",
                "Innovation",
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
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur"
                style={{ color: "var(--gold)" }}
              >
                <Zap className="h-3.5 w-3.5" /> Call for Papers
              </div>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-semibold leading-tight">
                Submit to the upcoming issue &mdash;{" "}
                <span style={{ color: "var(--gold)" }}>Volume 11, Issue 3</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-[15px] text-white/80">
                Original, unpublished research in global insights, analytics and multidisciplinary trends is
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
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-white/40 bg-black/5 px-5 text-sm font-semibold text-white hover:bg-black/10 transition"
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
                  className="rounded-xl border border-white/15 bg-black/[0.07] p-4 text-center backdrop-blur"
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
          <ContactItem icon={Globe2} label="WEBSITE" value="www.ijarcm.com" />
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
