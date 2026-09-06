import { describe, expect, it } from "vitest";
import { UpdatePasswordSchema } from "@/schemas/user/update-password.schema";

describe("UpdatePasswordSchema", () => {
  it("accepts valid passwords", () => {
    expect(
      UpdatePasswordSchema.safeParse({ currentPassword: "oldpass1", newPassword: "newpass123" })
        .success,
    ).toBe(true);
  });

  it("rejects missing current password", () => {
    const result = UpdatePasswordSchema.safeParse({
      currentPassword: "",
      newPassword: "newpass123",
    });
    expect(result.error?.issues[0].message).toBe("Current password is required");
  });

  it("rejects new password under 8 characters", () => {
    const result = UpdatePasswordSchema.safeParse({ currentPassword: "old", newPassword: "short" });
    expect(result.error?.issues[0].message).toBe("New password must be at least 8 characters");
  });

  it("accepts an 8-character new password boundary", () => {
    expect(
      UpdatePasswordSchema.safeParse({ currentPassword: "old", newPassword: "12345678" }).success,
    ).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(UpdatePasswordSchema.safeParse({}).success).toBe(false);
  });
});
