export interface Song {
  id: number;
  user_id: string;
  author: string | null;
  title: string | null;
  song_path: string | null;
  image_path: string | null;
}

export interface UserDetails {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

/** Callback type for playing a song by ID. */
export type OnPlayFn = (id: number) => void;

/** Shared interface for modal Zustand stores. */
export interface ModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
