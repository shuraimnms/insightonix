import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { useState } from "react";
import { Download, Signature } from "lucide-react";

export const Route = createFileRoute("/copyright-form")({
  head: () => ({
    meta: [{ title: "Copyright Form — INSIGHTONIX" }, { name: "description", content: "Fillable Copyright Assignment Form for INSIGHTONIX manuscripts." }],
    links: [{ rel: "canonical", href: "/copyright-form" }],
  }),
  component: CopyrightForm,
});

function CopyrightForm() {
  const [state, setState] = useState({
    authorName: "",
    manuscriptTitle: "",
    date: new Date().toISOString().slice(0, 10),
    coAuthors: "",
    signature: "",
    agreeOriginal: false,
    agreeExclusive: false,
    agreeConflicts: false,
  });
  const set = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) => setState((s) => ({ ...s, [k]: v }));

  const generatePDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>INSIGHTONIX Copyright Form — ${state.manuscriptTitle}</title>
<style>body{font-family:Georgia,serif;padding:60px;color:#111;line-height:1.6;max-width:720px;margin:auto}h1{font-size:22px}h2{font-size:15px;margin-top:32px}.field{margin-top:10px}.label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#555}.val{border-bottom:1px solid #999;padding:4px 0;min-height:22px}.sig{font-family:'Segoe Script','Brush Script MT',cursive;font-size:28px;color:#0a3;border-bottom:1px solid #999;padding:8px 0}</style>
</head><body>
<h1>INSIGHTONIX: International Journal of Multidisciplinary and Global Research</h1>
<div>Copyright Assignment & Author Declaration Form</div>
<h2>Manuscript</h2>
<div class="field"><div class="label">Title</div><div class="val">${escapeHtml(state.manuscriptTitle)}</div></div>
<div class="field"><div class="label">Corresponding Author</div><div class="val">${escapeHtml(state.authorName)}</div></div>
<div class="field"><div class="label">Co-authors</div><div class="val">${escapeHtml(state.coAuthors)}</div></div>
<h2>Declarations</h2>
<ul>
<li>${state.agreeOriginal ? "☒" : "☐"} The manuscript is original and has not been published elsewhere.</li>
<li>${state.agreeExclusive ? "☒" : "☐"} All named authors have contributed to the work and approved the final version.</li>
<li>${state.agreeConflicts ? "☒" : "☐"} All conflicts of interest are disclosed in the manuscript.</li>
</ul>
<p>The undersigned assigns to INSIGHTONIX first-publication rights and the non-exclusive right to distribute the article under CC BY-NC 4.0, while retaining copyright.</p>
<h2>Signature</h2>
<div class="sig">${escapeHtml(state.signature)}</div>
<div class="field" style="margin-top:24px"><div class="label">Date</div><div class="val">${state.date}</div></div>
<script>window.print()</script>
</body></html>`);
    w.document.close();
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="For authors"
        title="Copyright Assignment Form"
        intro="Complete the form below, review it, then generate and download a signed PDF to upload with your submission."
      />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Breadcrumbs trail={[{ label: "Copyright Form" }]} />
          <div className="space-y-4">
            <label className="block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Manuscript title</div>
              <input value={state.manuscriptTitle} onChange={(e) => set("manuscriptTitle", e.target.value)} className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand" />
            </label>
            <label className="block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Corresponding author name</div>
              <input value={state.authorName} onChange={(e) => set("authorName", e.target.value)} className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand" />
            </label>
            <label className="block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Co-authors (comma separated)</div>
              <input value={state.coAuthors} onChange={(e) => set("coAuthors", e.target.value)} className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand" />
            </label>

            <fieldset className="space-y-2 rounded-md border border-border bg-card p-4">
              <legend className="px-1 text-xs uppercase tracking-wider text-muted-foreground">Declarations</legend>
              {([
                ["agreeOriginal", "The manuscript is original and has not been published elsewhere."],
                ["agreeExclusive", "All named authors have contributed to the work and approved the final version."],
                ["agreeConflicts", "All conflicts of interest are disclosed in the manuscript."],
              ] as const).map(([k, l]) => (
                <label key={k} className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={state[k]} onChange={(e) => set(k, e.target.checked)} className="mt-1" />
                  <span>{l}</span>
                </label>
              ))}
            </fieldset>

            <label className="block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Signature (type full name)</div>
              <input value={state.signature} onChange={(e) => set("signature", e.target.value)} placeholder="Your full legal name" className="h-14 w-full rounded-md border border-border bg-background px-3 font-[cursive] text-xl outline-none focus:border-brand" />
            </label>
            <label className="block">
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Date</div>
              <input type="date" value={state.date} onChange={(e) => set("date", e.target.value)} className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand" />
            </label>

            <button onClick={generatePDF} className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground">
              <Download className="h-4 w-4" /> Generate & download signed form
            </button>
          </div>
        </div>
        <aside className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground font-serif text-lg font-semibold"><Signature className="h-5 w-5 text-brand" /> How it works</div>
          <div className="mt-2 rule-gold" />
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>Fill each field above.</li>
            <li>Click generate — a print-ready PDF opens.</li>
            <li>Save it (Print → Save as PDF) and upload it with your submission.</li>
          </ol>
        </aside>
      </div>
    </SiteLayout>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
}
