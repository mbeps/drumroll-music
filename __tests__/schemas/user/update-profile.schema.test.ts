import { describe, it, expect } from "vitest";
import { UpdateProfileSchema } from "@/schemas/user/update-profile.schema";

describe("UpdateProfileSchema", () => {
  it("accepts a valid full name", () => {
    const result = UpdateProfileSchema.safeParse({ fullName: "Maruf Bepary" });
    expect(result.success).toBe(true);
  });

  it("trims the name", () => {
    expect(UpdateProfileSchema.parse({ fullName: "  Maruf Bepary  " }).fullName).toBe("Maruf Bepary");
  });

  it("rejects empty and whitespace-only names", () => {
    expect(UpdateProfileSchema.safeParse({ fullName: "" }).success).toBe(false);
    expect(UpdateProfileSchema.safeParse({ fullName: "   " }).success).toBe(false);
  });

  it("rejects names over 100 characters", () => {
    expect(UpdateProfileSchema.safeParse({ fullName: "a".repeat(100) }).success).toBe(true);
    expect(UpdateProfileSchema.safeParse({ fullName: "a".repeat(101) }).success).toBe(false);
  });

  it("rejects missing fullName", () => {
    expect(UpdateProfileSchema.safeParse({}).success).toBe(false);
  });
});
