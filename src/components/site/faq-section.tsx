import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FAQ = { q: string; a: string };

export function FAQSection({ title = "Frequently asked questions", items }: { title?: string; items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="rounded-2xl border border-border bg-card p-6 lg:p-10">
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
      <div className="mt-2 rule-gold" />
      <dl className="mt-6 divide-y divide-border">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.q} className="py-3">
              <dt>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-2 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base font-semibold text-foreground">{it.q}</span>
                  <ChevronDown className={cn("h-4 w-4 flex-none text-muted-foreground transition-transform", isOpen && "rotate-180 text-brand")} />
                </button>
              </dt>
              {isOpen ? (
                <dd className="mt-1 pb-3 text-sm leading-relaxed text-muted-foreground">{it.a}</dd>
              ) : null}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
