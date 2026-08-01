import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export type StepFlowItem = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  body?: string;
  sla?: string;
};

type Props = {
  steps: StepFlowItem[];
  /** seconds per step */
  stagger?: number;
  variant?: "compact" | "detailed";
};

/**
 * Horizontal, sequential step reveal — nodes pop in one after another,
 * connector arrows draw between them ("O →  O →  O ...").
 * Animation triggers when scrolled into view.
 */
export function StepFlow({ steps, stagger = 0.45, variant = "compact" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current || active) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [active]);

  return (
    <div ref={ref} className="relative">
      <ol className="flex flex-wrap items-start justify-center gap-y-6 md:flex-nowrap md:gap-y-0">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const nodeDelay = `${(i * stagger).toFixed(2)}s`;
          const arrowDelay = `${(i * stagger + stagger * 0.55).toFixed(2)}s`;
          const isLast = i === steps.length - 1;
          return (
            <Fragment key={s.title}>
              <li
                className={`flex ${variant === "detailed" ? "w-40" : "w-32"} flex-col items-center px-1 text-center opacity-0`}
                style={
                  active
                    ? { animation: `insightonix-step-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) ${nodeDelay} both` }
                    : undefined
                }
              >
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 bg-background shadow-elev"
                  style={{ borderColor: "var(--gold)" }}
                >
                  <Icon className="h-6 w-6" style={{ color: "var(--brand)" }} />
                  <span
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
                    style={{ background: "var(--gold)" }}
                  >
                    {i + 1}
                  </span>
                  {active && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        animation: `insightonix-step-ring 1.1s ease-out ${nodeDelay} both`,
                        boxShadow: "0 0 0 0 var(--gold)",
                      }}
                    />
                  )}
                </div>
                <div className="mt-3 text-sm font-semibold text-brand">{s.title}</div>
                {s.sla ? (
                  <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.sla}
                  </div>
                ) : null}
                {s.body ? (
                  <div className="mt-1 text-xs leading-snug text-muted-foreground">{s.body}</div>
                ) : null}
              </li>

              {!isLast && (
                <li
                  aria-hidden
                  className="mt-8 hidden shrink-0 items-center md:flex"
                  style={{ width: variant === "detailed" ? "3rem" : "2.25rem" }}
                >
                  <div className="relative h-[2px] w-full origin-left opacity-0"
                    style={
                      active
                        ? {
                            background: "var(--gold)",
                            animation: `insightonix-step-arrow 0.4s ease-out ${arrowDelay} both`,
                          }
                        : { background: "var(--gold)" }
                    }
                  >
                    <ArrowRight
                      className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: "var(--gold)" }}
                    />
                  </div>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
