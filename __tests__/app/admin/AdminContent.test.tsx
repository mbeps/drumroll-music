import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminContent from "@/app/admin/_components/admin-content";
import type { Artist } from "@/types/artist/artist";
import type { AlbumWithArtists } from "@/types/music/album-with-artists";
import type { SongWithAlbum } from "@/types/music/song-with-album";
import type { Playlist } from "@/types/playlist/playlist";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const TabsContext = React.createContext<{
  value: string;
  onValueChange?: (val: string) => void;
}>({ value: "songs" });

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({
    value = "songs",
    onValueChange,
    children,
  }: {
    value?: string;
    onValueChange?: (val: string) => void;
    children: React.ReactNode;
  }) => (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div data-slot="tabs">{children}</div>
    </TabsContext.Provider>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-slot="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ value, children }: { value: string; children: React.ReactNode }) => {
    const { onValueChange } = React.useContext(TabsContext);
    return (
      <button type="button" role="tab" onClick={() => onValueChange?.(value)}>
        {children}
      </button>
    );
  },
  TabsContent: ({ value, children }: { value: string; children: React.ReactNode }) => {
    const { value: activeValue } = React.useContext(TabsContext);
    return activeValue === value ? <div>{children}</div> : null;
  },
}));

const mockDeleteSong = vi.fn();
vi.mock("@/actions/song/delete-song", () => ({
  default: (id: number) => mockDeleteSong(id),
}));

const mockDeleteAlbum = vi.fn();
vi.mock("@/actions/album/delete-album", () => ({
  default: (id: string) => mockDeleteAlbum(id),
}));

const mockDeleteArtist = vi.fn();
vi.mock("@/actions/artist/delete-artist", () => ({
  default: (id: string) => mockDeleteArtist(id),
}));

const mockDeletePlaylist = vi.fn();
vi.mock("@/actions/playlist/delete-playlist", () => ({
  default: (id: string) => mockDeletePlaylist(id),
}));

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

describe("AdminContent", () => {
  const mockUser = {
    id: "admin-123",
    email: "admin@drumroll.test",
  };

  const mockStorage = {
    userUsage: 100 * 1024 * 1024,
    userLimit: 1024 * 1024 * 1024,
    globalUsage: 5 * 1024 * 1024 * 1024, // 5GB
    globalLimit: 50 * 1024 * 1024 * 1024, // 50GB
  };

  const mockArtists: Artist[] = [
    {
      id: "artist-1",
      name: "Daft Punk",
      imageUrl: null,
      uploaderId: "admin-123",
    },
    {
      id: "artist-2",
      name: "Radiohead",
      imageUrl: null,
      uploaderId: "user-456",
    },
  ];

  const mockAlbums: AlbumWithArtists[] = [
    {
      id: "album-1",
      title: "Discovery",
      albumType: "album",
      releaseDate: "2001-03-12",
      coverImagePath: "covers/discovery.jpg",
      uploaderId: "admin-123",
      createdAt: "2026-01-01T00:00:00Z",
      artists: [mockArtists[0]],
    },
    {
      id: "album-2",
      title: "OK Computer",
      albumType: "album",
      releaseDate: "1997-05-21",
      coverImagePath: null,
      uploaderId: "user-456",
      createdAt: "2026-01-02T00:00:00Z",
      artists: [mockArtists[1]],
    },
  ];

  const mockSongs: SongWithAlbum[] = [
    {
      id: 101,
      title: "One More Time",
      songPath: "songs/one_more_time.mp3",
      albumId: "album-1",
      trackNumber: 1,
      uploaderId: "admin-123",
      createdAt: "2026-01-01T00:00:00Z",
      album: mockAlbums[0],
    },
    {
      id: 102,
      title: "Paranoid Android",
      songPath: "songs/paranoid_android.mp3",
      albumId: "album-2",
      trackNumber: 2,
      uploaderId: "user-456",
      createdAt: "2026-01-02T00:00:00Z",
      album: mockAlbums[1],
    },
  ];

  const mockPlaylists: Playlist[] = [
    {
      id: "playlist-1",
      title: "Electronic Classics",
      userId: "user-456",
      isFavourites: false,
      createdAt: "2026-01-03T00:00:00Z",
    },
    {
      id: "playlist-2",
      title: "Rock Essentials",
      userId: "user-789",
      isFavourites: false,
      createdAt: "2026-01-04T00:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteSong.mockResolvedValue({ ok: true });
    mockDeleteAlbum.mockResolvedValue({ ok: true });
    mockDeleteArtist.mockResolvedValue({ ok: true });
    mockDeletePlaylist.mockResolvedValue({ ok: true });
  });

  it("renders overview stats and storage capacity without Global Admin Active badge", () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    expect(screen.getByText("System Overview")).toBeInTheDocument();
    expect(screen.getByText("Logged in as admin@drumroll.test")).toBeInTheDocument();
    expect(screen.queryByText("Global Admin Active")).not.toBeInTheDocument();

    expect(screen.getByText("Total Songs")).toBeInTheDocument();
    expect(screen.getByText("Total Albums")).toBeInTheDocument();
    expect(screen.getByText("Total Artists")).toBeInTheDocument();
    expect(screen.getByText("Custom Playlists")).toBeInTheDocument();

    expect(screen.getByText("Global Storage Capacity")).toBeInTheDocument();
    expect(screen.getByText(/Used: 5.00 GB/)).toBeInTheDocument();
    expect(screen.getByText(/Capacity: 50.00 GB/)).toBeInTheDocument();
  });

  it("filters songs by title, album, or artist name", () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    expect(screen.getByText("One More Time")).toBeInTheDocument();
    expect(screen.getByText("Paranoid Android")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Filter songs by title or artist...");
    fireEvent.change(searchInput, { target: { value: "Radiohead" } });

    expect(screen.queryByText("One More Time")).not.toBeInTheDocument();
    expect(screen.getByText("Paranoid Android")).toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 2")).toBeInTheDocument();
  });

  it("switches to Albums tab and filters albums", () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    const albumsTab = screen.getByRole("tab", { name: /albums/i });
    fireEvent.click(albumsTab);

    expect(screen.getByText("Discovery")).toBeInTheDocument();
    expect(screen.getByText("OK Computer")).toBeInTheDocument();

    const albumInput = screen.getByPlaceholderText("Filter albums by title or artist...");
    fireEvent.change(albumInput, { target: { value: "Discovery" } });

    expect(screen.getByText("Discovery")).toBeInTheDocument();
    expect(screen.queryByText("OK Computer")).not.toBeInTheDocument();
  });

  it("switches to Artists tab and filters artists", () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    const artistsTab = screen.getByRole("tab", { name: /artists/i });
    fireEvent.click(artistsTab);

    expect(screen.getByText("Daft Punk")).toBeInTheDocument();
    expect(screen.getByText("Radiohead")).toBeInTheDocument();

    const artistInput = screen.getByPlaceholderText("Filter artists by name...");
    fireEvent.change(artistInput, { target: { value: "Daft" } });

    expect(screen.getByText("Daft Punk")).toBeInTheDocument();
    expect(screen.queryByText("Radiohead")).not.toBeInTheDocument();
  });

  it("switches to Playlists tab and filters playlists", () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    const playlistsTab = screen.getByRole("tab", { name: /playlists/i });
    fireEvent.click(playlistsTab);

    expect(screen.getByText("Electronic Classics")).toBeInTheDocument();
    expect(screen.getByText("Rock Essentials")).toBeInTheDocument();

    const playlistInput = screen.getByPlaceholderText("Filter playlists by title...");
    fireEvent.change(playlistInput, { target: { value: "Electronic" } });

    expect(screen.getByText("Electronic Classics")).toBeInTheDocument();
    expect(screen.queryByText("Rock Essentials")).not.toBeInTheDocument();
  });

  it("switches to Storage tab and displays quota limits breakdown", () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    const storageTab = screen.getByRole("tab", { name: /storage & quotas/i });
    fireEvent.click(storageTab);

    expect(screen.getByText("Storage Quotas & Upload Limits")).toBeInTheDocument();
    expect(screen.getByText("Song Audio File")).toBeInTheDocument();
    expect(screen.getByText("Album Cover Image")).toBeInTheDocument();
    expect(screen.getByText("Artist Profile Image")).toBeInTheDocument();
    expect(screen.getByText("User Avatar Image")).toBeInTheDocument();
  });

  it("opens delete dialog on song delete click, cancels cleanly without deletion", () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /delete song one more time/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByRole("heading", { name: "Confirm Deletion" })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the song/)).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /^cancel$/i });
    fireEvent.click(cancelBtn);

    expect(mockDeleteSong).not.toHaveBeenCalled();
  });

  it("deletes a song, updates local list, and triggers success toast", async () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /delete song one more time/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteSong).toHaveBeenCalledWith(101);
      expect(mockToastSuccess).toHaveBeenCalledWith('Deleted song "One More Time"');
      expect(mockRefresh).toHaveBeenCalled();
    });

    expect(screen.queryByText("One More Time")).not.toBeInTheDocument();
    expect(screen.getByText("Paranoid Android")).toBeInTheDocument();
  });

  it("deletes an album upon confirmation in Albums tab", async () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: /albums/i }));

    const deleteBtn = screen.getByRole("button", { name: /delete album discovery/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteAlbum).toHaveBeenCalledWith("album-1");
      expect(mockToastSuccess).toHaveBeenCalledWith('Deleted album "Discovery"');
    });

    expect(screen.queryByText("Discovery")).not.toBeInTheDocument();
  });

  it("deletes an artist upon confirmation in Artists tab", async () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: /artists/i }));

    const deleteBtn = screen.getByRole("button", { name: /delete artist daft punk/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteArtist).toHaveBeenCalledWith("artist-1");
      expect(mockToastSuccess).toHaveBeenCalledWith('Deleted artist "Daft Punk"');
    });

    expect(screen.queryByText("Daft Punk")).not.toBeInTheDocument();
  });

  it("deletes a playlist upon confirmation in Playlists tab", async () => {
    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: /playlists/i }));

    const deleteBtn = screen.getByRole("button", { name: /delete playlist electronic classics/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeletePlaylist).toHaveBeenCalledWith("playlist-1");
      expect(mockToastSuccess).toHaveBeenCalledWith('Deleted playlist "Electronic Classics"');
    });

    expect(screen.queryByText("Electronic Classics")).not.toBeInTheDocument();
  });

  it("handles deletion errors and displays error toast", async () => {
    mockDeleteSong.mockResolvedValueOnce({ ok: false, error: "Database lock error" });

    render(
      <AdminContent
        user={mockUser}
        storage={mockStorage}
        songs={mockSongs}
        albums={mockAlbums}
        artists={mockArtists}
        playlists={mockPlaylists}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /delete song one more time/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Database lock error");
    });

    // Item should still be present in the table
    expect(screen.getByText("One More Time")).toBeInTheDocument();
  });
});
