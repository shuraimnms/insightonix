
-- SITES
CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  domain text,
  description text,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sites TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sites TO authenticated;
GRANT ALL ON public.sites TO service_role;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sites_public_read_active" ON public.sites FOR SELECT USING (is_active OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "sites_super_admin_write" ON public.sites FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE TRIGGER trg_sites_updated BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SITE_PAPERS junction
CREATE TABLE public.site_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_id, article_id)
);
GRANT SELECT ON public.site_papers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_papers TO authenticated;
GRANT ALL ON public.site_papers TO service_role;
ALTER TABLE public.site_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_papers_public_read" ON public.site_papers FOR SELECT USING (true);
CREATE POLICY "site_papers_staff_write" ON public.site_papers FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- SITE_STATS
CREATE TABLE public.site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT (now()::date),
  page_views int NOT NULL DEFAULT 0,
  unique_visitors int NOT NULL DEFAULT 0,
  downloads int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_stats TO authenticated;
GRANT ALL ON public.site_stats TO service_role;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_stats_staff_read" ON public.site_stats FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "site_stats_super_admin_write" ON public.site_stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- SEED IJARCM + backfill all existing articles into it
INSERT INTO public.sites (name, code, domain, description, is_active)
VALUES (
  'International Journal of Academic Research in Commerce & Management',
  'IJARCM',
  'ijarcm.com',
  'Peer-reviewed open-access journal in commerce, management, finance, marketing, and enterprise development.',
  true
) ON CONFLICT (code) DO NOTHING;

INSERT INTO public.site_papers (site_id, article_id)
SELECT (SELECT id FROM public.sites WHERE code = 'IJARCM'), a.id
FROM public.articles a
ON CONFLICT DO NOTHING;

-- Seed 30 days of light demo stats for IJARCM so the analytics tiles aren't empty
INSERT INTO public.site_stats (site_id, date, page_views, unique_visitors, downloads)
SELECT
  (SELECT id FROM public.sites WHERE code = 'IJARCM'),
  (now()::date - (g || ' days')::interval)::date,
  (200 + floor(random() * 400))::int,
  (80 + floor(random() * 160))::int,
  (10 + floor(random() * 40))::int
FROM generate_series(0, 29) g;
