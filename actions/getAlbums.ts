import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumWithArtists } from "../types/album-with-artists";
import { mapAlbumWithArtistsRow } from "@/lib/mappers";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_selects";

const getAlbums = async (): Promise<AlbumWithArtists[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select(ALBUM_WITH_ARTISTS_SELECT)
    .order("created_at", { ascending: false });

  if (error) console.log(error.message);
  return (data ?? []).map(mapAlbumWithArtistsRow);
};

export default getAlbums;
