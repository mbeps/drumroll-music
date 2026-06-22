/**
 * Server action to fetch a single playlist with all associated songs.
 * Songs are returned in their stored position order within the playlist.
 * Public read access; no authentication required.
 *
 * @module actions/playlist/get-playlist-by-id
 * @author Maruf Bepary
 */
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getLogger } from "@/lib/logger";
import type { PlaylistWithSongs } from "@/types/playlist/playlist-with-songs";
import { mapPlaylistWithSongsRow } from "@/lib/mappers/playlist";
import { PLAYLIST_WITH_SONGS_SELECT } from "@/actions/_db-selects";

const logger = getLogger(["app", "actions", "playlist"]);

/**
 * Fetches a playlist by its ID with all associated songs in position order.
 * Uses PLAYLIST_WITH_SONGS_SELECT for efficient nested PostgREST joins.
 * No authentication required; publicly readable via RLS.
 *
 * @param id - UUID of the playlist to fetch
 * @returns PlaylistWithSongs object containing playlist metadata and songs in position order, or null if not found
 * @throws No exceptions thrown; returns null on query error
 * @see getPlaylists for fetching a user's custom playlists
 * @see getFavouriteSongs for fetching the user's favourite songs
 * @author Maruf Bepary
 */
const getPlaylistById = async (id: string): Promise<PlaylistWithSongs | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("playlists")
    .select(PLAYLIST_WITH_SONGS_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    logger.error("Failed to fetch playlist by ID {id}: {message}", {
      id,
      message: error?.message ?? "Playlist not found",
    });
    return null;
  }

  return mapPlaylistWithSongsRow(data);
};

export default getPlaylistById;
