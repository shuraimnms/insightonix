import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { Plus, Pencil, Trash2, X, Globe2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/super-admin/sites")({
  component: SitesPage,
});

type Site = {
  id: string;
  name: string;
  code: string;
  domain: string | null;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
};

function SitesPage() {
  const { refresh: refreshCtx, activeSiteId } = useSuperAdmin();
  const [rows, setRows] = useState<Site[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [edit, setEdit] = useState<Partial<Site> | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("created_at", { ascending: true });
    setRows((data as Site[]) ?? []);
    const { data: sp } = await supabase.from("site_papers").select("site_id");
    const c: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sp ?? []).forEach((r: any) => {
      c[r.site_id] = (c[r.site_id] ?? 0) + 1;
    });
    setCounts(c);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!edit) return;
    if (!edit.name || !edit.code) return toast.error("Name and code are required");
    const payload = {
      name: edit.name.trim(),
      code: edit.code.trim().toUpperCase(),
      domain: edit.domain?.trim() || null,
      description: edit.description?.trim() || null,
      logo_url: edit.logo_url?.trim() || null,
      is_active: edit.is_active ?? true,
    };
    const { error } = edit.id
      ? await supabase.from("sites").update(payload).eq("id", edit.id)
      : await supabase.from("sites").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEdit(null);
    await load();
    await refreshCtx();
  };

  const toggleActive = async (r: Site) => {
    const { error } = await supabase
      .from("sites")
      .update({ is_active: !r.is_active })
      .eq("id", r.id);
    if (error) return toast.error(error.message);
    await load();
    await refreshCtx();
  };

  const del = async (r: Site) => {
    if (!confirm(`Delete site "${r.code}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("sites").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Site deleted");
    await load();
    await refreshCtx();
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Multi-Journal
          </div>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-white">Sites</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage every journal website served from this platform.
          </p>
        </div>
        <button
          onClick={() => setEdit({ is_active: true })}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 text-sm font-semibold text-white shadow shadow-amber-500/20 hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Add site
        </button>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-sm">
          <thead className="bg-slate-950/60 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Papers</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 w-32"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r) => (
              <tr key={r.id} className={cn(r.id === activeSiteId ? "bg-amber-500/[0.03]" : "")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-amber-400">
                      <Globe2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{r.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{r.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{r.code}</td>
                <td className="px-4 py-3 text-slate-400">{r.domain ?? "—"}</td>
                <td className="px-4 py-3 text-slate-300">{counts[r.id] ?? 0}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(r)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      r.is_active
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-slate-800 text-slate-400",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        r.is_active ? "bg-emerald-400" : "bg-slate-500",
                      )}
                    />
                    {r.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setEdit(r)}
                      className="rounded-md p-2 text-slate-300 hover:bg-slate-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => del(r)}
                      className="rounded-md p-2 text-red-400 hover:bg-slate-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No sites yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {edit ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEdit(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-white">
                {edit.id ? "Edit site" : "New site"}
              </h2>
              <button
                onClick={() => setEdit(null)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block">
                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Name
                </div>
                <input
                  value={edit.name ?? ""}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                  className="h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Short code
                  </div>
                  <input
                    value={edit.code ?? ""}
                    onChange={(e) => setEdit({ ...edit, code: e.target.value.toUpperCase() })}
                    placeholder="INSIGHTONIX"
                    className="h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 font-mono text-sm text-white focus:border-amber-400/60 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Domain
                  </div>
                  <input
                    value={edit.domain ?? ""}
                    onChange={(e) => setEdit({ ...edit, domain: e.target.value })}
                    placeholder="example.com"
                    className="h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                  />
                </label>
              </div>
              <label className="block">
                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Description
                </div>
                <textarea
                  rows={3}
                  value={edit.description ?? ""}
                  onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                  className="w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              <label className="block">
                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Logo URL (optional)
                </div>
                <input
                  value={edit.logo_url ?? ""}
                  onChange={(e) => setEdit({ ...edit, logo_url: e.target.value })}
                  className="h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={edit.is_active ?? true}
                  onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEdit(null)}
                className="rounded-md border border-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                <Check className="h-4 w-4" /> Save site
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
