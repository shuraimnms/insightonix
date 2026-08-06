import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";

type Team = Database["public"]["Tables"]["team_members"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/team")({ component: TeamAdmin });

function TeamAdmin() {
  const [rows, setRows] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ name: "", role: "", department: "", email: "", bio: "" });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order")
      .order("created_at");
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!draft.name || !draft.role) return toast.error("Name and role are required");
    setBusy(true);
    const { error } = await supabase
      .from("team_members")
      .insert({ ...draft, sort_order: rows.length + 1 });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Added");
    setDraft({ name: "", role: "", department: "", email: "", bio: "" });
    load();
  };

  const update = async (id: string, patch: Partial<Team>) => {
    const { error } = await supabase.from("team_members").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl font-semibold">Editorial Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Managing editors, production, and support staff shown on the Editorial Office page.
        </p>
      </header>

      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 font-serif text-lg font-semibold">Add member</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            placeholder="Role (e.g. Managing Editor)"
            value={draft.role}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            placeholder="Department"
            value={draft.department}
            onChange={(e) => setDraft({ ...draft, department: e.target.value })}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            placeholder="Email"
            type="email"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          />
          <textarea
            placeholder="Short bio"
            rows={2}
            value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            className="md:col-span-2 rounded-md border border-border bg-background p-3 text-sm"
          />
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={create}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No members yet.</p>
      ) : (
        <div className="grid gap-3">
          {rows.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-card p-4">
              <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center">
                <input
                  defaultValue={m.name}
                  onBlur={(e) =>
                    e.target.value !== m.name && update(m.id, { name: e.target.value })
                  }
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                />
                <input
                  defaultValue={m.role}
                  onBlur={(e) =>
                    e.target.value !== m.role && update(m.id, { role: e.target.value })
                  }
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                />
                <input
                  defaultValue={m.department ?? ""}
                  onBlur={(e) => update(m.id, { department: e.target.value || null })}
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                />
                <input
                  defaultValue={m.email ?? ""}
                  type="email"
                  onBlur={(e) => update(m.id, { email: e.target.value || null })}
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => update(m.id, { is_active: !m.is_active })}
                    className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2 text-xs"
                  >
                    <Save className="h-3 w-3" /> {m.is_active ? "Active" : "Hidden"}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="inline-flex h-9 items-center rounded-md border border-destructive/40 px-2 text-xs text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
