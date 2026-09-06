import { describe, it, expect } from "vitest";
import { ReorderPlaylistSongsSchema } from "@/schemas/playlists/reorder-playlist-songs.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("ReorderPlaylistSongsSchema", () => {
  it("parses a valid ordered list of song IDs", () => {
    expect(
      ReorderPlaylistSongsSchema.safeParse({ playlistId: UUID, songIds: [3, 1, 2] })
        .success
    ).toBe(true);
  });

  it("rejects an empty array", () => {
    const result = ReorderPlaylistSongsSchema.safeParse({
      playlistId: UUID,
      songIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("At least one song ID is required");
  });

  it("rejects a non-positive song ID in the array", () => {
    const result = ReorderPlaylistSongsSchema.safeParse({
      playlistId: UUID,
      songIds: [1, -2],
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Invalid song ID");
  });

  it("rejects an invalid playlist UUID", () => {
    expect(
      ReorderPlaylistSongsSchema.safeParse({ playlistId: "x", songIds: [1] }).success
    ).toBe(false);
  });
});
