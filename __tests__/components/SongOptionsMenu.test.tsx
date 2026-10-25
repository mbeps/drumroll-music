import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockSongWithAlbum } from "@/__tests__/helpers/mockData";
import SongOptionsMenu from "@/components/song/song-options-menu";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockDeleteSong = vi.fn();
vi.mock("@/actions/song/delete-song", () => ({
  default: (...args: unknown[]) => mockDeleteSong(...args),
}));

let mockUser: { id: string; isAdmin?: boolean } | null = null;
vi.mock("@/hooks/use-user", () => ({
  default: () => ({
    user: mockUser,
    isLoading: false,
    accessToken: "mock-token",
    userDetails: null,
    isAdmin: mockUser?.isAdmin ?? false,
  }),
}));

let mockIsMobile = false;
vi.mock("@/hooks/use-mobile", () => ({
  default: () => mockIsMobile,
}));

let mockIsFavourite = false;
const mockToggleFavourite = vi.fn();
vi.mock("@/hooks/use-favourite", () => ({
  default: () => ({
    isFavourite: mockIsFavourite,
    toggleFavourite: mockToggleFavourite,
  }),
}));

const mockAddToPlaylist = vi.fn();
const mockCreateAndAdd = vi.fn();
let mockPlaylists = [{ id: "pl-1", title: "My Rock", userId: "user-1", isFavourites: false }];
vi.mock("@/hooks/use-add-to-playlist", () => ({
  default: () => ({
    playlists: mockPlaylists,
    isLoading: false,
    addToPlaylist: mockAddToPlaylist,
    createAndAdd: mockCreateAndAdd,
    isInPlaylist: (id: string) => id === "pl-1",
  }),
}));

const mockPlayer: {
  activeId: number | undefined;
  playNext: ReturnType<typeof vi.fn>;
  addToQueue: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
} = {
  activeId: 16,
  playNext: vi.fn(),
  addToQueue: vi.fn(),
  reset: vi.fn(),
};
vi.mock("@/hooks/use-player", () => ({
  default: () => mockPlayer,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuSub: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSubTrigger: ({
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
  DropdownMenuSubContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="drawer">{children}</div> : null,
  DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("SongOptionsMenu", () => {
  const adminId = "f66a1370-d191-48ad-956a-a54e2eaf5cf6";
  const songOwnerId = "738066e5-d24f-47a1-a92a-4e6b01eda643";
  const otherUserId = "11111111-2222-4444-8888-999999999999";

  const song = createMockSongWithAlbum({
    id: 16,
    title: "one piece",
    uploaderId: songOwnerId,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsMobile = false;
    mockIsFavourite = false;
    mockPlayer.activeId = 16;
    mockPlaylists = [{ id: "pl-1", title: "My Rock", userId: "user-1", isFavourites: false }];
    mockDeleteSong.mockResolvedValue({ ok: true });
  });

  describe("Desktop dropdown menu", () => {
    it("shows Delete option for global admin when song belongs to a different user", () => {
      mockUser = { id: adminId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("shows Delete option when user.isAdmin is true even if user ID is not in env set", () => {
      mockUser = { id: otherUserId, isAdmin: true };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("shows Delete option for the owner of the song", () => {
      mockUser = { id: songOwnerId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("does NOT show Delete option for non-owner non-admin user", () => {
      mockUser = { id: otherUserId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });

    it("does NOT show Delete option when user is unauthenticated", () => {
      mockUser = null;

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });

    it("deletes song when admin confirms delete in dialog", async () => {
      mockUser = { id: adminId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      // Click Delete to open confirmation dialog
      fireEvent.click(screen.getByRole("button", { name: /delete/i }));

      // Confirm delete in dialog
      const dialog = screen.getByTestId("dialog");
      const dialogConfirmBtn = within(dialog).getByRole("button", { name: /^delete$/i });
      fireEvent.click(dialogConfirmBtn);

      await waitFor(() => {
        expect(mockDeleteSong).toHaveBeenCalledWith(16);
        expect(mockPlayer.reset).toHaveBeenCalled();
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("handles delete failure gracefully", async () => {
      mockUser = { id: adminId };
      mockDeleteSong.mockResolvedValueOnce({ ok: false, error: "Network error" });

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /delete/i }));

      const dialog = screen.getByTestId("dialog");
      const dialogConfirmBtn = within(dialog).getByRole("button", { name: /^delete$/i });
      fireEvent.click(dialogConfirmBtn);

      await waitFor(() => {
        expect(mockDeleteSong).toHaveBeenCalledWith(16);
      });
    });

    it("toggles favourite from dropdown", () => {
      mockUser = { id: otherUserId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /like/i }));
      expect(mockToggleFavourite).toHaveBeenCalled();
    });

    it("plays next and adds to queue when activeId is present", () => {
      mockUser = { id: otherUserId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /play next/i }));
      expect(mockPlayer.playNext).toHaveBeenCalledWith(song);

      fireEvent.click(screen.getByRole("button", { name: /add to queue/i }));
      expect(mockPlayer.addToQueue).toHaveBeenCalledWith(song);
    });

    it("adds song to existing playlist from dropdown", () => {
      mockUser = { id: otherUserId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /my rock/i }));
      expect(mockAddToPlaylist).toHaveBeenCalledWith("pl-1");
    });

    it("creates a new playlist from desktop dialog", async () => {
      mockUser = { id: otherUserId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /new playlist/i }));

      const input = screen.getByPlaceholderText("Playlist name");
      fireEvent.change(input, { target: { value: "Workout Mix" } });

      const createBtn = screen.getByRole("button", { name: /^create$/i });
      fireEvent.click(createBtn);

      await waitFor(() => {
        expect(mockCreateAndAdd).toHaveBeenCalledWith("Workout Mix");
      });
    });

    it("handles Enter key in desktop playlist creation dialog and cancel button", async () => {
      mockUser = { id: otherUserId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /new playlist/i }));

      const input = screen.getByPlaceholderText("Playlist name");
      fireEvent.change(input, { target: { value: "Enter Mix" } });
      fireEvent.keyDown(input, { key: "Enter" });

      await waitFor(() => {
        expect(mockCreateAndAdd).toHaveBeenCalledWith("Enter Mix");
      });

      // Test cancel button in create dialog
      fireEvent.click(screen.getByRole("button", { name: /new playlist/i }));
      const cancelBtn = screen.getByRole("button", { name: /^cancel$/i });
      fireEvent.click(cancelBtn);
    });

    it("cancels delete in desktop confirmation dialog", () => {
      mockUser = { id: adminId };

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={false}
          onDrawerOpenChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /delete/i }));
      const dialog = screen.getByTestId("dialog");
      const cancelBtn = within(dialog).getByRole("button", { name: /^cancel$/i });
      fireEvent.click(cancelBtn);

      expect(mockDeleteSong).not.toHaveBeenCalled();
    });
  });

  describe("Mobile drawer menu", () => {
    beforeEach(() => {
      mockIsMobile = true;
    });

    it("renders drawer actions and confirms delete on mobile", async () => {
      mockUser = { id: adminId };
      const onDrawerOpenChange = vi.fn();

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={true}
          onDrawerOpenChange={onDrawerOpenChange}
        />,
      );

      expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /play next/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /add to queue/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /add to playlist/i })).toBeInTheDocument();

      const deleteBtn = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(deleteBtn);
      expect(onDrawerOpenChange).toHaveBeenCalledWith(false);

      // Confirm delete dialog in mobile
      const dialog = screen.getByTestId("dialog");
      const confirmBtn = within(dialog).getByRole("button", { name: /^delete$/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockDeleteSong).toHaveBeenCalledWith(16);
      });
    });

    it("toggles favourite, play next, add to queue in mobile view", async () => {
      mockUser = { id: otherUserId };
      const onDrawerOpenChange = vi.fn();

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={true}
          onDrawerOpenChange={onDrawerOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /like/i }));
      expect(mockToggleFavourite).toHaveBeenCalled();

      fireEvent.click(screen.getByRole("button", { name: /play next/i }));
      expect(mockPlayer.playNext).toHaveBeenCalledWith(song);

      fireEvent.click(screen.getByRole("button", { name: /add to queue/i }));
      expect(mockPlayer.addToQueue).toHaveBeenCalledWith(song);
    });

    it("navigates back from playlists subview and creates playlist via Enter key", async () => {
      mockUser = { id: otherUserId };
      const onDrawerOpenChange = vi.fn();

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={true}
          onDrawerOpenChange={onDrawerOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /add to playlist/i }));

      // Test back button
      const backBtn = screen.getByRole("button", { name: /back/i });
      expect(backBtn).toBeInTheDocument();
      fireEvent.click(backBtn);

      // Go back to playlists view
      fireEvent.click(screen.getByRole("button", { name: /add to playlist/i }));

      // Empty name on mobile
      const addBtn = screen.getByLabelText("Create playlist");
      fireEvent.click(addBtn);
      expect(mockCreateAndAdd).not.toHaveBeenCalled();

      // Enter key create on mobile
      const mobileInput = screen.getByPlaceholderText("New playlist name");
      fireEvent.change(mobileInput, { target: { value: "Enter Mobile Mix" } });
      fireEvent.keyDown(mobileInput, { key: "Enter" });

      await waitFor(() => {
        expect(mockCreateAndAdd).toHaveBeenCalledWith("Enter Mobile Mix");
      });
    });

    it("displays empty state when no playlists exist on mobile", () => {
      mockUser = { id: otherUserId };
      mockPlaylists = [];
      const onDrawerOpenChange = vi.fn();

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={true}
          onDrawerOpenChange={onDrawerOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /add to playlist/i }));
      expect(screen.getByText("No playlists yet")).toBeInTheDocument();
    });

    it("switches to playlists view in mobile drawer and adds to playlist", async () => {
      mockUser = { id: otherUserId };
      const onDrawerOpenChange = vi.fn();

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={true}
          onDrawerOpenChange={onDrawerOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /add to playlist/i }));

      const playlistBtn = screen.getByRole("button", { name: /my rock/i });
      expect(playlistBtn).toBeInTheDocument();

      fireEvent.click(playlistBtn);

      await waitFor(() => {
        expect(mockAddToPlaylist).toHaveBeenCalledWith("pl-1");
      });
    });

    it("creates a playlist from mobile view", async () => {
      mockUser = { id: otherUserId };
      const onDrawerOpenChange = vi.fn();

      render(
        <SongOptionsMenu
          songId={song.id}
          song={song}
          drawerOpen={true}
          onDrawerOpenChange={onDrawerOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /add to playlist/i }));

      const mobileInput = screen.getByPlaceholderText("New playlist name");
      fireEvent.change(mobileInput, { target: { value: "Chill Beats" } });

      const addBtn = screen.getByLabelText("Create playlist");
      fireEvent.click(addBtn);

      await waitFor(() => {
        expect(mockCreateAndAdd).toHaveBeenCalledWith("Chill Beats");
      });
    });
  });
});
