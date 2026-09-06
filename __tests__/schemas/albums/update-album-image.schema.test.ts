import { describe, it, expect } from "vitest";
import { UpdateAlbumImageSchema } from "@/schemas/albums/update-album-image.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("UpdateAlbumImageSchema", () => {
  it("parses a valid payload", () => {
    expect(
      UpdateAlbumImageSchema.safeParse({ albumId: UUID, imagePath: "covers/x.jpg" })
        .success
    ).toBe(true);
  });

  it("rejects an empty image path", () => {
    const result = UpdateAlbumImageSchema.safeParse({ albumId: UUID, imagePath: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Image path is required");
  });

  it("rejects an invalid UUID", () => {
    expect(
      UpdateAlbumImageSchema.safeParse({ albumId: "bad", imagePath: "p" }).success
    ).toBe(false);
  });
});
