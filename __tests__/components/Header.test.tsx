import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Header from "@/components/Header";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => <div data-testid="sidebar-trigger" />,
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    render(
      <Header heading="Search">
        <p>child content</p>
      </Header>
    );
    expect(screen.getByRole("heading", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("navigates to home when home button is clicked (mobile)", () => {
    render(<Header />);
    const homeButton = screen.getAllByRole("button")[0]; // First button in flex md:hidden
    fireEvent.click(homeButton);
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("navigates to search when search button is clicked (mobile)", () => {
    render(<Header />);
    const searchButton = screen.getAllByRole("button")[1]; // Second button in flex md:hidden
    fireEvent.click(searchButton);
    expect(pushMock).toHaveBeenCalledWith("/search");
  });
});
