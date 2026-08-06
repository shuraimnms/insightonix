import { Mail, MapPin } from "lucide-react";

export type PersonRow = {
  id: string;
  name: string;
  title: string | null;
  affiliation: string | null;
  country: string | null;
  bio: string | null;
  email: string | null;
  photo_url?: string | null;
};

export function PersonGrid({ people }: { people: PersonRow[] }) {
  if (!people.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-10 text-center text-sm text-muted-foreground">
        Members will be announced shortly.
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((m) => (
        <article
          key={m.id}
          className="group rounded-xl border border-border bg-card p-5 transition hover:border-brand/40 hover:shadow-elev"
        >
          <div className="flex items-start gap-4">
            {m.photo_url ? (
              <img
                src={m.photo_url}
                alt={m.name}
                className="h-14 w-14 flex-none rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand text-brand-foreground font-serif text-lg font-semibold">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-serif text-base font-semibold leading-tight">{m.name}</div>
              {m.title ? (
                <div className="mt-0.5 text-xs uppercase tracking-wider text-brand font-semibold">
                  {m.title}
                </div>
              ) : null}
              {m.affiliation ? (
                <div className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-3 w-3 flex-none" />
                  <span>
                    {m.affiliation}
                    {m.country ? `, ${m.country}` : ""}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {m.bio ? (
            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
              {m.bio}
            </p>
          ) : null}
          {m.email ? (
            <a
              href={`mailto:${m.email}`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand hover:underline"
            >
              <Mail className="h-3 w-3" /> {m.email}
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
