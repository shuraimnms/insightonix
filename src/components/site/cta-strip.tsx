import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type Action = { label: string; to: LinkProps["to"]; primary?: boolean };

export function CtaStrip({
  eyebrow,
  title,
  intro,
  actions,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  actions: Action[];
}) {
  return (
    <section className="mt-16 overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-muted/60 via-background to-background p-8 lg:p-12">
      {eyebrow ? (
        <div className="text-xs uppercase tracking-[0.2em] text-brand font-semibold">{eyebrow}</div>
      ) : null}
      <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight lg:text-4xl">{title}</h2>
      {intro ? <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        {actions.map((a) => (
          <Link
            key={a.to as string}
            to={a.to}
            className={
              a.primary
                ? "inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-elev hover:brightness-110"
                : "inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-semibold hover:bg-accent"
            }
          >
            {a.label} <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </section>
  );
}
