import { describe, it, expect } from "vitest";
import { PasskeyRenameSchema } from "@/schemas/auth/passkey-rename.schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("PasskeyRenameSchema", () => {
  it("parses a valid payload", () => {
    expect(PasskeyRenameSchema.safeParse({ passkeyId: UUID, newName: "MacBook" }).success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = PasskeyRenameSchema.safeParse({ passkeyId: UUID, newName: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Passkey name is required");
  });

  it("rejects a name over 50 characters", () => {
    const result = PasskeyRenameSchema.safeParse({
      passkeyId: UUID,
      newName: "x".repeat(51),
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe(
        "Passkey name must be 50 characters or fewer"
      );
  });

  it("accepts a name of exactly 50 characters and trims it", () => {
    const result = PasskeyRenameSchema.parse({
      passkeyId: UUID,
      newName: ` ${"x".repeat(50)} `,
    });
    expect(result.newName).toHaveLength(50);
  });
});
