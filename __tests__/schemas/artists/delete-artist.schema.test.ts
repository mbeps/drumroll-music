import { describe, it, expect } from "vitest";
import { DeleteArtistSchema } from "@/schemas/artists/delete-artist.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("DeleteArtistSchema", () => {
  it("parses a valid UUID", () => {
    expect(DeleteArtistSchema.safeParse({ artistId: UUID }).success).toBe(true);
  });

  it("rejects an invalid UUID", () => {
    const result = DeleteArtistSchema.safeParse({ artistId: "abc" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Invalid artist ID");
  });
});
