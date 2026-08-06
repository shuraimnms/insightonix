import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-hero";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Manuscript — INSIGHTONIX" },
      { name: "description", content: "Submit your manuscript to INSIGHTONIX for peer review." },
    ],
    links: [{ rel: "canonical", href: "/submit" }],
  }),
  component: Submit,
});

const schema = z.object({
  title: z.string().trim().min(8).max(300),
  abstract: z.string().trim().min(100).max(3000),
  keywords: z.string().trim().min(3).max(300),
  co_authors: z.string().trim().max(500),
  plagiarism_confirmed: z.literal(true, {
    errorMap: () => ({ message: "Please confirm the plagiarism declaration." }),
  }),
});

function Submit() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [copyrightFile, setCopyrightFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [f, setF] = useState({
    title: "",
    abstract: "",
    keywords: "",
    co_authors: "",
    file_url: "",
    copyright_form_url: "",
    plagiarism_confirmed: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
  }, []);

  if (session === false) {
    return (
      <SiteLayout>
        <PageHero
          eyebrow="Sign in required"
          title="Sign in to submit"
          intro="Manuscript submission requires an author account."
        />
        <div className="container-page py-12">
          <Link
            to="/auth"
            className="inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground"
          >
            Go to sign in
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const uploadTo = async (userId: string, prefix: string, file: File) => {
    const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${prefix}-${Date.now()}-${clean}`;
    const { error } = await supabase.storage
      .from("manuscripts")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw error;
    return path;
  };

  const submit = async () => {
    const parsed = schema.safeParse(f);
    if (!parsed.success)
      return toast.error(parsed.error.errors[0]?.message ?? "Please complete the form.");
    if (!manuscriptFile && !f.file_url)
      return toast.error("Please upload your manuscript PDF (or provide a URL).");
    setBusy(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBusy(false);
        return toast.error("Session expired. Sign in again.");
      }

      let manuscriptPath = f.file_url || null;
      let copyrightPath = f.copyright_form_url || null;
      if (manuscriptFile) {
        setUploading(true);
        manuscriptPath = await uploadTo(user.id, "manuscript", manuscriptFile);
      }
      if (copyrightFile) {
        copyrightPath = await uploadTo(user.id, "copyright", copyrightFile);
      }
      setUploading(false);

      const { error } = await supabase.from("submissions").insert({
        title: f.title.trim(),
        abstract: f.abstract.trim(),
        keywords: f.keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        co_authors: f.co_authors
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        author_id: user.id,
        file_url: manuscriptPath,
        copyright_form_url: copyrightPath,
        plagiarism_confirmed: f.plagiarism_confirmed,
      });
      if (error) throw error;
      toast.success("Manuscript received. You can track its status from your dashboard.");
      nav({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      setUploading(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Manuscript"
        title="Submit your paper"
        intro="Four short steps. Estimated time: 5 minutes."
      />
      <div className="container-page py-12">
        <Breadcrumbs trail={[{ label: "Submit" }]} />

        <ol className="mb-8 flex items-center gap-3 text-xs">
          {["Metadata", "Manuscript file", "Copyright & ethics", "Review & submit"].map(
            (label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${step > i + 1 ? "bg-brand text-brand-foreground" : step === i + 1 ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"}`}
                >
                  {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={
                    step === i + 1 ? "text-foreground font-semibold" : "text-muted-foreground"
                  }
                >
                  {label}
                </span>
                {i < 3 && <span className="w-8 h-px bg-border" />}
              </li>
            ),
          )}
        </ol>

        <div className="rounded-xl border border-border bg-card p-6">
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} />
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Abstract (200–250 words)
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (f.abstract.trim().length < 50)
                        return toast.error("Paste at least 50 characters first.");
                      try {
                        const { extractManuscriptMetadata } = await import("@/lib/ai.functions");
                        toast.loading("Extracting with AI…", { id: "ai" });
                        const out = await extractManuscriptMetadata({ data: { text: f.abstract } });
                        toast.dismiss("ai");
                        setF((prev) => ({
                          ...prev,
                          title: prev.title || out.title,
                          abstract: out.abstract || prev.abstract,
                          keywords: out.keywords.join(", ") || prev.keywords,
                        }));
                        toast.success("Metadata extracted");
                      } catch (e) {
                        toast.dismiss("ai");
                        toast.error(e instanceof Error ? e.message : "Extraction failed");
                      }
                    }}
                    className="rounded-md border border-border px-2 py-0.5 text-[11px] font-semibold text-brand hover:bg-brand/10"
                  >
                    ✨ AI extract
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={f.abstract}
                  onChange={(e) => setF({ ...f, abstract: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-brand"
                />
              </div>
              <Field
                label="Keywords (comma separated)"
                value={f.keywords}
                onChange={(v) => setF({ ...f, keywords: v })}
                placeholder="e.g. ESG, cost of equity, India"
              />
              <Field
                label="Co-authors (comma separated)"
                value={f.co_authors}
                onChange={(v) => setF({ ...f, co_authors: v })}
              />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Anonymised manuscript (PDF/DOCX, max 20MB)
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setManuscriptFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-foreground hover:file:brightness-110"
                />
                {manuscriptFile ? (
                  <p className="mt-2 text-xs text-brand">
                    Selected: {manuscriptFile.name} ({(manuscriptFile.size / 1024).toFixed(1)} KB)
                  </p>
                ) : null}
              </div>
              <div className="rule-gold" />
              <Field
                label="Or paste a link instead"
                value={f.file_url}
                onChange={(v) => setF({ ...f, file_url: v })}
                placeholder="https://…/manuscript.pdf"
              />
              <p className="text-xs text-muted-foreground">
                Files are stored privately; only editors and assigned reviewers can access them.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Upload signed copyright form (optional here — required before publication)
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setCopyrightFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-foreground hover:file:brightness-110"
                />
                {copyrightFile ? (
                  <p className="mt-2 text-xs text-brand">Selected: {copyrightFile.name}</p>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                Generate the form from the{" "}
                <Link to="/copyright-form" className="text-brand hover:underline">
                  Copyright Form page
                </Link>
                .
              </p>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={f.plagiarism_confirmed}
                  onChange={(e) => setF({ ...f, plagiarism_confirmed: e.target.checked })}
                  className="mt-1"
                />
                <span>
                  I confirm the manuscript's Turnitin similarity is below 15% (excluding references
                  and quoted matter).
                </span>
              </label>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3 text-sm">
              <Row k="Title" v={f.title} />
              <Row k="Abstract" v={f.abstract} />
              <Row k="Keywords" v={f.keywords} />
              <Row k="Co-authors" v={f.co_authors} />
              <Row k="Manuscript" v={f.file_url || "—"} />
              <Row k="Copyright form" v={f.copyright_form_url || "—"} />
              <Row k="Plagiarism confirmed" v={f.plagiarism_confirmed ? "Yes" : "No"} />
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
              >
                Next
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={submit}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
              >
                {uploading ? "Uploading files…" : busy ? "Submitting…" : "Submit manuscript"}
              </button>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-border py-2">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-foreground whitespace-pre-wrap">{v}</div>
    </div>
  );
}
