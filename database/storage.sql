-- Storage RLS Policies for Supabase Storage buckets
-- Table: storage.objects

-- ============================================================
-- IMAGES bucket
-- ============================================================

CREATE POLICY "Allow All 1ffg0oo_0"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images'::text);

CREATE POLICY "Allow All 1ffg0oo_1"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'images'::text);

CREATE POLICY "Allow All 1ffg0oo_2"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'images'::text);

CREATE POLICY "Allow All 1ffg0oo_3"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'images'::text);

-- ============================================================
-- SONGS bucket
-- ============================================================

CREATE POLICY "Allow All 1t9jwe_0"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'songs'::text);

CREATE POLICY "Allow All 1t9jwe_1"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'songs'::text);

CREATE POLICY "Allow All 1t9jwe_2"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'songs'::text);
