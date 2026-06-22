/**
 * Server action to fetch all albums with their credited artists.
 * Ordered by creation date (newest first).
 * Public read access; no authentication required.
 *
 * @module actions/album/get-albums
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumWithArtists } from "@/types/music/album-with-artists";
import { mapAlbumWithArtistsRow } from "@/lib/mappers/album";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_db-selects";

/**
 * Fetches all albums with their associated artists, ordered by creation date descending.
 * Uses ALBUM_WITH_ARTISTS_SELECT for efficient nested PostgREST joins.
 * No authentication required; publicly readable via RLS.
 *
 * @returns Array of AlbumWithArtists objects sorted newest first, or empty array on error
 * @throws No exceptions thrown; returns empty array on query error
 * @see getAlbumsByTitle for searching albums by title
 * @see getAlbumById for fetching a single album with full detail
 * @author Maruf Bepary
 */
const getAlbums = async (): Promise<AlbumWithArtists[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select(ALBUM_WITH_ARTISTS_SELECT)
    .order("created_at", { ascending: false });

  if (error) console.log(error.message);
  return (data ?? []).map(mapAlbumWithArtistsRow);
};

export default getAlbums;
