import { Song } from "@/types/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

/**
 * Contains the logic for when a song is selected to be played.
 * It ensures that a user is authenticated before playing a song.
 * If not, it opens the auth modal. Once authenticated,
 * it sets the selected song ID and the playlist of song IDs to the player.
 *
 * @param songs (Song[]): list of songs to play (from the current album)
 * @returns (function): function to play the song
 */
const useOnPlay = (songs: Song[]) => {
  const player = usePlayer(); // player state
  const authModal = useAuthModal(); // auth modal state
  const { user } = useUser(); // user state

  const onPlay = (id: string) => {
    // if no user, open auth modal
    if (!user) {
      return authModal.onOpen();
    }

    player.setId(id); // player will play this
    player.setIds(songs.map((song) => song.id)); // list of songs player will play
  };

  return onPlay;
};

export default useOnPlay;
