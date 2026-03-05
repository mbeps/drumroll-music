import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumWithArtists } from "../types/album-with-artists";
import { mapAlbumWithArtistsRow } from "@/lib/mappers";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_selects";

/**
 * Fetches all albums with their associated artists, ordered by newest first.
 * Uses ALBUM_WITH_ARTISTS_SELECT PostgREST JOIN for efficient data loading.
 * Returns empty array if query fails.
 *
 * @returns Array of AlbumWithArtists objects sorted by creation date (newest first), or empty array on error
 * @throws No exceptions thrown; returns empty array on error
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
