import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("merges classes and applies disabled styles when disabled", () => {
    const { getByRole } = render(<Input disabled className="custom-class" />);
    const inputElement = getByRole("textbox");
    expect(inputElement).toHaveClass("custom-class");
  });

  it("passes props correctly to disabled input", () => {
    const { container } = render(<Input disabled className="custom" />);
    const disabledInput = container.querySelector("input") as HTMLInputElement;
    expect(disabledInput.disabled).toBe(true);
    expect(disabledInput.className).toContain("opacity-50");
  });
});
