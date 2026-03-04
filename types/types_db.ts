export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      artists: {
        Row: {
          id: string
          name: string
          image_url: string | null
          uploader_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          image_url?: string | null
          uploader_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          image_url?: string | null
          uploader_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      albums: {
        Row: {
          id: string
          title: string
          release_date: string | null
          cover_image_path: string | null
          uploader_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          release_date?: string | null
          cover_image_path?: string | null
          uploader_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          release_date?: string | null
          cover_image_path?: string | null
          uploader_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      album_artists: {
        Row: {
          album_id: string
          artist_id: string
        }
        Insert: {
          album_id: string
          artist_id: string
        }
        Update: {
          album_id?: string
          artist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_artists_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          id: number
          title: string
          album_id: string
          track_number: number
          song_path: string
          uploader_id: string
          created_at: string | null
        }
        Insert: {
          id?: number
          title: string
          album_id: string
          track_number: number
          song_path: string
          uploader_id: string
          created_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          album_id?: string
          track_number?: number
          song_path?: string
          uploader_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songs_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          id: string
          user_id: string
          title: string
          is_favourites: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          is_favourites?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          is_favourites?: boolean
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_songs: {
        Row: {
          playlist_id: string
          song_id: number
          position: number
          added_at: string | null
        }
        Insert: {
          playlist_id: string
          song_id: number
          position: number
          added_at?: string | null
        }
        Update: {
          playlist_id?: string
          song_id?: number
          position?: number
          added_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type TablesInsert<
  T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T] extends { Insert: infer I }
  ? I
  : never;

/** A song row joined with its album and the album's artists. */
export type SongWithAlbumRow =
  Database["public"]["Tables"]["songs"]["Row"] & {
    albums: Database["public"]["Tables"]["albums"]["Row"] & {
      album_artists: Array<{
        artists: Database["public"]["Tables"]["artists"]["Row"];
      }>;
    };
  };

/** An album row joined with its artists via album_artists. */
export type AlbumWithArtistsRow =
  Database["public"]["Tables"]["albums"]["Row"] & {
    album_artists: Array<{
      artists: Database["public"]["Tables"]["artists"]["Row"];
    }>;
  };

/** A playlist_songs row joined with its song, album, and artists. */
export type PlaylistSongRow =
  Database["public"]["Tables"]["playlist_songs"]["Row"] & {
    songs: SongWithAlbumRow;
  };
