import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminProvider, useSuperAdmin } from "@/context/SuperAdminContext";
import {
  Shield,
  Search,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  Globe2,
  Users,
  UserSquare2,
  ClipboardList,
  Building2,
  Eye,
  Crown,
  FileText,
  Layers,
  BookOpen,
  Mic2,
  DollarSign,
  Award,
  Megaphone,
  BarChart3,
  TrendingUp,
  KeyRound,
  Sparkles,
  Settings,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/super-admin")({
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/super-admin/login" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some((r) => r.role === "super_admin")) {
      throw redirect({ to: "/dashboard" });
    }
    return { user };
  },
  component: () => (
    <SuperAdminProvider>
      <SuperAdminShell />
    </SuperAdminProvider>
  ),
});

const NAV = [
  { to: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/super-admin/sites", label: "Sites", icon: Globe2 },
  { to: "/super-admin/users", label: "Users", icon: Users },
  { to: "/super-admin/team-members", label: "Team Members", icon: UserSquare2 },
  { to: "/super-admin/editorial-board", label: "Editorial Board", icon: ClipboardList },
  { to: "/super-admin/advisory-board", label: "Advisory Board", icon: Building2 },
  { to: "/super-admin/reviewer-board", label: "Reviewer Board", icon: Eye },
  { to: "/super-admin/chief-patrons", label: "Chief Patrons", icon: Crown },
  { to: "/super-admin/papers", label: "Papers", icon: FileText },
  { to: "/super-admin/issues", label: "Issues & Archives", icon: Layers },
  { to: "/super-admin/ebooks", label: "E-Books", icon: BookOpen },
  { to: "/super-admin/conferences", label: "Conferences", icon: Mic2 },
  { to: "/super-admin/fees", label: "Fees & APC", icon: DollarSign },
  { to: "/super-admin/certificates", label: "Certificates", icon: Award },
  { to: "/super-admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/super-admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/super-admin/impact-factors", label: "Impact Factors", icon: TrendingUp },
  { to: "/super-admin/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/super-admin/animations", label: "Animation Settings", icon: Sparkles },
  { to: "/super-admin/settings", label: "Settings", icon: Settings },
  { to: "/super-admin/deployment", label: "Deployment", icon: Rocket },
] as const;

function SuperAdminShell() {
  const location = useLocation();
  const nav = useNavigate();
  const { sites, activeSiteId, setActiveSiteId, activeSite } = useSuperAdmin();
  const [email, setEmail] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [siteMenu, setSiteMenu] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const initials = useMemo(() => {
    const seed = email || "SA";
    return seed
      .split(/[@.\s]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]!.toUpperCase())
      .join("");
  }, [email]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/super-admin/login", replace: true });
  };

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav({ to: "/super-admin/papers", search: { q: q.trim() } as never });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileNav((v) => !v)}
            className="rounded-md p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            aria-label="Menu"
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/super-admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow shadow-amber-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white">
                SUPER ADMIN <span className="text-amber-400">PORTAL</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Multi-Journal Control
              </div>
            </div>
          </Link>

          <form onSubmit={runSearch} className="ml-auto hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search papers, users, sites…"
                className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/10"
              />
            </div>
          </form>

          {/* Site switcher */}
          <div className="relative ml-auto md:ml-0">
            <button
              onClick={() => setSiteMenu((v) => !v)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Globe2 className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Site:</span>
              <span className="font-semibold text-white">{activeSite?.code ?? "—"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {siteMenu ? (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
                <div className="border-b border-slate-800 px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500">
                  Switch site
                </div>
                <ul className="max-h-72 overflow-y-auto py-1">
                  {sites.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setActiveSiteId(s.id);
                          setSiteMenu(false);
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 px-3 py-2 text-left text-sm hover:bg-slate-800",
                          s.id === activeSiteId ? "bg-slate-800/60" : "",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 h-2 w-2 rounded-full",
                            s.is_active ? "bg-emerald-400" : "bg-slate-600",
                          )}
                        />
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-white">{s.code}</div>
                          <div className="truncate text-xs text-slate-400">{s.name}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                  {sites.length === 0 ? (
                    <li className="px-3 py-4 text-sm text-slate-400">No sites yet.</li>
                  ) : null}
                </ul>
                <div className="border-t border-slate-800 p-2">
                  <Link
                    to="/super-admin/sites"
                    onClick={() => setSiteMenu(false)}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-amber-400 hover:bg-slate-800"
                  >
                    Manage sites <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <div className="max-w-[160px] truncate text-xs font-medium text-white">
                {email || "Super Admin"}
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                SUPER_ADMIN
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-xs font-bold text-white">
              {initials || "SA"}
            </div>
            <button
              onClick={signOut}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r border-slate-800 bg-slate-900 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)]",
            mobileNav ? "block" : "hidden",
          )}
        >
          <nav className="h-full overflow-y-auto p-3">
            <ul className="space-y-0.5">
              {NAV.map((n) => {
                const active =
                  location.pathname === n.to || location.pathname.startsWith(n.to + "/");
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setMobileNav(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition",
                        active
                          ? "border-amber-500 bg-slate-800/60 text-amber-300"
                          : "border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-100",
                      )}
                    >
                      <n.icon
                        className={cn("h-4 w-4", active ? "text-amber-400" : "text-slate-500")}
                      />
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
              <div className="font-semibold text-slate-200">Editorial Console</div>
              <p className="mt-1 text-[11px] leading-relaxed">
                Prefer the classic per-journal console? Open the INSIGHTONIX editorial admin.
              </p>
              <Link
                to="/admin"
                className="mt-2 inline-flex items-center gap-1 text-amber-400 hover:underline"
              >
                Open /admin <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 bg-slate-950">
          <div className="p-5 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
