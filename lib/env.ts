import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_MAX_SONG_SIZE_MB: z.coerce.number().default(20),
  NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB: z.coerce.number().default(5),
  NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB: z.coerce.number().default(2),
  NEXT_PUBLIC_MAX_AVATAR_SIZE_MB: z.coerce.number().default(5),
});

const serverSchema = clientSchema.extend({
  SUPABASE_REFERENCE_ID: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const isServer = typeof window === "undefined";

const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_MAX_SONG_SIZE_MB: process.env.NEXT_PUBLIC_MAX_SONG_SIZE_MB,
  NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB: process.env.NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB,
  NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB: process.env.NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB,
  NEXT_PUBLIC_MAX_AVATAR_SIZE_MB: process.env.NEXT_PUBLIC_MAX_AVATAR_SIZE_MB,
  ...(isServer && {
    SUPABASE_REFERENCE_ID: process.env.SUPABASE_REFERENCE_ID,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }),
};

const parsed = isServer ? serverSchema.safeParse(processEnv) : clientSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data as z.infer<typeof serverSchema>;

export const FILE_LIMITS = {
  SONG_MAX_BYTES: env.NEXT_PUBLIC_MAX_SONG_SIZE_MB * 1024 * 1024,
  COVER_IMAGE_MAX_BYTES: env.NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB * 1024 * 1024,
  ARTIST_IMAGE_MAX_BYTES: env.NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB * 1024 * 1024,
  AVATAR_MAX_BYTES: env.NEXT_PUBLIC_MAX_AVATAR_SIZE_MB * 1024 * 1024,
} as const;
