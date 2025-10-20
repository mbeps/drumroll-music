export interface Song {
  id: string;
  user_id: string;
  author: string;
  title: string;
  song_path: string;
  image_path: string;
}

export interface UserDetails {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  billing_address?: Record<string, unknown> | null;
  payment_method?: Record<string, unknown> | null;
}
