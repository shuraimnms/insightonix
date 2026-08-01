-- Extend articles with DOI lifecycle fields
DO $$ BEGIN
  CREATE TYPE public.doi_status AS ENUM ('none','pending','registered','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS doi_status public.doi_status NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS doi_url text,
  ADD COLUMN IF NOT EXISTS doi_registered_at timestamptz,
  ADD COLUMN IF NOT EXISTS doi_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Crossref submissions tracking
CREATE TABLE IF NOT EXISTS public.crossref_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  doi text,
  deposit_id text,
  status text NOT NULL DEFAULT 'queued', -- queued | submitted | accepted | failed
  response jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz,
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crossref_submissions TO authenticated;
GRANT ALL ON public.crossref_submissions TO service_role;

ALTER TABLE public.crossref_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read crossref submissions"
  ON public.crossref_submissions FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert crossref submissions"
  ON public.crossref_submissions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update crossref submissions"
  ON public.crossref_submissions FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete crossref submissions"
  ON public.crossref_submissions FOR DELETE
  TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TRIGGER update_crossref_submissions_updated_at
  BEFORE UPDATE ON public.crossref_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS crossref_submissions_article_idx ON public.crossref_submissions(article_id);
CREATE INDEX IF NOT EXISTS crossref_submissions_status_idx ON public.crossref_submissions(status);