import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/admin/ebooks")({
  component: () => (
    <>
      <div><div className="text-xs uppercase tracking-widest text-brand font-semibold">Content</div><h1 className="mt-1 font-serif text-3xl font-semibold">E-Books</h1></div>
      <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">CRUD editor coming next iteration — data lives in the ebooks table.</div>
    </>
  ),
});
