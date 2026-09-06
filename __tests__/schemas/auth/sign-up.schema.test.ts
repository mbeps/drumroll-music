import { describe, expect, it } from "vitest";
import { SignUpSchema } from "@/schemas/auth/sign-up.schema";

describe("SignUpSchema", () => {
  it("parses valid credentials with an 8-char password", () => {
    expect(SignUpSchema.safeParse({ email: "a@b.com", password: "12345678" }).success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = SignUpSchema.safeParse({ email: "a@b.com", password: "1234567" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Password must be at least 8 characters");
  });

  it("rejects an invalid email", () => {
    expect(SignUpSchema.safeParse({ email: "bad", password: "12345678" }).success).toBe(false);
  });
});
