"use client";

import { HardDrive, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { RiAlbumLine, RiPlayListLine } from "react-icons/ri";
import { toast } from "sonner";
import deleteAlbum from "@/actions/album/delete-album";
import deleteArtist from "@/actions/artist/delete-artist";
import deletePlaylist from "@/actions/playlist/delete-playlist";
import deleteSong from "@/actions/song/delete-song";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatArtists } from "@/lib/music/format-artists";
import type { Artist } from "@/types/artist/artist";
import type { AlbumWithArtists } from "@/types/music/album-with-artists";
import type { SongWithAlbum } from "@/types/music/song-with-album";
import type { Playlist } from "@/types/playlist/playlist";
import type { StorageUsageResult } from "@/types/storage/storage-usage-result";

interface AdminContentProps {
  user: {
    id: string;
    email?: string;
  };
  storage: StorageUsageResult;
  songs: SongWithAlbum[];
  albums: AlbumWithArtists[];
  artists: Artist[];
  playlists: Playlist[];
}

type DeleteTarget =
  | { type: "song"; id: number; name: string }
  | { type: "album"; id: string; name: string }
  | { type: "artist"; id: string; name: string }
  | { type: "playlist"; id: string; name: string }
  | null;

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toISOString().split("T")[0];
};

/**
 * Dedicated administrative dashboard component.
 * Allows the global admin to monitor system resources, storage consumption,
 * and manage (search, inspect, delete) songs, albums, artists, and custom playlists.
 *
 * @author Maruf Bepary
 */
const AdminContent: React.FC<AdminContentProps> = ({
  user,
  storage,
  songs: initialSongs,
  albums: initialAlbums,
  artists: initialArtists,
  playlists: initialPlaylists,
}) => {
  const router = useRouter();

  const [songs, setSongs] = useState<SongWithAlbum[]>(initialSongs);
  const [albums, setAlbums] = useState<AlbumWithArtists[]>(initialAlbums);
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);

  const [activeTab, setActiveTab] = useState("songs");

  const [songQuery, setSongQuery] = useState("");
  const [albumQuery, setAlbumQuery] = useState("");
  const [artistQuery, setArtistQuery] = useState("");
  const [playlistQuery, setPlaylistQuery] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const globalPercentage = Math.min((storage.globalUsage / storage.globalLimit) * 100, 100);

  const progressColorClass = useMemo(() => {
    if (globalPercentage < 75) return "bg-emerald-500";
    if (globalPercentage < 90) return "bg-amber-500";
    return "bg-rose-500";
  }, [globalPercentage]);

  const filteredSongs = useMemo(() => {
    if (!songQuery.trim()) return songs;
    const lower = songQuery.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.album?.title?.toLowerCase().includes(lower) ||
        (s.album && formatArtists(s.album).toLowerCase().includes(lower)),
    );
  }, [songs, songQuery]);

  const filteredAlbums = useMemo(() => {
    if (!albumQuery.trim()) return albums;
    const lower = albumQuery.toLowerCase();
    return albums.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) || formatArtists(a).toLowerCase().includes(lower),
    );
  }, [albums, albumQuery]);

  const filteredArtists = useMemo(() => {
    if (!artistQuery.trim()) return artists;
    const lower = artistQuery.toLowerCase();
    return artists.filter((a) => a.name.toLowerCase().includes(lower));
  }, [artists, artistQuery]);

  const filteredPlaylists = useMemo(() => {
    if (!playlistQuery.trim()) return playlists;
    const lower = playlistQuery.toLowerCase();
    return playlists.filter((p) => p.title.toLowerCase().includes(lower));
  }, [playlists, playlistQuery]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      let result: { ok: boolean; error?: string } = { ok: false };

      if (deleteTarget.type === "song") {
        result = await deleteSong(deleteTarget.id);
        if (result.ok) {
          setSongs((prev) => prev.filter((s) => s.id !== deleteTarget.id));
          toast.success(`Deleted song "${deleteTarget.name}"`);
        }
      } else if (deleteTarget.type === "album") {
        result = await deleteAlbum(deleteTarget.id);
        if (result.ok) {
          setAlbums((prev) => prev.filter((a) => a.id !== deleteTarget.id));
          toast.success(`Deleted album "${deleteTarget.name}"`);
        }
      } else if (deleteTarget.type === "artist") {
        result = await deleteArtist(deleteTarget.id);
        if (result.ok) {
          setArtists((prev) => prev.filter((a) => a.id !== deleteTarget.id));
          toast.success(`Deleted artist "${deleteTarget.name}"`);
        }
      } else if (deleteTarget.type === "playlist") {
        result = await deletePlaylist(deleteTarget.id);
        if (result.ok) {
          setPlaylists((prev) => prev.filter((p) => p.id !== deleteTarget.id));
          toast.success(`Deleted playlist "${deleteTarget.name}"`);
        }
      }

      if (!result.ok) {
        toast.error(result.error ?? "Failed to delete item");
      } else {
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred during deletion");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 px-3.5 py-3 sm:gap-y-6 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl tracking-tight sm:text-2xl">System Overview</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Logged in as {user.email || user.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <Card
          className="cursor-pointer gap-1.5 p-3 transition-colors hover:bg-accent/40 sm:p-4"
          onClick={() => setActiveTab("songs")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs sm:text-sm">
              Total Songs
            </span>
            <HiOutlineMusicalNote className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-bold text-xl sm:text-2xl">{songs.length}</div>
          <p className="hidden text-[11px] text-muted-foreground sm:block">Platform-wide tracks</p>
        </Card>

        <Card
          className="cursor-pointer gap-1.5 p-3 transition-colors hover:bg-accent/40 sm:p-4"
          onClick={() => setActiveTab("albums")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs sm:text-sm">
              Total Albums
            </span>
            <RiAlbumLine className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-bold text-xl sm:text-2xl">{albums.length}</div>
          <p className="hidden text-[11px] text-muted-foreground sm:block">Catalog releases</p>
        </Card>

        <Card
          className="cursor-pointer gap-1.5 p-3 transition-colors hover:bg-accent/40 sm:p-4"
          onClick={() => setActiveTab("artists")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs sm:text-sm">
              Total Artists
            </span>
            <BsPeople className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-bold text-xl sm:text-2xl">{artists.length}</div>
          <p className="hidden text-[11px] text-muted-foreground sm:block">Credited creators</p>
        </Card>

        <Card
          className="cursor-pointer gap-1.5 p-3 transition-colors hover:bg-accent/40 sm:p-4"
          onClick={() => setActiveTab("playlists")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs sm:text-sm">
              Custom Playlists
            </span>
            <RiPlayListLine className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-bold text-xl sm:text-2xl">{playlists.length}</div>
          <p className="hidden text-[11px] text-muted-foreground sm:block">Active user playlists</p>
        </Card>
      </div>

      <Card className="gap-2.5 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-xs sm:text-sm">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span>Global Storage Capacity</span>
          </div>
          <span className="font-semibold text-xs sm:text-sm">{Math.round(globalPercentage)}%</span>
        </div>
        <Progress
          value={globalPercentage}
          indicatorClassName={progressColorClass}
          className="h-2"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground sm:text-xs">
          <span>Used: {formatBytes(storage.globalUsage)}</span>
          <span>Capacity: {formatBytes(storage.globalLimit)}</span>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="!h-auto md:!h-10 mb-4 grid w-full grid-cols-5 items-stretch gap-1 rounded-2xl bg-muted/60 p-1.5 md:mb-0 md:gap-0 md:rounded-lg md:bg-muted md:p-1">
          <TabsTrigger
            value="songs"
            className="flex h-auto flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-center text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:h-[calc(100%-1px)] md:flex-row md:gap-2 md:rounded-md md:px-3 md:py-1.5 md:text-sm"
          >
            <HiOutlineMusicalNote className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="truncate text-[11px] sm:text-xs md:text-sm">Songs</span>
              <Badge
                variant="secondary"
                className="h-4 min-w-4 px-1 font-semibold text-[10px] md:h-5 md:min-w-5 md:px-1.5 md:text-xs"
              >
                {songs.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="flex h-auto flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-center text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:h-[calc(100%-1px)] md:flex-row md:gap-2 md:rounded-md md:px-3 md:py-1.5 md:text-sm"
          >
            <RiAlbumLine className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="truncate text-[11px] sm:text-xs md:text-sm">Albums</span>
              <Badge
                variant="secondary"
                className="h-4 min-w-4 px-1 font-semibold text-[10px] md:h-5 md:min-w-5 md:px-1.5 md:text-xs"
              >
                {albums.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="artists"
            className="flex h-auto flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-center text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:h-[calc(100%-1px)] md:flex-row md:gap-2 md:rounded-md md:px-3 md:py-1.5 md:text-sm"
          >
            <BsPeople className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="truncate text-[11px] sm:text-xs md:text-sm">Artists</span>
              <Badge
                variant="secondary"
                className="h-4 min-w-4 px-1 font-semibold text-[10px] md:h-5 md:min-w-5 md:px-1.5 md:text-xs"
              >
                {artists.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="playlists"
            className="flex h-auto flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-center text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:h-[calc(100%-1px)] md:flex-row md:gap-2 md:rounded-md md:px-3 md:py-1.5 md:text-sm"
          >
            <RiPlayListLine className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="truncate text-[11px] sm:text-xs md:text-sm">Playlists</span>
              <Badge
                variant="secondary"
                className="h-4 min-w-4 px-1 font-semibold text-[10px] md:h-5 md:min-w-5 md:px-1.5 md:text-xs"
              >
                {playlists.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="storage"
            className="flex h-auto flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2.5 text-center text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm md:h-[calc(100%-1px)] md:flex-row md:gap-2 md:rounded-md md:px-3 md:py-1.5 md:text-sm"
          >
            <HardDrive className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
            <span className="truncate text-[11px] sm:text-xs md:text-sm">Storage & Quotas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative w-full flex-1 sm:max-w-sm">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter songs by title or artist..."
                value={songQuery}
                onChange={(e) => setSongQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">
              Showing {filteredSongs.length} of {songs.length}
            </span>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSongs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No songs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSongs.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell className="font-medium">{song.title}</TableCell>
                      <TableCell>{song.album?.title || "—"}</TableCell>
                      <TableCell>{song.album ? formatArtists(song.album) : "—"}</TableCell>
                      <TableCell>{formatDate(song.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete song ${song.title}`}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setDeleteTarget({
                              type: "song",
                              id: song.id,
                              name: song.title,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="albums" className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative w-full flex-1 sm:max-w-sm">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter albums by title or artist..."
                value={albumQuery}
                onChange={(e) => setAlbumQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">
              Showing {filteredAlbums.length} of {albums.length}
            </span>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Album Title</TableHead>
                  <TableHead>Artists</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlbums.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No albums found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlbums.map((album) => (
                    <TableRow key={album.id}>
                      <TableCell className="font-medium">{album.title}</TableCell>
                      <TableCell>{formatArtists(album)}</TableCell>
                      <TableCell className="capitalize">{album.albumType}</TableCell>
                      <TableCell>{formatDate(album.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete album ${album.title}`}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setDeleteTarget({
                              type: "album",
                              id: album.id,
                              name: album.title,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="artists" className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative w-full flex-1 sm:max-w-sm">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter artists by name..."
                value={artistQuery}
                onChange={(e) => setArtistQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">
              Showing {filteredArtists.length} of {artists.length}
            </span>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artist Name</TableHead>
                  <TableHead>Artist ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No artists found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArtists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell className="font-medium">{artist.name}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">
                        {artist.id}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete artist ${artist.name}`}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setDeleteTarget({
                              type: "artist",
                              id: artist.id,
                              name: artist.name,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative w-full flex-1 sm:max-w-sm">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter playlists by title..."
                value={playlistQuery}
                onChange={(e) => setPlaylistQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">
              Showing {filteredPlaylists.length} of {playlists.length}
            </span>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Playlist Title</TableHead>
                  <TableHead>Owner User ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlaylists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No playlists found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlaylists.map((playlist) => (
                    <TableRow key={playlist.id}>
                      <TableCell className="font-medium">{playlist.title}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">
                        {playlist.userId}
                      </TableCell>
                      <TableCell>{formatDate(playlist.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete playlist ${playlist.title}`}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setDeleteTarget({
                              type: "playlist",
                              id: playlist.id,
                              name: playlist.title,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Quotas & Upload Limits</CardTitle>
              <CardDescription>
                System configuration limits enforced at API and database boundaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource / Scope</TableHead>
                      <TableHead>Configured Limit</TableHead>
                      <TableHead>Enforcement Mechanism</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Global Application Storage</TableCell>
                      <TableCell>{formatBytes(storage.globalLimit)}</TableCell>
                      <TableCell>Pre-upload database quota validator</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Per-User Storage Quota</TableCell>
                      <TableCell>{formatBytes(storage.userLimit)}</TableCell>
                      <TableCell>PostgreSQL RPC quota validation</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Song Audio File</TableCell>
                      <TableCell>20 MB</TableCell>
                      <TableCell>Zod schema boundary check</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Album Cover Image</TableCell>
                      <TableCell>5 MB</TableCell>
                      <TableCell>Zod schema boundary check</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Artist Profile Image</TableCell>
                      <TableCell>2 MB</TableCell>
                      <TableCell>Zod schema boundary check</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">User Avatar Image</TableCell>
                      <TableCell>5 MB</TableCell>
                      <TableCell>Zod schema boundary check</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the {deleteTarget?.type} &ldquo;
              {deleteTarget?.name}&rdquo;? This will permanently delete the resource and remove
              associated storage objects.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={isDeleting} onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={handleConfirmDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
