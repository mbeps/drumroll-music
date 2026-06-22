/**
 * Server action to search for albums by title using case-insensitive pattern matching.
 * Falls back to getAlbums() if search title is empty.
 * Public read access; no authentication required.
 *
 * @module actions/album/get-albums-by-title
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumWithArtists } from "@/types/music/album-with-artists";
import { mapAlbumWithArtistsRow } from "@/lib/mappers/album";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_db-selects";
import getAlbums from "@/actions/album/get-albums";

/**
 * Searches for albums by title using case-insensitive substring matching (ilike).
 * Empty title falls back to getAlbums() to return all albums.
 * No authentication required; publicly readable via RLS.
 *
 * @param title - Album title to search (case-insensitive substring match)
 * @returns Array of matching AlbumWithArtists objects newest first, or all albums if title is empty
 * @throws No exceptions thrown; returns empty array on query error
 * @see getAlbums for fetching all albums without search
 * @see getSongsByTitle for similar song search functionality
 * @author Maruf Bepary
 */
const getAlbumsByTitle = async (title: string): Promise<AlbumWithArtists[]> => {
  if (!title) return getAlbums();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select(ALBUM_WITH_ARTISTS_SELECT)
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) console.log(error.message);
  return (data ?? []).map(mapAlbumWithArtistsRow);
};

export default getAlbumsByTitle;
