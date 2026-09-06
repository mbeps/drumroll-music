import { describe, expect, it } from "vitest";
import { CreateAlbumSchema } from "@/schemas/albums/create-album.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("CreateAlbumSchema", () => {
  it("parses a valid payload", () => {
    expect(CreateAlbumSchema.safeParse({ title: "Abbey Road", artistId: UUID }).success).toBe(true);
  });

  it("rejects an invalid artist UUID", () => {
    const result = CreateAlbumSchema.safeParse({ title: "T", artistId: "nope" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Please select a valid artist");
  });

  it("rejects a missing title", () => {
    const result = CreateAlbumSchema.safeParse({ artistId: UUID });
    expect(result.success).toBe(false);
  });
});
