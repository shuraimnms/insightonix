import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  text: z.string().min(50).max(50000),
});

type Extracted = {
  title: string;
  abstract: string;
  keywords: string[];
  suggested_reviewers: string[];
};

/** Uses Lovable AI Gateway (Gemini 2.5 Flash, free tier) to extract manuscript metadata. */
export const extractManuscriptMetadata = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => Input.parse(raw))
  .handler(async ({ data }): Promise<Extracted> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You extract academic manuscript metadata. Reply ONLY with JSON: {title, abstract, keywords[], suggested_reviewers[]}. Keywords 4-8 lowercased. suggested_reviewers is 3 plausible research areas (not real people).",
          },
          { role: "user", content: data.text.slice(0, 40000) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("AI rate limit — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Lovable settings.");
    if (!res.ok) throw new Error(`AI error: ${res.status}`);

    const json = await res.json();
    const raw = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Partial<Extracted> = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }
    return {
      title: parsed.title ?? "",
      abstract: parsed.abstract ?? "",
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 8) : [],
      suggested_reviewers: Array.isArray(parsed.suggested_reviewers) ? parsed.suggested_reviewers.slice(0, 5) : [],
    };
  });
