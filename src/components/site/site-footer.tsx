import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { JOURNAL } from "@/lib/journal";
import { supabase } from "@/integrations/supabase/client";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("subscribers").insert({ email: email.trim() });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "You're already subscribed." : "Could not subscribe. Check your email.");
    } else {
      toast.success("Subscribed. Thank you!");
      setEmail("");
    }
  };

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="font-serif text-xl font-semibold">{JOURNAL.short}</div>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{JOURNAL.tagline}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            ISSN (Online) {JOURNAL.issn_online} · ISSN (Print) {JOURNAL.issn_print} · {JOURNAL.license}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{JOURNAL.address}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Journal</div>
            <ul className="mt-3 space-y-2">
              <li><Link to="/about" className="hover:text-brand">About</Link></li>
              <li><Link to="/aims-scope" className="hover:text-brand">Aims & Scope</Link></li>
              <li><Link to="/editorial-board" className="hover:text-brand">Editorial Board</Link></li>
              <li><Link to="/archives" className="hover:text-brand">Archives</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Authors</div>
            <ul className="mt-3 space-y-2">
              <li><Link to="/submission-guidelines" className="hover:text-brand">Submission</Link></li>
              <li><Link to="/author-guidelines" className="hover:text-brand">Guidelines</Link></li>
              <li><Link to="/publication-ethics" className="hover:text-brand">Ethics</Link></li>
              <li><Link to="/apc" className="hover:text-brand">APC</Link></li>
            </ul>
          </div>
        </nav>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Stay updated</div>
          <p className="mt-3 text-sm text-muted-foreground">Get new-issue alerts and calls for papers.</p>
          <form onSubmit={subscribe} className="mt-3 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={busy}
              className="h-10 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground disabled:opacity-60"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {JOURNAL.name}. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-brand">Privacy</Link>
            <Link to="/terms" className="hover:text-brand">Terms</Link>
            <Link to="/contact" className="hover:text-brand">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
