import { describe, expect, it } from "vitest";
import { albumTitleField } from "@/schemas/album/album-title-field.schema";

describe("albumTitleField", () => {
  it("accepts a normal title", () => {
    expect(albumTitleField.safeParse("Revolver").success).toBe(true);
  });

  it("rejects whitespace-only input", () => {
    expect(albumTitleField.safeParse("   ").success).toBe(false);
  });

  it("rejects over 200 characters", () => {
    expect(albumTitleField.safeParse("x".repeat(201)).success).toBe(false);
  });

  it("trims the value", () => {
    expect(albumTitleField.parse("  trimmed  ")).toBe("trimmed");
  });
});
