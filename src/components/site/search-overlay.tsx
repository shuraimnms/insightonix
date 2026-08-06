import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Result = { slug: string; title: string; authors: string[] | null };

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      const { data } = await supabase
        .from("articles")
        .select("slug,title,authors")
        .eq("status", "published")
        .or(`title.ilike.%${q}%,abstract.ilike.%${q}%`)
        .limit(8);
      setResults((data as Result[]) ?? []);
    }, 150);
    return () => clearTimeout(t);
  }, [q, open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 p-4 pt-20"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, authors, keywords…"
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {q ? "No matches yet." : "Type to search across published articles."}
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/articles/$slug"
                    params={{ slug: r.slug }}
                    onClick={onClose}
                    className="block px-4 py-3 hover:bg-accent"
                  >
                    <div className="text-sm font-medium text-foreground">{r.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {(r.authors ?? []).join(", ")}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
