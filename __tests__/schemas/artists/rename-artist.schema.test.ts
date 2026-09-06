import { describe, it, expect } from "vitest";
import { RenameArtistSchema } from "@/schemas/artists/rename-artist.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("RenameArtistSchema", () => {
  it("parses a valid payload", () => {
    expect(
      RenameArtistSchema.safeParse({ artistId: UUID, newName: "Beyoncé" }).success
    ).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = RenameArtistSchema.safeParse({ artistId: UUID, newName: "  " });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Artist name is required");
  });

  it("rejects a name over 200 characters", () => {
    expect(
      RenameArtistSchema.safeParse({ artistId: UUID, newName: "x".repeat(201) })
        .success
    ).toBe(false);
  });

  it("rejects an invalid UUID", () => {
    expect(RenameArtistSchema.safeParse({ artistId: "x", newName: "A" }).success).toBe(
      false
    );
  });
});
