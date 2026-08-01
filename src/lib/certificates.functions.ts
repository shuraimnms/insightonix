import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const IssueInput = z.object({
  type: z.enum(["publication", "conference", "reviewer", "editor"]),
  title: z.string().min(3).max(300),
  recipient_name: z.string().min(2).max(200),
  recipient_email: z.string().email().max(200).optional().nullable(),
  recipient_affiliation: z.string().max(300).optional().nullable(),
  user_id: z.string().uuid().optional().nullable(),
  article_id: z.string().uuid().optional().nullable(),
  conference_id: z.string().uuid().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const issueCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => IssueInput.parse(raw))
  .handler(async ({ data, context }) => {
    // Staff check
    const { data: staffFlag, error: staffErr } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (staffErr) throw new Error(staffErr.message);
    if (!staffFlag) throw new Error("Forbidden: only staff can issue certificates.");

    // Publication cert requires a published article
    if (data.type === "publication") {
      if (!data.article_id) throw new Error("Publication certificates require an article_id.");
      const { data: article, error } = await context.supabase
        .from("articles")
        .select("id, status")
        .eq("id", data.article_id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!article) throw new Error("Article not found.");
      if (article.status !== "published") throw new Error("Certificate can only be issued for published articles.");
    }

    // Duplicate check per (user_id, article_id)
    if (data.user_id && data.article_id) {
      const { data: existing } = await context.supabase
        .from("certificates")
        .select("id")
        .eq("user_id", data.user_id)
        .eq("article_id", data.article_id)
        .eq("is_valid", true)
        .maybeSingle();
      if (existing) throw new Error("A valid certificate for this user/article already exists.");
    }

    // Use service role to call the tracking-number generator (revoked from anon/authenticated).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: trackingRow, error: tErr } = await supabaseAdmin.rpc("generate_certificate_tracking_no");
    if (tErr || !trackingRow) throw new Error(tErr?.message ?? "Failed to generate tracking number.");
    const tracking_no = trackingRow as unknown as string;

    const insertRow = {
      tracking_no,
      type: data.type,
      title: data.title,
      recipient_name: data.recipient_name,
      recipient_email: data.recipient_email ?? null,
      recipient_affiliation: data.recipient_affiliation ?? null,
      user_id: data.user_id ?? null,
      article_id: data.article_id ?? null,
      conference_id: data.conference_id ?? null,
      metadata: (data.metadata ?? {}) as never,
      issued_by: context.userId,
    };

    const { data: created, error: insErr } = await context.supabase
      .from("certificates")
      .insert(insertRow)
      .select("*")
      .single();
    if (insErr) throw new Error(insErr.message);
    return created;
  });

const RevokeInput = z.object({
  id: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const revokeCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => RevokeInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: staffFlag } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staffFlag) throw new Error("Forbidden.");
    const { error } = await context.supabase
      .from("certificates")
      .update({
        is_valid: false,
        revoked_at: new Date().toISOString(),
        revoked_by: context.userId,
        revoke_reason: data.reason ?? null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
