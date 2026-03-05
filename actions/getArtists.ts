import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Artist } from "../types/artist";
import { mapArtistRow } from "@/lib/mappers";

/**
 * Fetches all artists sorted alphabetically by name.
 * Returns empty array if query fails.
 *
 * @returns Array of Artist objects sorted alphabetically by name, or empty array on error
 * @throws No exceptions thrown; returns empty array on error
 * @author Maruf Bepary
 */
const getArtists = async (): Promise<Artist[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("name", { ascending: true });

  if (error) console.log(error.message);
  return (data ?? []).map(mapArtistRow);
};

export default getArtists;
