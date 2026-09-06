import { describe, expect, it } from "vitest";
import { RenamePlaylistSchema } from "@/schemas/playlists/rename-playlist.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("RenamePlaylistSchema", () => {
  it("parses a valid payload", () => {
    expect(
      RenamePlaylistSchema.safeParse({ playlistId: UUID, newTitle: "Road Trip" }).success,
    ).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = RenamePlaylistSchema.safeParse({ playlistId: UUID, newTitle: " " });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Playlist name is required");
  });

  it("rejects a title over 100 characters", () => {
    expect(
      RenamePlaylistSchema.safeParse({ playlistId: UUID, newTitle: "x".repeat(101) }).success,
    ).toBe(false);
  });

  it("rejects an invalid UUID", () => {
    expect(RenamePlaylistSchema.safeParse({ playlistId: "x", newTitle: "A" }).success).toBe(false);
  });
});
