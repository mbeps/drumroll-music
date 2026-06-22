/**
 * Song upload audio format validation constants.
 * Centralizes permitted MIME types for audio file uploads to standardize supported formats across the application.
 *
 * @author Maruf Bepary
 */

/**
 * Permitted MIME types for audio file uploads.
 * Used to validate the song file before it is sent to Supabase Storage.
 * Supports: MP3, WAV, OGG Vorbis, and FLAC formats for broad codec compatibility.
 */
export const AUDIO_ALLOWED_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/flac"] as const;
