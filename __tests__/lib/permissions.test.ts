import { describe, expect, it } from "vitest";
import { getUserRoles, hasPermission, isAdmin } from "@/lib/auth/permissions";

describe("lib/auth/permissions", () => {
  // Configured in .env.local: f66a1370-d191-48ad-956a-a54e2eaf5cf6
  const adminId = "f66a1370-d191-48ad-956a-a54e2eaf5cf6";
  const regularUserId = "11111111-2222-4444-8888-999999999999";
  const otherUserId = "22222222-3333-4444-8888-999999999999";

  const adminUser = { id: adminId };
  const regularUser = { id: regularUserId };

  describe("isAdmin", () => {
    it("returns false for null or undefined subject", () => {
      expect(isAdmin(null)).toBe(false);
      expect(isAdmin(undefined)).toBe(false);
      expect(isAdmin({ id: "" })).toBe(false);
    });

    it("returns false for non-admin user", () => {
      expect(isAdmin(regularUser)).toBe(false);
    });

    it("returns true for configured admin user", () => {
      expect(isAdmin(adminUser)).toBe(true);
    });
  });

  describe("getUserRoles", () => {
    it("returns empty array for unauthenticated subject", () => {
      expect(getUserRoles(null)).toEqual([]);
      expect(getUserRoles(undefined)).toEqual([]);
      expect(getUserRoles({ id: "" })).toEqual([]);
    });

    it("returns user role for standard user", () => {
      expect(getUserRoles(regularUser)).toEqual(["user"]);
    });

    it("returns admin and user roles for configured admin", () => {
      expect(getUserRoles(adminUser)).toEqual(["admin", "user"]);
    });
  });

  describe("hasPermission for unauthenticated users", () => {
    it("allows public viewing of songs, albums, and artists", () => {
      expect(hasPermission(null, "songs", "view")).toBe(true);
      expect(hasPermission(null, "albums", "view")).toBe(true);
      expect(hasPermission(null, "artists", "view")).toBe(true);
    });

    it("denies unauthenticated viewing of playlists", () => {
      expect(
        hasPermission(null, "playlists", "view", {
          userId: otherUserId,
          isFavourites: false,
        }),
      ).toBe(false);
    });

    it("denies unauthenticated mutating of any resource", () => {
      expect(hasPermission(null, "songs", "create")).toBe(false);
      expect(hasPermission(null, "songs", "delete", { uploaderId: regularUserId })).toBe(false);
      expect(hasPermission(null, "albums", "create")).toBe(false);
      expect(hasPermission(null, "albums", "update", { uploaderId: regularUserId })).toBe(false);
      expect(hasPermission(null, "artists", "create")).toBe(false);
      expect(hasPermission(null, "artists", "delete", { uploaderId: regularUserId })).toBe(false);
      expect(hasPermission(null, "playlists", "create")).toBe(false);
    });
  });

  describe("hasPermission for regular users", () => {
    it("manages songs: can view, create, and delete own songs only", () => {
      expect(hasPermission(regularUser, "songs", "view")).toBe(true);
      expect(hasPermission(regularUser, "songs", "create")).toBe(true);
      expect(hasPermission(regularUser, "songs", "delete", { uploaderId: regularUserId })).toBe(
        true,
      );
      expect(hasPermission(regularUser, "songs", "delete", { uploaderId: otherUserId })).toBe(
        false,
      );
    });

    it("manages albums: can view, create, update/delete own albums only", () => {
      expect(hasPermission(regularUser, "albums", "view")).toBe(true);
      expect(hasPermission(regularUser, "albums", "create")).toBe(true);
      expect(hasPermission(regularUser, "albums", "update", { uploaderId: regularUserId })).toBe(
        true,
      );
      expect(hasPermission(regularUser, "albums", "update", { uploaderId: otherUserId })).toBe(
        false,
      );
      expect(hasPermission(regularUser, "albums", "delete", { uploaderId: regularUserId })).toBe(
        true,
      );
      expect(hasPermission(regularUser, "albums", "delete", { uploaderId: otherUserId })).toBe(
        false,
      );
    });

    it("manages artists: can view, create, update/delete own artists; denies orphaned artists", () => {
      expect(hasPermission(regularUser, "artists", "view")).toBe(true);
      expect(hasPermission(regularUser, "artists", "create")).toBe(true);
      expect(hasPermission(regularUser, "artists", "update", { uploaderId: regularUserId })).toBe(
        true,
      );
      expect(hasPermission(regularUser, "artists", "update", { uploaderId: otherUserId })).toBe(
        false,
      );
      expect(hasPermission(regularUser, "artists", "update", { uploaderId: null })).toBe(false);
      expect(hasPermission(regularUser, "artists", "delete", { uploaderId: regularUserId })).toBe(
        true,
      );
      expect(hasPermission(regularUser, "artists", "delete", { uploaderId: null })).toBe(false);
    });

    it("manages playlists: restricts to own playlists and preserves favourites immutability", () => {
      const ownCustom = { userId: regularUserId, isFavourites: false };
      const ownFavourites = { userId: regularUserId, isFavourites: true };
      const otherCustom = { userId: otherUserId, isFavourites: false };
      const otherFavourites = { userId: otherUserId, isFavourites: true };

      expect(hasPermission(regularUser, "playlists", "create")).toBe(true);

      // Viewing
      expect(hasPermission(regularUser, "playlists", "view", ownCustom)).toBe(true);
      expect(hasPermission(regularUser, "playlists", "view", ownFavourites)).toBe(true);
      expect(hasPermission(regularUser, "playlists", "view", otherCustom)).toBe(false);
      expect(hasPermission(regularUser, "playlists", "view", otherFavourites)).toBe(false);

      // Updating / Renaming / Deleting
      expect(hasPermission(regularUser, "playlists", "update", ownCustom)).toBe(true);
      expect(hasPermission(regularUser, "playlists", "rename", ownCustom)).toBe(true);
      expect(hasPermission(regularUser, "playlists", "delete", ownCustom)).toBe(true);

      // Cannot rename or delete favourites
      expect(hasPermission(regularUser, "playlists", "rename", ownFavourites)).toBe(false);
      expect(hasPermission(regularUser, "playlists", "delete", ownFavourites)).toBe(false);

      // Cannot mutate other users' playlists
      expect(hasPermission(regularUser, "playlists", "update", otherCustom)).toBe(false);
      expect(hasPermission(regularUser, "playlists", "rename", otherCustom)).toBe(false);
      expect(hasPermission(regularUser, "playlists", "delete", otherCustom)).toBe(false);
    });
  });

  describe("hasPermission for global admin", () => {
    it("can delete any song", () => {
      expect(hasPermission(adminUser, "songs", "delete", { uploaderId: otherUserId })).toBe(true);
    });

    it("can update and delete any album", () => {
      expect(hasPermission(adminUser, "albums", "update", { uploaderId: otherUserId })).toBe(true);
      expect(hasPermission(adminUser, "albums", "delete", { uploaderId: otherUserId })).toBe(true);
    });

    it("can update and delete any artist, including orphaned artists", () => {
      expect(hasPermission(adminUser, "artists", "update", { uploaderId: otherUserId })).toBe(true);
      expect(hasPermission(adminUser, "artists", "update", { uploaderId: null })).toBe(true);
      expect(hasPermission(adminUser, "artists", "delete", { uploaderId: otherUserId })).toBe(true);
      expect(hasPermission(adminUser, "artists", "delete", { uploaderId: null })).toBe(true);
    });

    it("can view, update, rename, and delete any custom playlist", () => {
      const otherCustom = { userId: otherUserId, isFavourites: false };

      expect(hasPermission(adminUser, "playlists", "view", otherCustom)).toBe(true);
      expect(hasPermission(adminUser, "playlists", "update", otherCustom)).toBe(true);
      expect(hasPermission(adminUser, "playlists", "rename", otherCustom)).toBe(true);
      expect(hasPermission(adminUser, "playlists", "delete", otherCustom)).toBe(true);
    });

    it("strictly isolates personal favourites playlists even for admin", () => {
      const otherFavourites = { userId: otherUserId, isFavourites: true };
      const ownFavourites = { userId: adminId, isFavourites: true };

      // Cannot view, update, rename, or delete another user's favourites
      expect(hasPermission(adminUser, "playlists", "view", otherFavourites)).toBe(false);
      expect(hasPermission(adminUser, "playlists", "update", otherFavourites)).toBe(false);
      expect(hasPermission(adminUser, "playlists", "rename", otherFavourites)).toBe(false);
      expect(hasPermission(adminUser, "playlists", "delete", otherFavourites)).toBe(false);

      // Can view and update own favourites
      expect(hasPermission(adminUser, "playlists", "view", ownFavourites)).toBe(true);
      expect(hasPermission(adminUser, "playlists", "update", ownFavourites)).toBe(true);
      // But cannot rename or delete own favourites
      expect(hasPermission(adminUser, "playlists", "rename", ownFavourites)).toBe(false);
      expect(hasPermission(adminUser, "playlists", "delete", ownFavourites)).toBe(false);
    });
  });
});
