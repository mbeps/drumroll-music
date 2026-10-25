import { render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "@/app/admin/page";
import { ROUTES } from "@/config/routes";

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    mockRedirect(path);
    throw new Error(`NEXT_REDIRECT:${path}`);
  },
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const mockGetUser = vi.fn();
const mockRpc = vi.fn();
const mockSupabase = {
  auth: { getUser: mockGetUser },
  rpc: mockRpc,
};

vi.mock("@/utils/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => mockSupabase),
}));

const mockIsAdmin = vi.fn();
vi.mock("@/lib/auth/permissions", () => ({
  isAdmin: (...args: unknown[]) => mockIsAdmin(...args),
}));

const mockGetStorageUsage = vi.fn();
vi.mock("@/actions/storage/get-storage-usage", () => ({
  default: () => mockGetStorageUsage(),
}));

const mockGetSongs = vi.fn();
vi.mock("@/actions/song/get-songs", () => ({
  default: () => mockGetSongs(),
}));

const mockGetAlbums = vi.fn();
vi.mock("@/actions/album/get-albums", () => ({
  default: () => mockGetAlbums(),
}));

const mockGetArtists = vi.fn();
vi.mock("@/actions/artist/get-artists", () => ({
  default: () => mockGetArtists(),
}));

const mockGetPlaylists = vi.fn();
vi.mock("@/actions/playlist/get-playlists", () => ({
  default: () => mockGetPlaylists(),
}));

vi.mock("@/components/header", () => ({
  default: ({ heading }: { heading?: string }) => <h1>{heading}</h1>,
}));

vi.mock("@/app/admin/_components/admin-content", () => ({
  default: ({ songs, albums }: { songs: unknown[]; albums: unknown[] }) => (
    <div data-testid="admin-content">
      <span>Admin Content Loaded</span>
      <span>Songs Count: {songs.length}</span>
      <span>Albums Count: {albums.length}</span>
    </div>
  ),
}));

describe("AdminPage (Server Component)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetStorageUsage.mockResolvedValue({
      userUsage: 100,
      userLimit: 1000,
      globalUsage: 500,
      globalLimit: 50000,
    });
    mockGetSongs.mockResolvedValue([{ id: 1, title: "Test Song" }]);
    mockGetAlbums.mockResolvedValue([{ id: "a1", title: "Test Album" }]);
    mockGetArtists.mockResolvedValue([{ id: "art1", name: "Test Artist" }]);
    mockGetPlaylists.mockResolvedValue([{ id: "p1", title: "Test Playlist" }]);
  });

  it("redirects unauthenticated users to the home route", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(AdminPage()).rejects.toThrow(`NEXT_REDIRECT:${ROUTES.HOME.path}`);

    expect(mockRedirect).toHaveBeenCalledWith(ROUTES.HOME.path);
    expect(mockGetStorageUsage).not.toHaveBeenCalled();
  });

  it("redirects authenticated non-admin users to home route when both env and db rpc deny", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "regular-user-id", email: "user@example.com" } },
      error: null,
    });
    mockIsAdmin.mockReturnValue(false);
    mockRpc.mockResolvedValue({ data: false, error: null });

    await expect(AdminPage()).rejects.toThrow(`NEXT_REDIRECT:${ROUTES.HOME.path}`);

    expect(mockRedirect).toHaveBeenCalledWith(ROUTES.HOME.path);
    expect(mockGetStorageUsage).not.toHaveBeenCalled();
  });

  it("permits access and loads data when user is recognized as admin via env", async () => {
    const adminUser = { id: "admin-user-id", email: "admin@example.com" };
    mockGetUser.mockResolvedValue({
      data: { user: adminUser },
      error: null,
    });
    mockIsAdmin.mockReturnValue(true);

    const jsx = await AdminPage();
    render(jsx as React.ReactElement);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockGetStorageUsage).toHaveBeenCalled();
    expect(mockGetSongs).toHaveBeenCalled();
    expect(mockGetAlbums).toHaveBeenCalled();
    expect(mockGetArtists).toHaveBeenCalled();
    expect(mockGetPlaylists).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Admin Dashboard" })).toBeInTheDocument();
    expect(screen.getByTestId("admin-content")).toBeInTheDocument();
    expect(screen.getByText("Songs Count: 1")).toBeInTheDocument();
  });

  it("permits access via database RPC fallback when static env check is false", async () => {
    const adminUser = { id: "vault-admin-user-id", email: "vaultadmin@example.com" };
    mockGetUser.mockResolvedValue({
      data: { user: adminUser },
      error: null,
    });
    mockIsAdmin.mockReturnValue(false);
    mockRpc.mockResolvedValue({ data: true, error: null });

    const jsx = await AdminPage();
    render(jsx as React.ReactElement);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockRpc).toHaveBeenCalledWith("is_admin");
    expect(screen.getByRole("heading", { name: "Admin Dashboard" })).toBeInTheDocument();
    expect(screen.getByTestId("admin-content")).toBeInTheDocument();
  });
});
