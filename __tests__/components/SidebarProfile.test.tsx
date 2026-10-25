import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SidebarProfile from "@/components/sidebar/sidebar-profile";
import { ROUTES } from "@/config/routes";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

let mockUser: { id: string; email?: string } | null = null;
let mockUserDetails: { full_name?: string; avatar_url?: string } | null = null;
let mockIsAdmin = false;

vi.mock("@/hooks/use-user", () => ({
  default: () => ({
    user: mockUser,
    userDetails: mockUserDetails,
    isAdmin: mockIsAdmin,
    isLoading: false,
    accessToken: "mock-token",
  }),
}));

const mockOnOpen = vi.fn();
vi.mock("@/hooks/use-auth-modal", () => ({
  default: () => ({
    onOpen: mockOnOpen,
  }),
}));

const mockSignOut = vi.fn();
vi.mock("@/providers/supabase-provider", () => ({
  useSupabaseClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("SidebarProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    mockUserDetails = null;
    mockIsAdmin = false;
    mockSignOut.mockResolvedValue({ error: null });
  });

  describe("Unauthenticated user", () => {
    it("renders sign up and log in buttons", () => {
      render(<SidebarProfile />);

      const signUpBtn = screen.getByRole("button", { name: /sign up/i });
      const logInBtn = screen.getByRole("button", { name: /log in/i });

      expect(signUpBtn).toBeInTheDocument();
      expect(logInBtn).toBeInTheDocument();

      fireEvent.click(signUpBtn);
      expect(mockOnOpen).toHaveBeenCalledTimes(1);

      fireEvent.click(logInBtn);
      expect(mockOnOpen).toHaveBeenCalledTimes(2);
    });

    it("does not render dropdown menu items when unauthenticated", () => {
      render(<SidebarProfile />);

      expect(screen.queryByRole("button", { name: /account/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /admin/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /log out/i })).not.toBeInTheDocument();
    });
  });

  describe("Authenticated regular user (non-admin)", () => {
    beforeEach(() => {
      mockUser = { id: "user-123", email: "user@example.com" };
      mockUserDetails = { full_name: "Normal User" };
      mockIsAdmin = false;
    });

    it("renders user information and Account and Log out options", () => {
      render(<SidebarProfile />);

      expect(screen.getByText("Normal User")).toBeInTheDocument();
      expect(screen.getByText("user@example.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /account/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
    });

    it("does NOT show Admin option for regular user", () => {
      render(<SidebarProfile />);

      expect(screen.queryByRole("button", { name: /admin/i })).not.toBeInTheDocument();
    });

    it("navigates to account page when clicking Account", () => {
      render(<SidebarProfile />);

      fireEvent.click(screen.getByRole("button", { name: /account/i }));
      expect(mockPush).toHaveBeenCalledWith(ROUTES.ACCOUNT.path);
    });

    it("signs out and refreshes when clicking Log out", async () => {
      render(<SidebarProfile />);

      fireEvent.click(screen.getByRole("button", { name: /log out/i }));
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe("Authenticated global admin user", () => {
    beforeEach(() => {
      mockUser = { id: "admin-456", email: "admin@example.com" };
      mockUserDetails = { full_name: "Admin User" };
      mockIsAdmin = true;
    });

    it("shows Admin option in dropdown for global admin", () => {
      render(<SidebarProfile />);

      expect(screen.getByRole("button", { name: /admin/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /account/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
    });

    it("navigates to /admin when clicking Admin option", () => {
      render(<SidebarProfile />);

      fireEvent.click(screen.getByRole("button", { name: /admin/i }));
      expect(mockPush).toHaveBeenCalledWith(ROUTES.ADMIN.path);
    });
  });
});
