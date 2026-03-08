/**
 * Permitted MIME types for audio file uploads.
 * Used to validate the song file before it is sent to Supabase Storage.
 *
 * @author Maruf Bepary
 */
export const AUDIO_ALLOWED_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/flac"] as const;
