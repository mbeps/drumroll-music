import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Artist } from "@/types/types";
import { mapArtistRow } from "@/lib/mappers";
import getArtists from "@/actions/getArtists";

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
