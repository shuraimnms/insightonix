import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DOI_PREFIX = "10.XXXXX"; // INSIGHTONIX placeholder Crossref prefix

const RegisterInput = z.object({
  article_id: z.string().uuid(),
  doi: z.string().trim().max(200).optional().nullable(),
});

/**
 * Mint/register a DOI for an article. If no DOI is provided, one is generated
 * from the article slug. Also creates a Crossref submission tracking row.
 */
export const registerArticleDoi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => RegisterInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Forbidden: only staff can register DOIs.");

    const { data: article, error: aErr } = await context.supabase
      .from("articles")
      .select("id, slug, status, doi")
      .eq("id", data.article_id)
      .maybeSingle();
    if (aErr) throw new Error(aErr.message);
    if (!article) throw new Error("Article not found.");
    if (article.status !== "published") throw new Error("Only published articles can receive a DOI.");

    const doi = (data.doi?.trim() || article.doi || `${DOI_PREFIX}/insightonix.${article.slug}`).toLowerCase();
    const doi_url = `https://doi.org/${doi}`;
    const now = new Date().toISOString();

    const { error: uErr } = await context.supabase
      .from("articles")
      .update({
        doi,
        doi_url,
        doi_status: "registered",
        doi_registered_at: now,
        doi_metadata: { registrar: "manual", registered_by: context.userId } as never,
      })
      .eq("id", article.id);
    if (uErr) throw new Error(uErr.message);

    const { data: submission, error: sErr } = await context.supabase
      .from("crossref_submissions")
      .insert({
        article_id: article.id,
        doi,
        status: "accepted",
        deposit_id: `manual-${Date.now()}`,
        submitted_at: now,
        submitted_by: context.userId,
        response: { note: "Manually registered via admin console" } as never,
      })
      .select("*")
      .single();
    if (sErr) throw new Error(sErr.message);

    return { doi, doi_url, submission };
  });

const StatusInput = z.object({
  article_id: z.string().uuid(),
  status: z.enum(["none", "pending", "registered", "failed"]),
});

export const updateDoiStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => StatusInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Forbidden.");
    const { error } = await context.supabase
      .from("articles")
      .update({ doi_status: data.status })
      .eq("id", data.article_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
