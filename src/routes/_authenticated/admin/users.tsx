import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type R = { id: string; user_id: string; role: string; created_at: string };

export const Route = createFileRoute("/_authenticated/admin/users")({ component: UsersAdmin });

function UsersAdmin() {
  const [rows, setRows] = useState<R[]>([]);
  const [uid, setUid] = useState("");
  const [role, setRole] = useState<"super_admin" | "editor" | "reviewer" | "author">("editor");

  const load = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as R[]) ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const grant = async () => {
    if (!uid.trim()) return toast.error("Enter a user ID.");
    const { error } = await supabase.from("user_roles").insert({ user_id: uid.trim(), role });
    if (error) return toast.error(error.message);
    toast.success("Role granted");
    setUid("");
    load();
  };
  const revoke = async (id: string) => {
    if (!confirm("Revoke role?")) return;
    await supabase.from("user_roles").delete().eq("id", id);
    load();
  };

  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">People</div>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Users & roles</h1>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Grant editorial, reviewer, or admin roles by user ID (from Cloud → Users).
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <label className="flex-1 min-w-[280px]">
          <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
            User ID (UUID)
          </div>
          <input
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
        </label>
        <label>
          <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Role</div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option>super_admin</option>
            <option>editor</option>
            <option>reviewer</option>
            <option>author</option>
          </select>
        </label>
        <button
          onClick={grant}
          className="h-10 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground"
        >
          Grant role
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Granted</th>
              <th className="p-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-mono text-xs">{r.user_id}</td>
                <td className="p-3">{r.role}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => revoke(r.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
