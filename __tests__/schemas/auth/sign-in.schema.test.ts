import { describe, it, expect } from "vitest";
import { SignInSchema } from "@/schemas/auth/sign-in.schema";

describe("SignInSchema", () => {
  it("parses valid credentials", () => {
    expect(
      SignInSchema.safeParse({ email: "a@b.com", password: "secret" }).success
    ).toBe(true);
  });

  it("rejects an invalid email format", () => {
    const result = SignInSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Enter a valid email address");
  });

  it("rejects an empty password", () => {
    const result = SignInSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toBe("Password is required");
  });
});
