import { createFileRoute, Link, useNavigate, getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "up" ? "up" : "in",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — INSIGHTONIX" },
      {
        name: "description",
        content: "Sign in or create an author/reviewer account for INSIGHTONIX.",
      },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: Auth,
});

function Auth() {
  const { mode: searchMode } = getRouteApi("/auth").useSearch();
  const [mode, setMode] = useState<"in" | "up">(searchMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setMode(searchMode);
  }, [searchMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/dashboard", replace: true });
    });
  }, [nav]);

  const google = async () => {
    setBusy(true);
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (r.error) {
      toast.error(r.error.message ?? "Google sign-in failed.");
      setBusy(false);
    } else if (!r.redirected) {
      nav({ to: "/dashboard" });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      nav({ to: "/dashboard" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Check your inbox to confirm.");
      setMode("in");
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Account"
        title={mode === "in" ? "Sign in" : "Create an account"}
        intro="Authors, reviewers, and editors use the same login."
      />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1fr]">
        <div className="max-w-md">
          <form onSubmit={submit} className="space-y-4">
            {mode === "up" && (
              <label className="block">
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Full name
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand"
                />
              </label>
            )}
            <label className="block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </div>
              <input
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand"
              />
            </label>
            <button
              disabled={busy}
              type="submit"
              className="h-11 w-full rounded-md bg-brand text-sm font-semibold text-brand-foreground disabled:opacity-60"
            >
              {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>
          <div className="relative my-6 text-center">
            <span className="relative z-10 bg-background px-3 text-xs text-muted-foreground">
              or
            </span>
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          </div>
          <button
            onClick={google}
            disabled={busy}
            className="h-11 w-full rounded-md border border-border bg-background text-sm font-medium hover:bg-accent disabled:opacity-60"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="mt-4 block text-sm text-brand hover:underline"
          >
            {mode === "in" ? "New here? Create an account" : "Already registered? Sign in"}
          </button>
        </div>
        <aside className="rounded-xl border border-border bg-card p-6 text-sm">
          <div className="font-serif text-lg font-semibold">One account, three roles</div>
          <div className="mt-2 rule-gold" />
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">Authors</strong> submit manuscripts, track review
              status, download reviewer comments.
            </li>
            <li>
              <strong className="text-foreground">Reviewers</strong> see assigned papers, submit
              structured reviews.
            </li>
            <li>
              <strong className="text-foreground">Editors</strong> triage submissions, assign
              reviewers, publish issues.
            </li>
          </ul>
          <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            Editor access is granted by an existing super-admin.{" "}
            <Link to="/contact" className="text-brand hover:underline">
              Contact the editorial office
            </Link>{" "}
            to request it.
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
