import { describe, expect, it } from "vitest";
import { CreatePlaylistSchema } from "@/schemas/playlist/create-playlist.schema";
import { playlistTitleField } from "@/schemas/playlist/playlist-title-field.schema";

describe("CreatePlaylistSchema", () => {
  it("parses a valid title", () => {
    expect(CreatePlaylistSchema.safeParse({ title: "Chill Mix" }).success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = CreatePlaylistSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Playlist name is required");
  });

  it("rejects a title over 100 characters", () => {
    const result = CreatePlaylistSchema.safeParse({ title: "x".repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Playlist name must be 100 characters or fewer");
  });
});

describe("playlistTitleField", () => {
  it("trims the value", () => {
    expect(playlistTitleField.parse("  Focus  ")).toBe("Focus");
  });

  it("rejects whitespace-only input", () => {
    expect(playlistTitleField.safeParse("   ").success).toBe(false);
  });
});
