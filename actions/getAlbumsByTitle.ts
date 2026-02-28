import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumWithArtists } from "@/types/types";
import { mapAlbumWithArtistsRow } from "@/lib/mappers";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_selects";
import getAlbums from "@/actions/getAlbums";

const getAlbumsByTitle = async (title: string): Promise<AlbumWithArtists[]> => {
  if (!title) return getAlbums();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select(ALBUM_WITH_ARTISTS_SELECT)
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) console.log(error.message);
  return (data ?? []).map(mapAlbumWithArtistsRow);
};

export default getAlbumsByTitle;
