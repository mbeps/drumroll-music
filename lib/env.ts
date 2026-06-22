/**
 * Environment variable validation and pre-calculated file size constants.
 *
 * This module provides:
 * - Centralized Zod schema validation for Supabase and storage configuration.
 * - Client-side variables (prefixed `NEXT_PUBLIC_`) available in browser and server.
 * - Server-only variables including Node environment and Supabase service role key.
 * - Runtime parsing ensuring all required environment variables are present and correctly typed.
 * - Pre-calculated byte limits derived from environment variables for all file types.
 *
 * Storage quotas: Per-user limit (default 1GB) and global limit (default 50GB).
 *
 * @see {@link FILE_LIMITS} for pre-calculated byte constants
 * @author Maruf Bepary
 */

import { z } from "zod";
import { getLogger } from "@logtape/logtape";

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_MAX_SONG_SIZE_MB: z.coerce.number().default(20),
  NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB: z.coerce.number().default(5),
  NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB: z.coerce.number().default(2),
  NEXT_PUBLIC_MAX_AVATAR_SIZE_MB: z.coerce.number().default(5),
  NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB: z.coerce.number().default(50),
  NEXT_PUBLIC_USER_STORAGE_LIMIT_GB: z.coerce.number().default(1),
});

const serverSchema = clientSchema.extend({
  SUPABASE_REFERENCE_ID: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
});

const isServer = typeof window === "undefined";

const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_MAX_SONG_SIZE_MB: process.env.NEXT_PUBLIC_MAX_SONG_SIZE_MB,
  NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB:
    process.env.NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB,
  NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB:
    process.env.NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB,
  NEXT_PUBLIC_MAX_AVATAR_SIZE_MB: process.env.NEXT_PUBLIC_MAX_AVATAR_SIZE_MB,
  NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB:
    process.env.NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB,
  NEXT_PUBLIC_USER_STORAGE_LIMIT_GB: process.env.NEXT_PUBLIC_USER_STORAGE_LIMIT_GB,
  ...(isServer && {
    SUPABASE_REFERENCE_ID: process.env.SUPABASE_REFERENCE_ID,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
  }),
};

const parsed = isServer ? serverSchema.safeParse(processEnv) : clientSchema.safeParse(processEnv);

if (!parsed.success) {
  const logger = getLogger(["app", "env"]);
  logger.fatal("❌ Invalid environment variables: {errors}", {
    errors: parsed.error.format(),
  });
  throw new Error("Invalid environment variables");
}

export const env = parsed.data as z.infer<typeof serverSchema>;

/**
 * Pre-calculated byte limits for all file types and storage quotas.
 * Derives from environment variables (e.g., `NEXT_PUBLIC_MAX_SONG_SIZE_MB`).
 *
 * File limits are enforced on schema validation for individual uploads.
 * Storage quotas are enforced via RPC calls during upload operations.
 *
 * @see {@link validateStorageLimits} for dual-quota validation during uploads
 * @author Maruf Bepary
 */
export const FILE_LIMITS = {
  /** Maximum song file size in bytes (default 20MB). */
  SONG_MAX_BYTES: env.NEXT_PUBLIC_MAX_SONG_SIZE_MB * 1024 * 1024,
  /** Maximum cover image size in bytes (default 5MB). */
  COVER_IMAGE_MAX_BYTES: env.NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB * 1024 * 1024,
  /** Maximum artist image size in bytes (default 2MB). */
  ARTIST_IMAGE_MAX_BYTES: env.NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB * 1024 * 1024,
  /** Maximum user avatar size in bytes (default 5MB). */
  AVATAR_MAX_BYTES: env.NEXT_PUBLIC_MAX_AVATAR_SIZE_MB * 1024 * 1024,
  /** Application-wide storage quota in bytes (default 50GB). */
  GLOBAL_STORAGE_LIMIT_BYTES: env.NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB * 1024 * 1024 * 1024,
  /** Per-user storage quota in bytes (default 1GB). */
  USER_STORAGE_LIMIT_BYTES: env.NEXT_PUBLIC_USER_STORAGE_LIMIT_GB * 1024 * 1024 * 1024,
} as const;
