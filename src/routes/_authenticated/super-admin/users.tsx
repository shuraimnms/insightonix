import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionScaffold } from "@/components/super-admin/section-scaffold";
import { Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/users")({ component: UsersPage });

function UsersPage() {
  const [rows, setRows] = useState<
    Array<{ id: string; full_name: string | null; affiliation: string | null; created_at: string }>
  >([]);
  useEffect(() => {
    supabase
      .from("profiles")
      .select("id,full_name,affiliation,created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setRows((data as any) ?? []);
      });
  }, []);
  return (
    <SectionScaffold
      eyebrow="People"
      title="Users"
      description="All registered users across the platform. Role global research lives in the editorial console."
      icon={Users}
      linkedAdminPath="/admin/users"
      linkedAdminLabel="Assign roles in /admin/users"
    >
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-sm">
          <thead className="bg-slate-950/60 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Affiliation</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r) => (
              <tr key={r.id} className="text-slate-300">
                <td className="px-4 py-3 font-medium text-white">{r.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-400">{r.affiliation ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No users yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </SectionScaffold>
  );
}
