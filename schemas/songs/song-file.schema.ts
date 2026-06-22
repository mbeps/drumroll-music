import { z } from "zod";
import { FILE_LIMITS } from "@/lib/env";
import { AUDIO_ALLOWED_TYPES } from "./audio-allowed-types";

/**
 * Song audio file validation for browser-side uploads.
 * Enforces file type and size constraints before transmission to Supabase Storage; maximum 20 MB per `FILE_LIMITS.SONG_MAX_BYTES`.
 *
 * @see AUDIO_ALLOWED_TYPES for permitted audio formats
 * @author Maruf Bepary
 */

/**
 * Zod schema for validating a song audio file.
 * Checks that the file is non-empty, within the maximum size limit (`FILE_LIMITS.SONG_MAX_BYTES`, 20 MB default),
 * and has a permitted MIME type from {@link AUDIO_ALLOWED_TYPES}.
 * Failures: empty file triggers "Audio file is required"; oversized file shows actual MB limit;
 * invalid type triggers "Invalid audio file type. Only MP3, WAV, OGG, and FLAC are allowed.".
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
