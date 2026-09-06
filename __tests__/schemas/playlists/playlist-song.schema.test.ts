import { describe, expect, it } from "vitest";
import { PlaylistSongSchema } from "@/schemas/playlists/playlist-song.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("PlaylistSongSchema", () => {
  it("parses a valid payload", () => {
    expect(PlaylistSongSchema.safeParse({ playlistId: UUID, songId: 1 }).success).toBe(true);
  });

  it("rejects an invalid playlist UUID", () => {
    const result = PlaylistSongSchema.safeParse({ playlistId: "bad", songId: 1 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Invalid playlist ID");
  });

  it("rejects a zero song ID", () => {
    const result = PlaylistSongSchema.safeParse({ playlistId: UUID, songId: 0 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Invalid song ID");
  });

  it("rejects a negative song ID", () => {
    expect(PlaylistSongSchema.safeParse({ playlistId: UUID, songId: -3 }).success).toBe(false);
  });

  it("rejects a non-integer song ID", () => {
    expect(PlaylistSongSchema.safeParse({ playlistId: UUID, songId: 1.5 }).success).toBe(false);
  });
});
