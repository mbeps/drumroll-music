/**
 * Server action to create a new song record in the database.
 * Associated audio file is uploaded directly to storage; this action creates the DB record.
 * RLS enforces ownership via uploader_id.
 *
 * @module actions/song/create-song
 * @author Maruf Bepary
 */
"use server";

import { z } from "zod";
import { getLogger } from "@/lib/logger";
import type { CreateSongResult } from "@/types/song/create-song-result";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "song"]);

const CreateSongSchema = z.object({
  title: z.string().trim().min(1).max(300),
  albumId: z.string().uuid(),
  trackNumber: z.number().int().min(1),
  songPath: z.string().min(1),
});

type CreateSongInput = z.infer<typeof CreateSongSchema>;

/**
 * Inserts a new song record for the authenticated user.
 *
 * @param input - The validated song metadata and storage path
 * @returns Object indicating success and created song ID, or descriptive error
 */
const createSong = async (input: CreateSongInput): Promise<CreateSongResult> => {
  const parsed = CreateSongSchema.safeParse(input);
  if (!parsed.success) {
    logger.warn("Invalid input for creating song: {error}", {
      error: parsed.error.issues[0]?.message,
    });
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid song input" };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Unauthenticated attempt to create song");
    return { ok: false, error: "Authenticated user not found" };
  }

  const { data, error } = await supabase
    .from("songs")
    .insert({
      title: parsed.data.title,
      album_id: parsed.data.albumId,
      track_number: parsed.data.trackNumber,
      song_path: parsed.data.songPath,
      uploader_id: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    logger.error("Failed to create song in database: {message}", {
      message: error?.message ?? "No data returned",
    });
    return { ok: false, error: error?.message ?? "Failed to create song" };
  }

  logger.info("Successfully created song {songId}: {title}", {
    songId: data.id,
    title: parsed.data.title,
  });

  return { ok: true, songId: data.id };
};

export default createSong;
