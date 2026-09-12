/**
 * Server action to create a new custom playlist for the authenticated user.
 * Requires user authentication via Supabase Auth.
 * The new playlist is automatically marked as not-favourites.
 *
 * @module actions/playlist/create-playlist
 * @author Maruf Bepary
 */

import { getLogger } from "@/lib/logger";
import { mapPlaylistRow } from "@/lib/mappers/playlist";
import { CreatePlaylistSchema } from "@/schemas/playlist/create-playlist.schema";
import type { Playlist } from "@/types/playlist/playlist";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "playlist"]);

/**
 * Creates a new custom playlist for the currently authenticated user.
 * Validates input with Zod before inserting into the database.
 * Returns null if user is not authenticated or validation/creation fails.
 *
 * @param title - The title of the new playlist (should be pre-trimmed by caller)
 * @returns Mapped Playlist object on success, null on authentication, validation, or database error
 * @throws ValidationError if title is invalid (caught via safeParse)
 * @throws UnauthorizedError if user is not authenticated (implicit)
 * @throws DatabaseError if database insert fails (implicit)
 * @see getPlaylists for fetching user's custom playlists
 * @see deletePlaylist for removing a playlist
 * @author Maruf Bepary
 */
const createPlaylist = async (title: string): Promise<Playlist | null> => {
  const parsed = CreatePlaylistSchema.safeParse({ title });
  if (!parsed.success) {
    logger.warn("Invalid input for creating playlist");
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    logger.warn("Unauthenticated attempt to create playlist");
    return null;
  }

  const { data, error: insertError } = await supabase
    .from("playlists")
    .insert({ user_id: user.id, title: parsed.data.title, is_favourites: false })
    .select("*")
    .single();

  if (insertError || !data) {
    logger.error("Failed to create playlist: {message}", {
      message: insertError?.message ?? "No data returned",
    });
    return null;
  }

  logger.info("Successfully created playlist: {playlistId}", { playlistId: data.id });
  return mapPlaylistRow(data);
};

export default createPlaylist;
