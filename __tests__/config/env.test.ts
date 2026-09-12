import { describe, expect, it, vi } from "vitest";
import { clientEnvSchema, env, FILE_LIMITS, serverEnvSchema, validateEnv } from "@/config/env";

describe("config/env", () => {
  const validClientEnv = {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "mock-pub-key",
  };

  const validServerEnv = {
    ...validClientEnv,
    SUPABASE_REFERENCE_ID: "project-ref",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
    NODE_ENV: "production",
    LOG_LEVEL: "warn",
  };

  describe("client validation", () => {
    it("validates client environment with required fields and applies defaults", () => {
      const result = validateEnv(validClientEnv, false);

      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
      expect(result.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBe("mock-pub-key");
      expect(result.NEXT_PUBLIC_MAX_SONG_SIZE_MB).toBe(20);
      expect(result.NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB).toBe(5);
      expect(result.NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB).toBe(2);
      expect(result.NEXT_PUBLIC_MAX_AVATAR_SIZE_MB).toBe(5);
      expect(result.NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB).toBe(50);
      expect(result.NEXT_PUBLIC_USER_STORAGE_LIMIT_GB).toBe(1);
    });

    it("coerces string numbers to numeric defaults", () => {
      const result = validateEnv(
        {
          ...validClientEnv,
          NEXT_PUBLIC_MAX_SONG_SIZE_MB: "30",
          NEXT_PUBLIC_USER_STORAGE_LIMIT_GB: "2",
        },
        false,
      );

      expect(result.NEXT_PUBLIC_MAX_SONG_SIZE_MB).toBe(30);
      expect(result.NEXT_PUBLIC_USER_STORAGE_LIMIT_GB).toBe(2);
    });

    it("throws error when required client URL is invalid", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        validateEnv(
          {
            ...validClientEnv,
            NEXT_PUBLIC_SUPABASE_URL: "not-a-valid-url",
          },
          false,
        ),
      ).toThrow("Invalid environment variables");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("server validation", () => {
    it("validates full server environment with optional secrets", () => {
      const result = validateEnv(validServerEnv, true);

      expect(result.SUPABASE_REFERENCE_ID).toBe("project-ref");
      expect(result.SUPABASE_SERVICE_ROLE_KEY).toBe("service-role-secret");
      expect(result.NODE_ENV).toBe("production");
      expect(result.LOG_LEVEL).toBe("warning"); // warn transformed to warning
    });

    it("applies server defaults when optional values are omitted", () => {
      const result = validateEnv(validClientEnv, true);

      expect(result.NODE_ENV).toBe("development");
      expect(result.LOG_LEVEL).toBe("info");
      expect(result.SUPABASE_REFERENCE_ID).toBeUndefined();
      expect(result.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    });

    it("throws error when server environment has invalid NODE_ENV", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        validateEnv(
          {
            ...validClientEnv,
            NODE_ENV: "invalid-env",
          },
          true,
        ),
      ).toThrow("Invalid environment variables");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("exported schemas and instances", () => {
    it("exports clientEnvSchema and serverEnvSchema", () => {
      expect(clientEnvSchema).toBeDefined();
      expect(serverEnvSchema).toBeDefined();
    });

    it("exports singleton validated env instance", () => {
      expect(env).toBeDefined();
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    });

    it("derives FILE_LIMITS correctly in bytes", () => {
      expect(FILE_LIMITS.SONG_MAX_BYTES).toBe(env.NEXT_PUBLIC_MAX_SONG_SIZE_MB * 1024 * 1024);
      expect(FILE_LIMITS.COVER_IMAGE_MAX_BYTES).toBe(
        env.NEXT_PUBLIC_MAX_COVER_IMAGE_SIZE_MB * 1024 * 1024,
      );
      expect(FILE_LIMITS.ARTIST_IMAGE_MAX_BYTES).toBe(
        env.NEXT_PUBLIC_MAX_ARTIST_IMAGE_SIZE_MB * 1024 * 1024,
      );
      expect(FILE_LIMITS.AVATAR_MAX_BYTES).toBe(env.NEXT_PUBLIC_MAX_AVATAR_SIZE_MB * 1024 * 1024);
      expect(FILE_LIMITS.GLOBAL_STORAGE_LIMIT_BYTES).toBe(
        env.NEXT_PUBLIC_GLOBAL_STORAGE_LIMIT_GB * 1024 * 1024 * 1024,
      );
      expect(FILE_LIMITS.USER_STORAGE_LIMIT_BYTES).toBe(
        env.NEXT_PUBLIC_USER_STORAGE_LIMIT_GB * 1024 * 1024 * 1024,
      );
    });
  });
});
