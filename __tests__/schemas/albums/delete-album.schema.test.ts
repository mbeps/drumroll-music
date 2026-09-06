import { describe, it, expect } from "vitest";
import { DeleteAlbumSchema } from "@/schemas/albums/delete-album.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("DeleteAlbumSchema", () => {
  it("parses a valid UUID", () => {
    expect(DeleteAlbumSchema.safeParse({ albumId: UUID }).success).toBe(true);
  });

  it("rejects an invalid UUID", () => {
    const result = DeleteAlbumSchema.safeParse({ albumId: "not-a-uuid" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Invalid album ID");
  });
});
