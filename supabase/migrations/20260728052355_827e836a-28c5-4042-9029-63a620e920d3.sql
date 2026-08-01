-- Authors upload/read/replace/delete their own files, foldered by auth.uid()
CREATE POLICY manuscripts_owner_all ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'manuscripts' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'manuscripts' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Staff can read everything in the bucket
CREATE POLICY manuscripts_staff_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'manuscripts' AND public.is_staff(auth.uid()));
