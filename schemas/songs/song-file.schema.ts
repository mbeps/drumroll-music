import { z } from "zod";
import { FILE_LIMITS } from "@/lib/env";
import { AUDIO_ALLOWED_TYPES } from "./audio-allowed-types";

/**
 * Zod schema for validating a song audio file.
 * Checks for permitted MIME types and maximum file size.
 *
 * @author Maruf Bepary
 */
export const SongFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, {
    message: "Audio file is required",
  })
  .refine((file) => file.size <= FILE_LIMITS.SONG_MAX_BYTES, {
    message: `Audio file size must be less than ${FILE_LIMITS.SONG_MAX_BYTES / (1024 * 1024)}MB`,
  })
  .refine((file) => (AUDIO_ALLOWED_TYPES as readonly string[]).includes(file.type), {
    message: "Invalid audio file type. Only MP3, WAV, OGG, and FLAC are allowed.",
  });
