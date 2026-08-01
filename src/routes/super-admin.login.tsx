import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin/login")({
  head: () => ({
    meta: [
      { title: "Super Admin Portal — INSIGHTONIX" },
      { name: "description", content: "Centralized journal global research system. Authorized administrators only." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuperAdminLogin,
});

function SuperAdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already a super admin, jump straight in.
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (roles?.some((r) => r.role === "super_admin")) {
        nav({ to: "/super-admin/dashboard", replace: true });
      }
    })();
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { data, error: signErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signErr || !data.user) throw new Error(signErr?.message ?? "Sign-in failed");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if (!roles?.some((r) => r.role === "super_admin")) {
        await supabase.auth.signOut();
        throw new Error("This portal is restricted to Super Admins.");
      }
      toast.success("Welcome, Super Admin");
      nav({ to: "/super-admin/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, rgba(245,158,11,0.15), transparent 60%), radial-gradient(900px 500px at 80% 110%, rgba(217,119,6,0.10), transparent 60%), #0a0f1e",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <Link
        to="/"
        className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur hover:bg-white/10"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to site
      </Link>

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/30">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">Super Admin Portal</div>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-white">Centralized Journal Global Research</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage every journal from one console.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">Email</div>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              placeholder="admin@insightonix.com"
            />
          </label>
          <label className="block">
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">Password</div>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/50 px-3 pr-11 text-sm text-white placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            {busy ? "Signing in…" : "Login as Super Admin"}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            This portal is for authorized administrators only. All access is logged.
          </p>
        </form>
      </div>
    </div>
  );
}
