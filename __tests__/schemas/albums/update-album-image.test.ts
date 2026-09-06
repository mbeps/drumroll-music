import { describe, it, expect } from "vitest";
import { UpdateAlbumImageSchema } from "@/schemas/albums/update-album-image.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("UpdateAlbumImageSchema", () => {
  it("accepts a valid payload", () => {
    expect(
      UpdateAlbumImageSchema.safeParse({ albumId: UUID, imagePath: "covers/abc.jpg" }).success,
    ).toBe(true);
  });

  it("rejects an invalid album UUID", () => {
    expect(UpdateAlbumImageSchema.safeParse({ albumId: "bad", imagePath: "p" }).success).toBe(false);
  });

  it("rejects an empty imagePath", () => {
    expect(UpdateAlbumImageSchema.safeParse({ albumId: UUID, imagePath: "" }).success).toBe(false);
  });

  it("rejects a missing imagePath", () => {
    expect(UpdateAlbumImageSchema.safeParse({ albumId: UUID }).success).toBe(false);
  });
});
