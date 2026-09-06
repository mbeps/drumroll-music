import { describe, it, expect } from "vitest";
import { DeleteAlbumSchema } from "@/schemas/albums/delete-album.schema";

describe("DeleteAlbumSchema", () => {
  it("accepts a valid album UUID", () => {
    expect(
      DeleteAlbumSchema.safeParse({ albumId: "123e4567-e89b-12d3-a456-426614174000" }).success,
    ).toBe(true);
  });

  it("rejects invalid UUIDs", () => {
    expect(DeleteAlbumSchema.safeParse({ albumId: "not-a-uuid" }).success).toBe(false);
    expect(DeleteAlbumSchema.safeParse({ albumId: "" }).success).toBe(false);
  });

  it("rejects a missing albumId", () => {
    expect(DeleteAlbumSchema.safeParse({}).success).toBe(false);
  });
});
