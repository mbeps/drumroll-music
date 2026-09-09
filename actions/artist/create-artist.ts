/**
 * Server action to create a new artist record.
 * RLS sets uploader_id to the authenticated user (or null if public).
 *
 * @module actions/artist/create-artist
 * @author Maruf Bepary
 */
"use server";

import { z } from "zod";
import { getLogger } from "@/lib/logger";
import { CreateArtistSchema } from "@/schemas/artists/create-artist.schema";
import { createServerSupabaseClient } from "@/utils/supabase/server";

const logger = getLogger(["app", "actions", "artist"]);

const ExtendedCreateArtistSchema = CreateArtistSchema.extend({
  imageUrl: z.string().nullable().optional(),
});

export type CreateArtistInput = z.infer<typeof ExtendedCreateArtistSchema>;

export interface CreateArtistResult {
  ok: boolean;
  artistId?: string;
  error?: string;
}

/**
 * Inserts a new artist record for the catalog.
 *
 * @param input - The validated artist name and optional image path
 * @returns Object with created artistId on success or error on failure
 */
const createArtist = async (input: CreateArtistInput): Promise<CreateArtistResult> => {
  const parsed = ExtendedCreateArtistSchema.safeParse(input);
  if (!parsed.success) {
    logger.warn("Invalid input for creating artist: {error}", {
      error: parsed.error.issues[0]?.message,
    });
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid artist input" };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn("Unauthenticated attempt to create artist");
    return { ok: false, error: "Authenticated user not found" };
  }

  const { data, error } = await supabase
    .from("artists")
    .insert({
      name: parsed.data.name,
      image_url: parsed.data.imageUrl ?? null,
      uploader_id: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    logger.error("Failed to create artist in database: {message}", {
      message: error?.message ?? "No data returned",
    });
    return { ok: false, error: error?.message ?? "Failed to create artist" };
  }

  logger.info("Successfully created artist {artistId}: {name}", {
    artistId: data.id,
    name: parsed.data.name,
  });

  return { ok: true, artistId: data.id };
};

export default createArtist;
