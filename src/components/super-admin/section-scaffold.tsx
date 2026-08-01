import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles, type LucideIcon } from "lucide-react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import type { ReactNode } from "react";

export function SectionScaffold(props: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  linkedAdminPath?: string;
  linkedAdminLabel?: string;
  children?: ReactNode;
}) {
  const { activeSite } = useSuperAdmin();
  const Icon = props.icon;

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400">{props.eyebrow}</div>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-white">{props.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{props.description}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400">
            Scope: <span className="font-semibold text-slate-200">{activeSite?.code ?? "—"}</span>
          </div>
        </div>
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-slate-900 text-amber-400 ring-1 ring-slate-800">
          <Icon className="h-5 w-5" />
        </div>
      </header>

      {props.linkedAdminPath ? (
        <Link
          to={props.linkedAdminPath}
          className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-500/40"
        >
          <div>
            <div className="text-sm font-semibold text-white">{props.linkedAdminLabel ?? "Open in editorial console"}</div>
            <div className="mt-0.5 text-xs text-slate-400">Full CRUD for this section lives in the classic /admin console. Opens in the same tab.</div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-500 transition group-hover:text-amber-400" />
        </Link>
      ) : null}

      {props.children ?? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="mt-3 font-serif text-lg font-semibold text-white">Coming to Super Admin</div>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
            This section is scaffolded and reachable. Cross-site global research lands here in the next pass — use the editorial console link above for now.
          </p>
        </div>
      )}
    </div>
  );
}
