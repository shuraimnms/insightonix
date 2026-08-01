
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('super_admin','editor','reviewer','author');
CREATE TYPE public.article_status AS ENUM ('draft','published','archived');
CREATE TYPE public.submission_status AS ENUM ('submitted','under_review','revision_requested','accepted','rejected','published','withdrawn');
CREATE TYPE public.review_recommendation AS ENUM ('accept','minor_revision','major_revision','reject');
CREATE TYPE public.board_role AS ENUM ('editorial','advisory','reviewer');

-- =========================================================
-- SHARED
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  affiliation TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_upsert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  -- Every new user is at minimum an author
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'author') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

-- =========================================================
-- USER ROLES
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','editor'));
$$;

-- Now create the trigger that uses user_roles
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "user_roles_staff_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- ISSUES
-- =========================================================
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volume INT NOT NULL,
  number INT NOT NULL,
  year INT NOT NULL,
  title TEXT,
  cover_url TEXT,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (volume, number, year)
);
GRANT SELECT ON public.issues TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "issues_public_read" ON public.issues FOR SELECT USING (is_published = true);
CREATE POLICY "issues_staff_read" ON public.issues FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "issues_staff_write" ON public.issues FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER issues_updated BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- ARTICLES
-- =========================================================
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT,
  authors TEXT[] NOT NULL DEFAULT '{}',
  affiliations TEXT[] NOT NULL DEFAULT '{}',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  doi TEXT,
  pdf_url TEXT,
  status public.article_status NOT NULL DEFAULT 'draft',
  issue_id UUID REFERENCES public.issues(id) ON DELETE SET NULL,
  page_start INT,
  page_end INT,
  sort_order INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  citation_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  download_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX articles_issue_idx ON public.articles(issue_id);
CREATE INDEX articles_status_idx ON public.articles(status);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT USING (status = 'published');
CREATE POLICY "articles_staff_read" ON public.articles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "articles_staff_write" ON public.articles FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER articles_updated BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- BOARD MEMBERS
-- =========================================================
CREATE TABLE public.board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role public.board_role NOT NULL,
  title TEXT,
  affiliation TEXT,
  country TEXT,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.board_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.board_members TO authenticated;
GRANT ALL ON public.board_members TO service_role;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "board_public_read" ON public.board_members FOR SELECT USING (is_active = true);
CREATE POLICY "board_staff_all" ON public.board_members FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER board_updated BEFORE UPDATE ON public.board_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- ANNOUNCEMENTS
-- =========================================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_public_read" ON public.announcements FOR SELECT USING (is_published = true);
CREATE POLICY "announcements_staff_all" ON public.announcements FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER announcements_updated BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- PAGES (editable static content)
-- =========================================================
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (true);
CREATE POLICY "pages_staff_all" ON public.pages FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER pages_updated BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- CONFERENCES
-- =========================================================
CREATE TABLE public.conferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  url TEXT,
  cover_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.conferences TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.conferences TO authenticated;
GRANT ALL ON public.conferences TO service_role;
ALTER TABLE public.conferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conferences_public_read" ON public.conferences FOR SELECT USING (is_published = true);
CREATE POLICY "conferences_staff_all" ON public.conferences FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER conferences_updated BEFORE UPDATE ON public.conferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- EBOOKS
-- =========================================================
CREATE TABLE public.ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  cover_url TEXT,
  download_url TEXT,
  isbn TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ebooks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ebooks TO authenticated;
GRANT ALL ON public.ebooks TO service_role;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ebooks_public_read" ON public.ebooks FOR SELECT USING (is_published = true);
CREATE POLICY "ebooks_staff_all" ON public.ebooks FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER ebooks_updated BEFORE UPDATE ON public.ebooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- SUBMISSIONS
-- =========================================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  co_authors TEXT[] NOT NULL DEFAULT '{}',
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT,
  copyright_form_url TEXT,
  plagiarism_confirmed BOOLEAN NOT NULL DEFAULT false,
  status public.submission_status NOT NULL DEFAULT 'submitted',
  editor_notes TEXT,
  plagiarism_score NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX submissions_author_idx ON public.submissions(author_id);
CREATE INDEX submissions_status_idx ON public.submissions(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_author_read" ON public.submissions FOR SELECT TO authenticated USING (author_id = auth.uid());
CREATE POLICY "submissions_author_insert" ON public.submissions FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "submissions_author_update" ON public.submissions FOR UPDATE TO authenticated USING (author_id = auth.uid() AND status = 'submitted');
CREATE POLICY "submissions_staff_read" ON public.submissions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "submissions_staff_update" ON public.submissions FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER submissions_updated BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- SUBMISSION REVIEWERS (assignment)
-- =========================================================
CREATE TABLE public.submission_reviewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (submission_id, reviewer_id)
);
GRANT SELECT, INSERT, DELETE ON public.submission_reviewers TO authenticated;
GRANT ALL ON public.submission_reviewers TO service_role;
ALTER TABLE public.submission_reviewers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sub_rev_reviewer_read" ON public.submission_reviewers FOR SELECT TO authenticated USING (reviewer_id = auth.uid());
CREATE POLICY "sub_rev_staff_all" ON public.submission_reviewers FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Extra submissions policy allowing reviewers to read their assigned submissions
CREATE POLICY "submissions_reviewer_read" ON public.submissions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.submission_reviewers sr WHERE sr.submission_id = submissions.id AND sr.reviewer_id = auth.uid())
);

-- =========================================================
-- REVIEWS
-- =========================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation public.review_recommendation NOT NULL,
  comments_to_editor TEXT,
  comments_to_author TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (submission_id, reviewer_id)
);
GRANT SELECT, INSERT, UPDATE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_reviewer_all" ON public.reviews FOR ALL TO authenticated USING (reviewer_id = auth.uid()) WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "reviews_staff_read" ON public.reviews FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- =========================================================
-- DECISION HISTORY
-- =========================================================
CREATE TABLE public.decision_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  from_status public.submission_status,
  to_status public.submission_status NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.decision_history TO authenticated;
GRANT ALL ON public.decision_history TO service_role;
ALTER TABLE public.decision_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dh_owner_read" ON public.decision_history FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = decision_history.submission_id AND s.author_id = auth.uid())
);
CREATE POLICY "dh_staff_all" ON public.decision_history FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- COPYRIGHT FORMS
-- =========================================================
CREATE TABLE public.copyright_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  manuscript_title TEXT NOT NULL,
  signature_data TEXT,
  file_url TEXT,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.copyright_forms TO authenticated;
GRANT ALL ON public.copyright_forms TO service_role;
ALTER TABLE public.copyright_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cf_author_all" ON public.copyright_forms FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = copyright_forms.submission_id AND s.author_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = copyright_forms.submission_id AND s.author_id = auth.uid())
);
CREATE POLICY "cf_staff_read" ON public.copyright_forms FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- =========================================================
-- SETTINGS
-- =========================================================
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_staff_all" ON public.settings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- SUBSCRIBERS
-- =========================================================
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.subscribers TO anon, authenticated;
GRANT SELECT, DELETE ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subs_public_insert" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "subs_staff_read" ON public.subscribers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "subs_staff_delete" ON public.subscribers FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- =========================================================
-- AUDIT LOG
-- =========================================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_staff_read" ON public.audit_log FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "audit_authenticated_insert" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- =========================================================
-- Storage bucket for manuscripts (created via storage tool separately if needed)
-- =========================================================
