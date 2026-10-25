import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MobileBottomNav from "@/components/mobile-nav/mobile-bottom-nav";
import { ROUTES } from "@/config/routes";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => "/",
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

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("MobileBottomNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    mockUserDetails = null;
    mockIsAdmin = false;
    mockSignOut.mockResolvedValue({ error: null });
  });

  it("renders auth modal buttons when user is unauthenticated", () => {
    render(<MobileBottomNav />);

    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("does not render Admin button for unauthenticated users", () => {
    render(<MobileBottomNav />);

    expect(screen.queryByRole("button", { name: /admin/i })).not.toBeInTheDocument();
  });

  it("renders Account and Log out but NOT Admin for regular authenticated users", () => {
    mockUser = { id: "user-1", email: "user@example.com" };
    mockUserDetails = { full_name: "Normal User" };
    mockIsAdmin = false;

    render(<MobileBottomNav />);

    expect(screen.getByRole("button", { name: /account/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /admin/i })).not.toBeInTheDocument();
  });

  it("renders Admin button for global admin user and navigates to /admin", () => {
    mockUser = { id: "admin-1", email: "admin@example.com" };
    mockUserDetails = { full_name: "Admin User" };
    mockIsAdmin = true;

    render(<MobileBottomNav />);

    const adminBtn = screen.getByRole("button", { name: /admin/i });
    expect(adminBtn).toBeInTheDocument();

    fireEvent.click(adminBtn);
    expect(mockPush).toHaveBeenCalledWith(ROUTES.ADMIN.path);
  });
});
