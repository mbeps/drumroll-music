import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { ArtistWithAlbums } from "../types/artist-with-albums";
import { mapArtistWithAlbumsRow } from "@/lib/mappers";
import { ARTIST_WITH_ALBUMS_SELECT } from "@/actions/_selects";

/**
 * Fetches a single artist with all associated albums.
 * Uses ARTIST_WITH_ALBUMS_SELECT PostgREST JOIN to efficiently load the complete artist structure.
 * Returns null if artist is not found or query fails.
 *
 * @param id - UUID of the artist to fetch
 * @returns ArtistWithAlbums object containing artist metadata and all credited albums, or null if not found
 * @throws No exceptions thrown; returns null on error
 * @author Maruf Bepary
 */
const getArtistById = async (id: string): Promise<ArtistWithAlbums | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_WITH_ALBUMS_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log(error?.message ?? "Artist not found");
    return null;
  }

  return mapArtistWithAlbumsRow(data);
};

export default getArtistById;
