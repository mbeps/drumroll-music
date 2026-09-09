/**
 * Server action to create a new album and link its artist.
 * RLS enforces uploader_id constraint.
 *
 * @module actions/album/create-album
 * @author Maruf Bepary
 */
"use server";

import { z } from "zod";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_db-selects";
import { getLogger } from "@/lib/logger";
import { mapAlbumWithArtistsRow } from "@/lib/mappers/album";
import { CreateAlbumSchema } from "@/schemas/albums/create-album.schema";
import type { AlbumWithArtists } from "@/types/music/album-with-artists";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "album"]);

const ExtendedCreateAlbumSchema = CreateAlbumSchema.extend({
  coverImagePath: z.string().nullable().optional(),
});

export type CreateAlbumInput = z.infer<typeof ExtendedCreateAlbumSchema>;

export interface CreateAlbumResult {
  ok: boolean;
  album?: AlbumWithArtists;
  error?: string;
}

/**
 * Creates a new album and links the primary artist.
 *
 * @param input - The validated title, artistId, and optional coverImagePath
 * @returns Object with mapped AlbumWithArtists on success, or error on failure
 */
const createAlbum = async (input: CreateAlbumInput): Promise<CreateAlbumResult> => {
  const parsed = ExtendedCreateAlbumSchema.safeParse(input);
  if (!parsed.success) {
    logger.warn("Invalid input for creating album: {error}", {
      error: parsed.error.issues[0]?.message,
    });
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid album input" };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Unauthenticated attempt to create album");
    return { ok: false, error: "Authenticated user not found" };
  }

  // 1. Insert album record
  const { data: album, error: albumError } = await supabase
    .from("albums")
    .insert({
      title: parsed.data.title,
      uploader_id: user.id,
      cover_image_path: parsed.data.coverImagePath ?? null,
    })
    .select("id")
    .single();

  if (albumError || !album) {
    logger.error("Failed to create album record in database: {message}", {
      message: albumError?.message ?? "No data returned",
    });
    return { ok: false, error: albumError?.message ?? "Failed to create album" };
  }

  // 2. Link artist in album_artists junction
  const { error: linkError } = await supabase
    .from("album_artists")
    .insert({ album_id: album.id, artist_id: parsed.data.artistId });

  if (linkError) {
    logger.error("Failed to link artist {artistId} to album {albumId}: {message}", {
      artistId: parsed.data.artistId,
      albumId: album.id,
      message: linkError.message,
    });
    return { ok: false, error: "Failed to link artist to album" };
  }

  // 3. Fetch full album with artists
  const { data: fullAlbum, error: fetchError } = await supabase
    .from("albums")
    .select(ALBUM_WITH_ARTISTS_SELECT)
    .eq("id", album.id)
    .single();

  if (fetchError || !fullAlbum) {
    logger.error("Failed to fetch newly created album {albumId}: {message}", {
      albumId: album.id,
      message: fetchError?.message ?? "Not found",
    });
    return { ok: false, error: "Failed to fetch created album" };
  }

  const mapped = mapAlbumWithArtistsRow(fullAlbum as Parameters<typeof mapAlbumWithArtistsRow>[0]);

  logger.info("Successfully created album {albumId}: {title}", {
    albumId: album.id,
    title: parsed.data.title,
  });

  return { ok: true, album: mapped };
};

export default createAlbum;
