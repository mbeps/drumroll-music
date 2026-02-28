import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { ArtistWithAlbums } from "@/types/types";
import { mapArtistWithAlbumsRow } from "@/lib/mappers";
import { ARTIST_WITH_ALBUMS_SELECT } from "@/actions/_selects";

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
