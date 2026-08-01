import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  issue_id: z.string().uuid(),
  pages_per_article: z.number().int().min(1).max(200).default(12),
  start_page: z.number().int().min(1).default(1),
});

/** Auto-assign sequential page ranges & sort order to all articles in an issue. */
export const autoPaginateIssue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => Input.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Forbidden.");

    const { data: articles, error } = await context.supabase
      .from("articles")
      .select("id, sort_order, created_at")
      .eq("issue_id", data.issue_id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    if (!articles?.length) return { updated: 0 };

    let cursor = data.start_page;
    let idx = 1;
    for (const a of articles) {
      const start = cursor;
      const end = cursor + data.pages_per_article - 1;
      const { error: uErr } = await context.supabase
        .from("articles")
        .update({ page_start: start, page_end: end, sort_order: idx })
        .eq("id", a.id);
      if (uErr) throw new Error(uErr.message);
      cursor = end + 1;
      idx += 1;
    }
    return { updated: articles.length, last_page: cursor - 1 };
  });
