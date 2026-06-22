/**
 * Server action to search for artists by name using case-insensitive pattern matching.
 * Falls back to getArtists() if search name is empty.
 * Public read access; no authentication required.
 *
 * @module actions/artist/get-artists-by-name
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";
import type { Artist } from "@/types/artist/artist";
import { mapArtistRow } from "@/lib/mappers/artist";
import getArtists from "@/actions/artist/get-artists";

const logger = getLogger(["app", "actions", "artist"]);

/**
 * Searches for artists by name using case-insensitive substring matching (ilike).
 * Empty name falls back to getArtists() to return all artists.
 * No authentication required; publicly readable via RLS.
 *
 * @param name - Artist name to search (case-insensitive substring match)
 * @returns Array of matching Artist objects sorted alphabetically, or all artists if name is empty
 * @throws No exceptions thrown; returns empty array on query error
 * @see getArtists for fetching all artists without search
 * @see getArtistsByTitle for similar album search functionality
 * @author Maruf Bepary
 */
const getArtistsByName = async (name: string): Promise<Artist[]> => {
  if (!name) return getArtists();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .ilike("name", `%${name}%`)
    .order("name", { ascending: true });

  if (error) {
    logger.error("Failed to search artists by name {name}: {message}", {
      name,
      message: error.message,
    });
  }

  return (data ?? []).map(mapArtistRow);
};

export default getArtistsByName;
