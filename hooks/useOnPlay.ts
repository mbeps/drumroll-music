import { Song } from "@/types/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    player.setId(id); // player will play this
    player.setIds(songs.map((song) => song.id)); // list of songs player will play
  };

  return onPlay;
};

export default useOnPlay;
