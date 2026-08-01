-- Restrict downloads inserts to real published articles
DROP POLICY IF EXISTS downloads_anyone_insert ON public.downloads;
CREATE POLICY downloads_public_insert ON public.downloads
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.articles a WHERE a.id = article_id AND a.status = 'published')
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- Restrict visitor inserts to non-empty short paths (defensive)
DROP POLICY IF EXISTS visitors_anyone_insert ON public.visitors;
CREATE POLICY visitors_public_insert ON public.visitors
  FOR INSERT
  WITH CHECK (
    path IS NOT NULL
    AND length(path) BETWEEN 1 AND 512
    AND (user_agent IS NULL OR length(user_agent) <= 512)
  );

-- Certificate tracking generator: revoke public/authenticated EXECUTE.
-- Only service_role (server admin client) may call it.
REVOKE EXECUTE ON FUNCTION public.generate_certificate_tracking_no() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_certificate_tracking_no() FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_certificate_tracking_no() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.generate_certificate_tracking_no() TO service_role;
