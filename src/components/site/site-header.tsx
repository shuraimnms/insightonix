import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, BookOpen } from "lucide-react";
import { JOURNAL, type NavGroup } from "@/lib/journal";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./search-overlay";

// Header nav — matches the reference layout exactly.
const HEADER_NAV: NavGroup[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    items: [
      { label: "About the Journal", to: "/about" },
      { label: "Aim & Scope", to: "/aims-scope" },
      { label: "Vision & Mission", to: "/vision-mission" },
      { label: "Editorial Team", to: "/editorial-board" },
      { label: "Publication Ethics", to: "/publication-ethics" },
      { label: "Open Access Policy", to: "/open-access-policy" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  { label: "Login", to: "/auth" },
  { label: "Register", to: "/auth" },
  { label: "Search", to: "/articles" },
  { label: "Archives", to: "/archives" },
  {
    label: "Conferences",
    items: [
      { label: "Upcoming Conferences", to: "/conferences" },
      { label: "Call for Papers", to: "/conferences/call-for-papers" },
      { label: "Past Conferences", to: "/conferences/past" },
      { label: "Proceedings", to: "/conferences/proceedings" },
    ],
  },
  {
    label: "Books",
    items: [
      { label: "E-Books Library", to: "/ebooks" },
      { label: "Submit an E-Book", to: "/ebooks/submit" },
      { label: "Download E-Books", to: "/ebooks/download" },
    ],
  },
  { label: "Announcements", to: "/conferences/call-for-papers" },
  { label: "Indexing", to: "/indexing" },
];

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setDrawerOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-shadow">
        <div className="container-page flex items-center gap-3 py-3 lg:py-3.5 min-h-[64px] lg:min-h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="flex h-10 w-10 lg:h-11 lg:w-11 items-center justify-center rounded-lg text-white shadow-md"
              style={{ background: "var(--brand)" }}
            >
              <BookOpen className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.25} />
            </div>
            <div className="leading-tight">
              <div
                className="text-lg lg:text-xl font-semibold tracking-tight"
                style={{ color: "var(--gold)" }}
              >
                {JOURNAL.short}
              </div>
              <div className="hidden xl:block text-[11px] leading-tight text-muted-foreground max-w-[240px]">
                Insightonix Global Insights
                <br />
                Journal
              </div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:block min-w-0 flex-shrink">
            <ul className="flex items-center gap-1.5 xl:gap-3 2xl:gap-4">
              {HEADER_NAV.map((g) => (
                <NavItem
                  key={g.label}
                  group={g}
                  pathname={location.pathname}
                  onSearchClick={g.label === "Search" ? () => setSearchOpen(true) : undefined}
                />
              ))}
            </ul>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((o) => !o)}
          >
            {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={location.pathname}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function isGroupActive(g: NavGroup, pathname: string) {
  if (g.to === "/" && pathname === "/") return true;
  if (g.to && g.to !== "/" && pathname.startsWith(g.to)) return true;
  return g.items?.some((i) => i.to && pathname.startsWith(i.to)) ?? false;
}

function NavItem({
  group,
  pathname,
  onSearchClick,
}: {
  group: NavGroup;
  pathname: string;
  onSearchClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = isGroupActive(group, pathname);
  const label = group.label.toUpperCase();

  const baseCls = cn(
    "relative inline-flex h-10 items-center px-1 text-[11px] xl:text-[12.5px] 2xl:text-[13.5px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-75",
    active ? "text-gold" : "text-foreground/85 hover:text-gold",
  );

  const underline = (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-1.5 -bottom-[1px] h-[3px] rounded-full transition-opacity duration-75",
        active ? "opacity-100" : "opacity-0",
      )}
      style={{ background: "var(--gold)" }}
    />
  );

  if (onSearchClick) {
    return (
      <li>
        <button
          type="button"
          onClick={onSearchClick}
          className={baseCls}
          style={active ? { color: "var(--gold)" } : undefined}
        >
          {label}
          {underline}
        </button>
      </li>
    );
  }

  if (!group.items) {
    return (
      <li>
        <Link
          to={group.to!}
          className={baseCls}
          style={active ? { color: "var(--gold)" } : undefined}
          aria-current={pathname === group.to ? "page" : undefined}
        >
          {label}
          {underline}
        </Link>
      </li>
    );
  }

  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(baseCls, "gap-1")}
        style={active ? { color: "var(--gold)" } : undefined}
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        {underline}
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1">
          <div className="w-[260px] rounded-md border border-border bg-popover p-1.5 shadow-elev">
            {group.items.map((i) => (
              <Link
                key={i.label}
                to={i.to!}
                className={cn(
                  "block rounded px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-brand transition-colors duration-75",
                  pathname === i.to && "bg-accent/60 text-brand",
                )}
              >
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </li>
  );
}

function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-foreground/40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "lg:hidden fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="text-lg font-semibold tracking-tight" style={{ color: "var(--gold)" }}>
            {JOURNAL.short}
          </span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Prominent auth CTAs */}
          <div className="mb-5 rounded-xl border border-border bg-gradient-to-br from-accent/40 to-background p-4 shadow-sm">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/auth"
                search={{ mode: "in" }}
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background text-sm font-semibold text-foreground shadow-sm transition-all hover:border-brand hover:text-brand active:scale-[0.98]"
              >
                Login
              </Link>
              <Link
                to="/auth"
                search={{ mode: "up" }}
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-md text-sm font-semibold text-white shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
                style={{ background: "var(--brand)" }}
              >
                Register
              </Link>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Authors, reviewers & editors — one account.
            </div>
          </div>

          <ul className="space-y-1">
            {HEADER_NAV.filter((g) => g.label !== "Login" && g.label !== "Register").map((g) =>
              g.items ? (
                <li key={g.label}>
                  <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-md px-3 py-3 text-sm font-bold uppercase hover:bg-accent",
                        isGroupActive(g, pathname) && "text-gold",
                      )}
                    >
                      {g.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mt-1 space-y-0.5 pl-2">
                      {g.items.map((i) => (
                        <li key={i.label}>
                          <Link
                            to={i.to!}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm hover:bg-accent",
                              pathname === i.to && "text-brand bg-accent/60",
                            )}
                          >
                            {i.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={g.label}>
                  <Link
                    to={g.to!}
                    className={cn(
                      "block rounded-md px-3 py-3 text-sm font-bold uppercase hover:bg-accent",
                      pathname === g.to && "text-gold",
                    )}
                  >
                    {g.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}
