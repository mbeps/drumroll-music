import { describe, it, expect } from "vitest";
import { albumTitleField } from "@/schemas/albums/album-title-field";

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
