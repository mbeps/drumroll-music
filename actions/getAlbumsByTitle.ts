import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumWithArtists } from "../types/album-with-artists";
import { mapAlbumWithArtistsRow } from "@/lib/mappers";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_selects";
import getAlbums from "@/actions/getAlbums";

/**
 * Searches for albums by title using case-insensitive pattern matching.
 * Falls back to fetching all albums if the search title is empty.
 * Uses PostgREST .ilike() for case-insensitive substring matching.
 *
 * @param title - Album title to search for (case-insensitive, can be partial)
 * @returns Array of matching AlbumWithArtists objects sorted by creation date, or all albums if title is empty
 * @throws No exceptions thrown; returns empty array on error
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
