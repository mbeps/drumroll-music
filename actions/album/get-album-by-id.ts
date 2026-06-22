/**
 * Server action to fetch a single album with complete detail hierarchy.
 * Loads album metadata, all credited artists, and all track data using efficient PostgREST joins.
 * Public read access; no authentication required.
 *
 * @module actions/album/get-album-by-id
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumDetail } from "@/types/music/album-detail";
import { mapAlbumDetailRow } from "@/lib/mappers/album";
import { ALBUM_DETAIL_SELECT } from "@/actions/_db-selects";

/**
 * Fetches a single album with full detail hierarchy: metadata, all credited artists, and all songs.
 * Uses ALBUM_DETAIL_SELECT for efficient nested PostgREST joins.
 * No authentication required; publicly readable via RLS.
 *
 * @param id - UUID of the album to fetch
 * @returns AlbumDetail object on success (album, artists with images, sorted songs), or null if not found
 * @throws No exceptions thrown; returns null on query error
 * @see getAlbums for fetching all albums with artists
 * @see ALBUM_DETAIL_SELECT for join structure
 * @author Maruf Bepary
 */
const getAlbumById = async (id: string): Promise<AlbumDetail | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select(ALBUM_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log(error?.message ?? "Album not found");
    return null;
  }

  return mapAlbumDetailRow(data);
};

export default getAlbumById;
