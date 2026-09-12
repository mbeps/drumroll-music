import { describe, expect, it } from "vitest";
import { DeletePlaylistSchema } from "@/schemas/playlist/delete-playlist.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("DeletePlaylistSchema", () => {
  it("parses a valid UUID", () => {
    expect(DeletePlaylistSchema.safeParse({ playlistId: UUID }).success).toBe(true);
  });

  it("rejects an invalid UUID", () => {
    const result = DeletePlaylistSchema.safeParse({ playlistId: "xyz" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Invalid playlist ID");
  });
});
