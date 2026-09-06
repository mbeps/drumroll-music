import { describe, it, expect } from "vitest";
import { ForgotPasswordSchema } from "@/schemas/auth/forgot-password.schema";

describe("ForgotPasswordSchema", () => {
  it("parses a valid email", () => {
    expect(ForgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(
      true
    );
  });

  it("rejects an invalid email", () => {
    const result = ForgotPasswordSchema.safeParse({ email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Enter a valid email address");
  });
});
