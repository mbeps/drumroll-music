import { describe, expect, it, vi } from "vitest";
import {
  ADMIN_USER_IDS,
  clientEnvSchema,
  env,
  FILE_LIMITS,
  parseAdminUserIds,
  serverEnvSchema,
  validateEnv,
} from "@/config/env";

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
      expect(result.NEXT_PUBLIC_ADMIN_USER_IDS).toBe("");
    });

    it("accepts valid UUIDs in NEXT_PUBLIC_ADMIN_USER_IDS", () => {
      const result = validateEnv(
        {
          ...validClientEnv,
          NEXT_PUBLIC_ADMIN_USER_IDS: "f66a1370-d191-48ad-956a-a54e2eaf5cf6",
        },
        false,
      );
      expect(result.NEXT_PUBLIC_ADMIN_USER_IDS).toBe("f66a1370-d191-48ad-956a-a54e2eaf5cf6");
    });

    it("throws error when NEXT_PUBLIC_ADMIN_USER_IDS contains invalid UUID", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        validateEnv(
          {
            ...validClientEnv,
            NEXT_PUBLIC_ADMIN_USER_IDS: "not-a-uuid",
          },
          false,
        ),
      ).toThrow("Invalid environment variables");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
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

    it("exports ADMIN_USER_IDS set", () => {
      expect(ADMIN_USER_IDS).toBeInstanceOf(Set);
    });
  });

  describe("parseAdminUserIds", () => {
    it("returns empty set for empty or undefined input", () => {
      expect(parseAdminUserIds("").size).toBe(0);
      expect(parseAdminUserIds(undefined).size).toBe(0);
      expect(parseAdminUserIds("   ").size).toBe(0);
    });

    it("parses single and comma-separated UUIDs trimming whitespace", () => {
      const id1 = "f66a1370-d191-48ad-956a-a54e2eaf5cf6";
      const id2 = "e5b7b921-65b1-4bc2-9655-7096e23bb8e3";
      const set = parseAdminUserIds(`  ${id1} , , ${id2}  `);

      expect(set.size).toBe(2);
      expect(set.has(id1)).toBe(true);
      expect(set.has(id2)).toBe(true);
    });

    it("throws on invalid UUID in list", () => {
      expect(() => parseAdminUserIds("f66a1370-d191-48ad-956a-a54e2eaf5cf6, invalid-uuid")).toThrow(
        'Invalid admin user UUID: "invalid-uuid"',
      );
    });
  });
});
