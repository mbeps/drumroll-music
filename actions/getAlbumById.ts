import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { AlbumDetail } from "../types/album-detail";
import { mapAlbumDetailRow } from "@/lib/mappers";
import { ALBUM_DETAIL_SELECT } from "@/actions/_selects";

const getAlbumById = async (id: string): Promise<AlbumDetail | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select(ALBUM_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log(error?.message ?? "Album not found");
    return null;
  }

  return mapAlbumDetailRow(data);
};

export default getAlbumById;
