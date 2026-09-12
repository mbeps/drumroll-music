import { describe, expect, it } from "vitest";
import { artistNameField } from "@/schemas/artist/artist-name-field.schema";
import { CreateArtistSchema } from "@/schemas/artist/create-artist.schema";

describe("CreateArtistSchema", () => {
  it("parses a valid name", () => {
    expect(CreateArtistSchema.safeParse({ name: "Daft Punk" }).success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = CreateArtistSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Artist name is required");
  });

  it("rejects a name over 200 characters", () => {
    expect(CreateArtistSchema.safeParse({ name: "x".repeat(201) }).success).toBe(false);
  });
});

describe("artistNameField", () => {
  it("trims the value", () => {
    expect(artistNameField.parse("  ABBA  ")).toBe("ABBA");
  });

  it("rejects whitespace-only input", () => {
    expect(artistNameField.safeParse("   ").success).toBe(false);
  });
});
