import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  BookOpen,
  Users,
  Megaphone,
  FileEdit,
  Calendar,
  Book,
  Settings,
  UserCog,
  Mail,
  LogOut,
  ArrowLeft,
  Award,
  Megaphone as MegaphoneIcon,
  TrendingUp,
  Sparkles,
  Fingerprint,
  BarChart3,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JOURNAL } from "@/lib/journal";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const staff = !!roles?.some((r) => r.role === "super_admin" || r.role === "editor");
    if (!staff) throw redirect({ to: "/dashboard" });
    return { user };
  },
  component: AdminShell,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/articles", label: "Articles", icon: FileText },
  { to: "/admin/issues", label: "Issues", icon: BookOpen },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
  { to: "/admin/doi", label: "DOI & Crossref", icon: Fingerprint },
  { to: "/admin/board", label: "Board", icon: Users },
  { to: "/admin/team", label: "Team", icon: Sparkles },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/advertisements", label: "Advertisements", icon: MegaphoneIcon },
  { to: "/admin/impact-factor", label: "Impact Factor", icon: TrendingUp },
  { to: "/admin/pages", label: "Pages", icon: FileEdit },
  { to: "/admin/conferences", label: "Conferences", icon: Calendar },
  { to: "/admin/ebooks", label: "E-Books", icon: Book },
  { to: "/admin/users", label: "Users & Roles", icon: UserCog },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminShell() {
  const location = useLocation();
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-secondary/40 lg:flex lg:flex-col">
          <div className="border-b border-border p-5">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold">
              {JOURNAL.short} · Admin
            </div>
            <div className="mt-1 font-serif text-lg font-semibold leading-tight">
              Editorial Console
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-0.5">
              {NAV.map((n) => {
                const active = n.exact
                  ? location.pathname === n.to
                  : location.pathname.startsWith(n.to);
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-brand text-brand-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <n.icon className="h-4 w-4" />
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-border p-3 text-xs text-muted-foreground">
            <div className="truncate">{email}</div>
            <div className="mt-2 flex gap-2">
              <Link
                to="/"
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs hover:bg-accent"
              >
                <ArrowLeft className="h-3 w-3" /> Site
              </Link>
              <button
                onClick={signOut}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs hover:bg-accent"
              >
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          {/* Mobile top bar */}
          <div className="border-b border-border p-4 lg:hidden">
            <div className="font-serif text-lg font-semibold">{JOURNAL.short} Admin</div>
            <div className="mt-2 flex gap-1 overflow-x-auto">
              {NAV.map((n) => {
                const active = n.exact
                  ? location.pathname === n.to
                  : location.pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "flex-none rounded-md px-3 py-1.5 text-xs font-medium",
                      active
                        ? "bg-brand text-brand-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-6 lg:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
