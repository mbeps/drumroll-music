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
-- IMAGES bucket — avatar path-scoped policies
-- These restrict avatar operations to the owner's subfolder:
--   images/avatars/{uid}/...
-- ============================================================

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images'
  AND name LIKE 'avatars/' || auth.uid()::text || '/%'
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images'
  AND name LIKE 'avatars/' || auth.uid()::text || '/%'
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images'
  AND name LIKE 'avatars/' || auth.uid()::text || '/%'
);

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

CREATE POLICY "Allow All 1t9jwe_3"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'songs'::text);

-- RPC function to get global storage usage
CREATE OR REPLACE FUNCTION get_global_storage_usage()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = storage, public
AS $$
    SELECT COALESCE(SUM((metadata->>'size')::bigint), 0)
    FROM objects;
$$;

-- RPC function to get specific user storage usage
CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = storage, public
AS $$
    SELECT COALESCE(SUM((metadata->>'size')::bigint), 0)
    FROM objects
    WHERE owner = p_user_id;
$$;

