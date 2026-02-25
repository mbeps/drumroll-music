import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "@/components/Header";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => null,
}));

describe("Header", () => {
  it("renders the heading when the heading prop is provided", () => {
    render(<Header heading="Welcome back" />);
    const heading = screen.getByRole("heading", { name: "Welcome back" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("text-foreground", "text-3xl", "font-semibold");
  });

  it("does not render a heading when the heading prop is omitted", () => {
    render(<Header />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders children alongside the heading", () => {
    render(<Header heading="Search"><p>child content</p></Header>);
    expect(screen.getByRole("heading", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
  });
});
