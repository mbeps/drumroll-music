import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { Artist } from "@/types/types";
import { mapArtistRow } from "@/lib/mappers";

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
