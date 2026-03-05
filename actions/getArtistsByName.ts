import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Artist } from "../types/artist";
import { mapArtistRow } from "@/lib/mappers";
import getArtists from "@/actions/getArtists";

/**
 * Searches for artists by name using case-insensitive pattern matching.
 * Falls back to fetching all artists if the search name is empty.
 * Uses PostgREST .ilike() for case-insensitive substring matching.
 *
 * @param name - Artist name to search for (case-insensitive, can be partial)
 * @returns Array of matching Artist objects sorted alphabetically by name, or all artists if name is empty
 * @throws No exceptions thrown; returns empty array on error
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

  if (error) console.log(error.message);
  return (data ?? []).map(mapArtistRow);
};

export default getArtistsByName;
