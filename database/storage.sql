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

CREATE POLICY "Allow All 1t9jwe_3"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'songs'::text);

-- Function + trigger to auto-delete the storage object when a song row is deleted
CREATE OR REPLACE FUNCTION public.delete_song_storage_object()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'songs' AND name = OLD.song_path;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_song_deleted
  AFTER DELETE ON public.songs
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_song_storage_object();

-- Function + trigger to auto-delete the storage object when an artist row is deleted
CREATE OR REPLACE FUNCTION public.delete_artist_image_storage_object()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.image_url IS NOT NULL THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'images' AND name = OLD.image_url;
  END IF;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_artist_deleted
  AFTER DELETE ON public.artists
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_artist_image_storage_object();

-- Function + trigger to auto-delete the storage object when an album row is deleted
CREATE OR REPLACE FUNCTION public.delete_album_image_storage_object()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.cover_image_path IS NOT NULL THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'images' AND name = OLD.cover_image_path;
  END IF;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_album_deleted
  AFTER DELETE ON public.albums
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_album_image_storage_object();
