/**
 * Server action to fetch all artists sorted alphabetically.
 * Public read access; no authentication required.
 *
 * @module actions/artist/get-artists
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";
import type { Artist } from "@/types/artist/artist";
import { mapArtistRow } from "@/lib/mappers/artist";

const logger = getLogger(["app", "actions", "artist"]);

/**
 * Fetches all artists sorted alphabetically by name.
 * No authentication required; publicly readable via RLS.
 *
 * @returns Array of Artist objects sorted alphabetically, or empty array on error
 * @throws No exceptions thrown; returns empty array on query error
 * @see getArtistsByName for searching artists by name
 * @see getArtistById for fetching a single artist with albums
 * @author Maruf Bepary
 */
const getArtists = async (): Promise<Artist[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    logger.error("Failed to fetch artists: {message}", { message: error.message });
  }

  return (data ?? []).map(mapArtistRow);
};

export default getArtists;
