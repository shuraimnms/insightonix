import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/admin/conferences")({
  component: () => (
    <Placeholder
      title="Conferences"
      hint="CRUD editor coming next iteration — data lives in the conferences table."
    />
  ),
});

function Placeholder({ title, hint }: { title: string; hint: string }) {
  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">Content</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold">{title}</h1>
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
        {hint}
      </div>
    </>
  );
}
