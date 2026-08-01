-- ============ CERTIFICATES ============
CREATE TYPE public.certificate_type AS ENUM ('publication', 'conference', 'reviewer', 'editor');

CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_no TEXT NOT NULL UNIQUE,
  type public.certificate_type NOT NULL,
  title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_affiliation TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  conference_id UUID REFERENCES public.conferences(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  revoke_reason TEXT,
  issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX certificates_user_idx ON public.certificates(user_id);
CREATE INDEX certificates_article_idx ON public.certificates(article_id);
GRANT SELECT ON public.certificates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY certificates_public_read ON public.certificates FOR SELECT USING (true);
CREATE POLICY certificates_staff_all ON public.certificates FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_certificates_updated BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate unique tracking numbers: IJARCM-YYYY-####
CREATE OR REPLACE FUNCTION public.generate_certificate_tracking_no()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  candidate TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    candidate := 'IJARCM-' || to_char(now(), 'YYYY') || '-' || lpad((floor(random()*9000)+1000)::int::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.certificates WHERE tracking_no = candidate);
    attempts := attempts + 1;
    IF attempts > 20 THEN RAISE EXCEPTION 'Could not generate unique certificate tracking number'; END IF;
  END LOOP;
  RETURN candidate;
END; $$;

-- ============ ADVERTISEMENTS ============
CREATE TABLE public.advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  link_url TEXT,
  placement TEXT NOT NULL DEFAULT 'sidebar',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.advertisements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.advertisements TO authenticated;
GRANT ALL ON public.advertisements TO service_role;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
CREATE POLICY ads_public_read ON public.advertisements FOR SELECT USING (
  is_active = true
  AND (starts_at IS NULL OR starts_at <= now())
  AND (ends_at IS NULL OR ends_at > now())
);
CREATE POLICY ads_staff_all ON public.advertisements FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_ads_updated BEFORE UPDATE ON public.advertisements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ IMPACT FACTORS ============
CREATE TABLE public.impact_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL UNIQUE,
  impact_factor NUMERIC(6,3) NOT NULL,
  citations INT NOT NULL DEFAULT 0,
  publications INT NOT NULL DEFAULT 0,
  h_index INT,
  source TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.impact_factors TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.impact_factors TO authenticated;
GRANT ALL ON public.impact_factors TO service_role;
ALTER TABLE public.impact_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY impact_public_read ON public.impact_factors FOR SELECT USING (is_published = true);
CREATE POLICY impact_staff_all ON public.impact_factors FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_impact_updated BEFORE UPDATE ON public.impact_factors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TEAM MEMBERS (operations / editorial office) ============
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  bio TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY team_public_read ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY team_staff_all ON public.team_members FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_team_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CHIEF PATRONS ============
CREATE TABLE public.chief_patrons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  affiliation TEXT,
  country TEXT,
  photo_url TEXT,
  bio TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.chief_patrons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.chief_patrons TO authenticated;
GRANT ALL ON public.chief_patrons TO service_role;
ALTER TABLE public.chief_patrons ENABLE ROW LEVEL SECURITY;
CREATE POLICY patrons_public_read ON public.chief_patrons FOR SELECT USING (is_active = true);
CREATE POLICY patrons_staff_all ON public.chief_patrons FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_patrons_updated BEFORE UPDATE ON public.chief_patrons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ARTICLE ENGAGEMENT: downloads, bookmarks, citations ============
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX downloads_article_idx ON public.downloads(article_id);
GRANT SELECT, INSERT ON public.downloads TO anon, authenticated;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY downloads_anyone_insert ON public.downloads FOR INSERT WITH CHECK (true);
CREATE POLICY downloads_staff_read ON public.downloads FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, article_id)
);
GRANT SELECT, INSERT, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookmarks_own_all ON public.bookmarks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  cited_by_title TEXT NOT NULL,
  cited_by_authors TEXT[] NOT NULL DEFAULT '{}',
  cited_by_source TEXT,
  cited_by_year INT,
  cited_by_doi TEXT,
  cited_by_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX citations_article_idx ON public.citations(article_id);
GRANT SELECT ON public.citations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.citations TO authenticated;
GRANT ALL ON public.citations TO service_role;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
CREATE POLICY citations_public_read ON public.citations FOR SELECT USING (verified = true);
CREATE POLICY citations_staff_all ON public.citations FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_citations_updated BEFORE UPDATE ON public.citations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ VISITORS (aggregate analytics) ============
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX visitors_path_idx ON public.visitors(path);
CREATE INDEX visitors_created_idx ON public.visitors(created_at);
GRANT SELECT, INSERT ON public.visitors TO anon, authenticated;
GRANT ALL ON public.visitors TO service_role;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY visitors_anyone_insert ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY visitors_staff_read ON public.visitors FOR SELECT TO authenticated USING (is_staff(auth.uid()));

-- ============ API KEYS (staff-managed integration secrets metadata) ============
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  provider TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY api_keys_staff_all ON public.api_keys FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER trg_api_keys_updated BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a bit of demo content so admin lists are not empty
INSERT INTO public.impact_factors (year, impact_factor, citations, publications, h_index, source) VALUES
  (2023, 2.415, 312, 48, 9,  'Google Scholar'),
  (2024, 2.812, 401, 56, 11, 'Google Scholar'),
  (2025, 3.147, 528, 62, 13, 'Google Scholar')
ON CONFLICT (year) DO NOTHING;

INSERT INTO public.chief_patrons (name, title, affiliation, country, sort_order, bio) VALUES
  ('Prof. Emeritus R. Narayanan', 'Chief Patron', 'Indian Institute of Management, Ahmedabad', 'India', 1, 'Distinguished scholar of corporate finance with over 45 years of academic leadership.'),
  ('Prof. Dame Elizabeth Whitfield', 'International Patron', 'Oxford Saïd Business School', 'United Kingdom', 2, 'Leading voice in international corporate governance and responsible enterprise research.')
ON CONFLICT DO NOTHING;

INSERT INTO public.team_members (name, role, department, email, sort_order, bio) VALUES
  ('Ritika Sharma', 'Managing Editor', 'Editorial Office', 'managing@ijarcm.org', 1, 'Coordinates the peer review pipeline and issue production schedule.'),
  ('Arjun Verma', 'Production Editor', 'Production', 'production@ijarcm.org', 2, 'Owns copy-editing, typesetting, and DOI registration for accepted papers.'),
  ('Sana Iqbal', 'Reviewer Coordinator', 'Peer Review', 'reviewers@ijarcm.org', 3, 'Matches submissions with subject-matter reviewers and monitors review timelines.')
ON CONFLICT DO NOTHING;

INSERT INTO public.advertisements (title, body, placement, sort_order, image_url, link_url) VALUES
  ('Special Issue: Sustainable Finance', 'Submissions open through Q1. Guest edited by an international panel.', 'homepage', 1, NULL, '/special-issues'),
  ('Reviewer applications open', 'Join our international reviewer community. Apply in under five minutes.', 'sidebar', 2, NULL, '/join-reviewer')
ON CONFLICT DO NOTHING;
