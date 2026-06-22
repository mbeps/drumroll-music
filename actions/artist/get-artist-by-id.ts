/**
 * Server action to fetch a single artist with all credited albums.
 * Public read access; no authentication required.
 *
 * @module actions/artist/get-artist-by-id
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";
import type { ArtistWithAlbums } from "@/types/music/artist-with-albums";
import { mapArtistWithAlbumsRow } from "@/lib/mappers/artist";
import { ARTIST_WITH_ALBUMS_SELECT } from "@/actions/_db-selects";

const logger = getLogger(["app", "actions", "artist"]);

/**
 * Fetches a single artist with all albums they are credited on.
 * Uses ARTIST_WITH_ALBUMS_SELECT for efficient nested PostgREST joins.
 * No authentication required; publicly readable via RLS.
 *
 * @param id - UUID of the artist to fetch
 * @returns ArtistWithAlbums object with artist metadata and all credited albums, or null if not found
 * @throws No exceptions thrown; returns null on query error
 * @see getArtists for fetching all artists
 * @see ARTIST_WITH_ALBUMS_SELECT for join structure
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
    logger.error("Failed to fetch artist by ID {id}: {message}", {
      id,
      message: error?.message ?? "Artist not found",
    });
    return null;
  }

  return mapArtistWithAlbumsRow(data);
};

export default getArtistById;
