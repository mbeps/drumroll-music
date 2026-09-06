import { describe, expect, it } from "vitest";
import { ChangePasswordSchema } from "@/schemas/user/change-password.schema";

const BASE = { currentPassword: "oldpass1", newPassword: "newpass123" };

describe("ChangePasswordSchema", () => {
  it("accepts matching passwords", () => {
    expect(ChangePasswordSchema.safeParse({ ...BASE, confirmPassword: "newpass123" }).success).toBe(
      true,
    );
  });

  it("rejects mismatched confirmation with error on confirmPassword field", () => {
    const result = ChangePasswordSchema.safeParse({ ...BASE, confirmPassword: "different" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toEqual(
      expect.objectContaining({ message: "Passwords do not match", path: ["confirmPassword"] }),
    );
  });

  it("rejects empty confirmation", () => {
    const result = ChangePasswordSchema.safeParse({ ...BASE, confirmPassword: "" });
    expect(result.error?.issues[0].message).toBe("Please confirm your new password");
  });

  it("inherits newPassword min length from UpdatePasswordSchema", () => {
    const result = ChangePasswordSchema.safeParse({
      currentPassword: "old",
      newPassword: "short",
      confirmPassword: "short",
    });
    expect(result.error?.issues[0].message).toBe("New password must be at least 8 characters");
  });

  it("rejects missing fields", () => {
    expect(ChangePasswordSchema.safeParse({}).success).toBe(false);
  });
});
