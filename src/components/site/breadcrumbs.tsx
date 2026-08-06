import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-brand">
            Home
          </Link>
        </li>
        {trail.map((t, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {t.to && i < trail.length - 1 ? (
              <Link to={t.to} className="hover:text-brand">
                {t.label}
              </Link>
            ) : (
              <span className="text-foreground">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
