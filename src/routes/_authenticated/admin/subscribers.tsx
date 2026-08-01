import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

type S = { id: string; email: string; subscribed_at: string };

export const Route = createFileRoute("/_authenticated/admin/subscribers")({ component: Sub });

function Sub() {
  const [rows, setRows] = useState<S[]>([]);
  useEffect(() => { supabase.from("subscribers").select("*").order("subscribed_at", { ascending: false }).then(({ data }) => setRows((data as S[]) ?? [])); }, []);

  const exportCsv = () => {
    const csv = "email,subscribed_at\n" + rows.map((r) => `${r.email},${r.subscribed_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "insightonix-subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div><div className="text-xs uppercase tracking-widest text-brand font-semibold">Marketing</div><h1 className="mt-1 font-serif text-3xl font-semibold">Newsletter subscribers</h1></div>
        <button onClick={exportCsv} disabled={rows.length === 0} className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground disabled:opacity-60"><Download className="h-4 w-4" /> Export CSV</button>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-3">Email</th><th className="p-3">Subscribed</th></tr></thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => <tr key={r.id}><td className="p-3">{r.email}</td><td className="p-3 text-muted-foreground">{new Date(r.subscribed_at).toLocaleString()}</td></tr>)}
            {rows.length === 0 && <tr><td colSpan={2} className="p-8 text-center text-muted-foreground">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
