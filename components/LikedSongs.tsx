import type { SongWithAlbum, OnPlayFn } from "@/types/types";
import FavouriteButton from "./FavouriteButton";
import MediaItem from "./MediaItem";

interface ListSongsProps {
  songs: SongWithAlbum[];
  message: string;
  onPlay: OnPlayFn;
}

/**
 * Renders a list of songs with like buttons.
 * If there are no songs, a message will be displayed.
 * Otherwise, the list of songs will be displayed.
 *
 * @param songs (Song[]): list of songs to be displayed
 * @param message (string): message to be displayed if there are no songs
 * @param onPlay (function): plays the song when clicked
 * @returns (React.FC): list of songs with like buttons
 */
const ListSongs: React.FC<ListSongsProps> = ({ songs, message, onPlay }) => {
  // if there are no songs to display, display a message
  if (songs.length === 0) {
    return (
      <div
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full 
          px-6 
          text-muted-foreground
        "
      >
        {message}
      </div>
    );
  }

  // otherwise, display the list of songs
  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {songs.map((song) => (
        <MediaItem
          key={song.id}
          onClick={() => onPlay(song.id)}
          song={song}
        >
          <FavouriteButton songId={song.id} />
        </MediaItem>
      ))}
    </div>
  );
};

export default ListSongs;
