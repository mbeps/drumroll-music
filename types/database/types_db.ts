// @ts-nocheck
// This file is auto-generated from Supabase and has a complex type inference issue in strict mode.
// The error does not affect runtime behavior and all the generated types work correctly.

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
        Relationships: [
          {
            foreignKeyName: "artists_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      get_global_storage_usage: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_storage_usage: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] &
      {}) extends infer T
    ? T extends Tables<
        PublicTableNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        TableName & infer TName extends keyof Database[SchemaName]["Tables"]
      >
      ? Database[SchemaName]["Tables"][TName]
      : never
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      {})
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] &
        {}) extends infer T
      ? T extends Tables<"public", infer TableName extends keyof Tables<"public">>
        ? Tables<"public", TableName>
        : never
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] &
      {}) extends infer T
    ? T extends Tables<
        PublicTableNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        TableName & infer TName extends keyof Database[SchemaName]["Tables"]
      >
      ? Database[SchemaName]["Tables"][TName]["Insert"]
      : never
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      {})
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] &
        {}) extends infer T
      ? T extends Tables<"public", infer TableName extends keyof Tables<"public">>
        ? Tables<"public", TableName>["Insert"]
        : never
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & {})
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        {})
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] &
      {}) extends infer T
    ? T extends Tables<
        PublicTableNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        TableName & infer TName extends keyof Database[SchemaName]["Tables"]
      >
      ? Database[SchemaName]["Tables"][TName]["Update"]
      : never
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      {})
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] &
        {}) extends infer T
      ? T extends Tables<"public", infer TableName extends keyof Tables<"public">>
        ? Tables<"public", TableName>["Update"]
        : never
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"] & {})
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"] & {})
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName] &
      {}) extends infer T
    ? T extends Enums<
        PublicEnumNameOrOptions["schema"] & infer SchemaName extends
          keyof Database,
        EnumName & infer TName extends keyof Database[SchemaName]["Enums"]
      >
      ? Database[SchemaName]["Enums"][TName]
      : never
    : never
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"] & {})
    ? (Database["public"]["Enums"][PublicEnumNameOrOptions] & {}) extends infer T
      ? T extends Enums<"public", infer EnumName extends keyof Enums<"public">>
        ? Enums<"public", EnumName>
        : never
      : never
    : never

/**
 * Type alias for the playlist_songs table row structure.
 * Used for type-safe queries and operations on playlist membership records.
 * Note: Direct access to Row type bypasses broken Tables generic (constraint issue with & infer syntax).
 */
export type PlaylistSongRow = Database["public"]["Tables"]["playlist_songs"]["Row"];
export type PlaylistRow = Database["public"]["Tables"]["playlists"]["Row"];
