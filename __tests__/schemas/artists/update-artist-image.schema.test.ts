import { describe, it, expect } from "vitest";
import { UpdateArtistImageSchema } from "@/schemas/artists/update-artist-image.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("UpdateArtistImageSchema", () => {
  it("parses a valid payload", () => {
    expect(
      UpdateArtistImageSchema.safeParse({
        artistId: UUID,
        imagePath: "artists/x.jpg",
      }).success
    ).toBe(true);
  });

  it("rejects an empty image path", () => {
    const result = UpdateArtistImageSchema.safeParse({
      artistId: UUID,
      imagePath: "",
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Image path is required");
  });

  it("rejects an invalid UUID", () => {
    expect(
      UpdateArtistImageSchema.safeParse({ artistId: "bad", imagePath: "p" }).success
    ).toBe(false);
  });
});
