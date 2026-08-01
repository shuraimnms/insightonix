import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const issuesQuery = () =>
  queryOptions({
    queryKey: ["issues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("is_published", true)
        .order("year", { ascending: false })
        .order("volume", { ascending: false })
        .order("number", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const currentIssueQuery = () =>
  queryOptions({
    queryKey: ["issues", "current"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const articlesQuery = (issueId?: string) =>
  queryOptions({
    queryKey: ["articles", { issueId: issueId ?? null }],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .order("sort_order", { ascending: true });
      if (issueId) q = q.eq("issue_id", issueId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

export const articleBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["articles", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, issues(*)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const boardQuery = () =>
  queryOptions({
    queryKey: ["board"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("board_members")
        .select("*")
        .eq("is_active", true)
        .order("role", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

export const announcementsQuery = () =>
  queryOptions({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const pageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["pages", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const conferencesQuery = () =>
  queryOptions({
    queryKey: ["conferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conferences")
        .select("*")
        .eq("is_published", true)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const ebooksQuery = () =>
  queryOptions({
    queryKey: ["ebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const settingsQuery = () =>
  queryOptions({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      const map: Record<string, unknown> = {};
      (data ?? []).forEach((row) => {
        map[row.key] = row.value;
      });
      return map;
    },
  });

export const statsQuery = () =>
  queryOptions({
    queryKey: ["stats"],
    queryFn: async () => {
      const [articles, issues, board] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("issues").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("board_members").select("*", { count: "exact", head: true }).eq("is_active", true),
      ]);
      // count distinct authors is not trivial via head; approximate with a sample select
      const { data: authorSample } = await supabase.from("articles").select("authors").eq("status", "published");
      const authorSet = new Set<string>();
      (authorSample ?? []).forEach((r) => (r.authors as string[] | null)?.forEach((a) => authorSet.add(a)));
      return {
        articles: articles.count ?? 0,
        issues: issues.count ?? 0,
        board: board.count ?? 0,
        authors: authorSet.size,
      };
    },
  });
