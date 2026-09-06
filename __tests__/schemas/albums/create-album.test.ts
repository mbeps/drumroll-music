import { describe, expect, it } from "vitest";
import { CreateAlbumSchema } from "@/schemas/albums/create-album.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("CreateAlbumSchema", () => {
  it("accepts a valid payload", () => {
    const result = CreateAlbumSchema.safeParse({ title: "Abbey Road", artistId: UUID });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid artist UUID", () => {
    expect(CreateAlbumSchema.safeParse({ title: "T", artistId: "not-a-uuid" }).success).toBe(false);
  });

  it("rejects an empty title", () => {
    expect(CreateAlbumSchema.safeParse({ title: "", artistId: UUID }).success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(CreateAlbumSchema.safeParse({}).success).toBe(false);
    expect(CreateAlbumSchema.safeParse({ title: "T" }).success).toBe(false);
    expect(CreateAlbumSchema.safeParse({ artistId: UUID }).success).toBe(false);
  });
});
