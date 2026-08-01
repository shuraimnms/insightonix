
DROP POLICY IF EXISTS "subs_public_insert" ON public.subscribers;
CREATE POLICY "subs_public_insert" ON public.subscribers FOR INSERT WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
