// Domain types for the Drumroll Music app

export type RepeatMode = "OFF" | "ALL" | "ONE";
export const REPEAT_MODES: RepeatMode[] = ["OFF", "ALL", "ONE"];

export type AlbumType = "album" | "single" | "ep";

export interface Artist {
  id: string;
  name: string;
  imageUrl: string | null;
  uploaderId: string | null;
}

export interface Album {
  id: string;
  title: string;
  albumType?: AlbumType;
  releaseDate: string | null;
  coverImagePath: string | null;
  uploaderId: string;
  createdAt: string | null;
}

export interface AlbumWithArtists extends Album {
  artists: Artist[];
}

export interface Song {
  id: number;
  title: string;
  albumId: string;
  trackNumber: number;
  songPath: string;
  uploaderId: string;
  createdAt: string | null;
}

export interface SongWithAlbum extends Song {
  album: AlbumWithArtists;
}

export interface AlbumDetail extends AlbumWithArtists {
  songs: Song[];
}

export interface ArtistWithAlbums extends Artist {
  albums: AlbumWithArtists[];
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  isFavourites: boolean;
  createdAt: string | null;
}

export interface PlaylistWithSongs extends Playlist {
  songs: SongWithAlbum[];
}

export interface UserDetails {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

export type OnPlayFn = (id: number) => void;

export interface ModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
