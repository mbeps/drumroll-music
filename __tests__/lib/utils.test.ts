import { describe, it, expect } from "vitest";
import { cn, formatArtists, getInitials } from "@/lib/utils";
import { createMockAlbumWithArtists, createMockArtist } from "../helpers/mockData";

describe("lib/utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("a", "b")).toBe("a b");
      expect(cn("a", { b: true, c: false })).toBe("a b");
      expect(cn("p-4", "p-2")).toBe("p-2"); // Tailwind merge
    });
  });

  describe("formatArtists", () => {
    it('should return "Unknown Artist" when no artists are present', () => {
      const album = createMockAlbumWithArtists({ artists: [] });
      expect(formatArtists(album)).toBe("Unknown Artist");
    });

    it("should format a single artist correctly", () => {
      const album = createMockAlbumWithArtists({
        artists: [createMockArtist({ name: "Artist One" })],
      });
      expect(formatArtists(album)).toBe("Artist One");
    });

    it("should format multiple artists correctly", () => {
      const album = createMockAlbumWithArtists({
        artists: [
          createMockArtist({ name: "Artist One" }),
          createMockArtist({ name: "Artist Two" }),
        ],
      });
      expect(formatArtists(album)).toBe("Artist One, Artist Two");
    });
  });

  describe("getInitials", () => {
    it("should return the first two characters of the first two names", () => {
      expect(getInitials("John Doe")).toBe("JD");
    });

    it("should handle single names by returning the first character", () => {
      expect(getInitials("John")).toBe("J");
    });

    it("should handle more than two names by returning only the first two initials", () => {
      expect(getInitials("John Doe Smith")).toBe("JD");
    });

    it("should handle empty strings by returning an empty string", () => {
      expect(getInitials("")).toBe("");
    });
  });
});
