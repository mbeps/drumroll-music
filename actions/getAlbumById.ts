import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumDetail } from "../types/album-detail";
import { mapAlbumDetailRow } from "@/lib/mappers";
import { ALBUM_DETAIL_SELECT } from "@/actions/_selects";

/**
 * Fetches a single album with full detail hierarchy including all artists and songs.
 * Uses ALBUM_DETAIL_SELECT PostgREST JOIN to efficiently load the complete album structure.
 * Returns null if album is not found or query fails.
 *
 * @param id - UUID of the album to fetch
 * @returns AlbumDetail object containing album metadata, artists (with images), and all songs, or null if not found
 * @throws No exceptions thrown; returns null on error
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
