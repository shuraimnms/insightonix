import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { boardQuery } from "@/lib/queries";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/editorial-board")({
  head: () => ({
    meta: [
      { title: "Editorial Board — INSIGHTONIX" },
      { name: "description", content: "Editors, advisory board members, and peer reviewers of INSIGHTONIX." },
    ],
    links: [{ rel: "canonical", href: "/editorial-board" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(boardQuery()),
  component: Board,
});

const ROLE_LABEL: Record<string, string> = {
  editorial: "Editorial Board",
  advisory: "Advisory Board",
  reviewer: "Reviewer Board",
};

function Board() {
  const { data } = useSuspenseQuery(boardQuery());
  const groups = { editorial: [] as typeof data, advisory: [] as typeof data, reviewer: [] as typeof data };
  data.forEach((m) => groups[m.role as keyof typeof groups].push(m));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our people"
        title="Editorial, advisory & reviewer boards"
        intro="Researchers and practitioners who guide, review, and safeguard the scientific integrity of INSIGHTONIX."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Editorial Board" }]} />
        {(["editorial", "advisory", "reviewer"] as const).map((role) => (
          <section key={role} className="mb-14">
            <h2 className="font-serif text-2xl font-semibold">{ROLE_LABEL[role]}</h2>
            <div className="mt-2 rule-gold" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups[role].map((m) => (
                <article key={m.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand text-brand-foreground font-serif text-lg font-semibold">
                      {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="font-serif text-base font-semibold">{m.name}</div>
                      {m.title ? <div className="text-xs uppercase tracking-wider text-brand font-semibold mt-0.5">{m.title}</div> : null}
                      <div className="mt-1 text-sm text-muted-foreground">{m.affiliation}{m.country ? ` · ${m.country}` : ""}</div>
                    </div>
                  </div>
                  {m.bio ? <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.bio}</p> : null}
                  {m.email ? (
                    <a href={`mailto:${m.email}`} className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand hover:underline">
                      <Mail className="h-3 w-3" /> {m.email}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
