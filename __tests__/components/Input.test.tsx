import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Input from "@/components/Input";

describe("Input", () => {
  it("merges classes and applies disabled styles when disabled", () => {
    const { container, rerender } = render(
      <Input placeholder="name" className="custom" />
    );
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.className).toContain("custom");
    expect(input.className).not.toContain("opacity-75");

    rerender(
      <Input placeholder="name" className="custom" disabled data-testid="inp" />
    );
    const disabledInput = container.querySelector("input") as HTMLInputElement;
    expect(disabledInput.disabled).toBe(true);
    expect(disabledInput.className).toContain("opacity-75");
  });
});
