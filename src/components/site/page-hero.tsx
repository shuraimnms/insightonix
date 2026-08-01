import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-muted/40 to-transparent">
      <div className="container-page py-20 lg:py-28">
        {eyebrow ? (
          <div className="text-[13px] uppercase tracking-[0.22em] text-brand font-semibold">{eyebrow}</div>
        ) : null}
        <h1 className="mt-5 max-w-4xl font-serif text-5xl lg:text-6xl xl:text-[64px] font-semibold leading-[1.05] tracking-tight text-foreground">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-3xl text-lg lg:text-[22px] leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

