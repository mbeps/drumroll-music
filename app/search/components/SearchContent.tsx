"use client";

import ListSongs from "@/components/LikedSongs";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types/types";

interface SearchContentProps {
  songs: Song[];
}

/**
 * Renders the search results.
 * If there are no search results, a message will be displayed.
 * Otherwise, the list of songs will be displayed.
 *
 * @param songs (Song[]): list of songs (search results
 * @returns (React.FC): list of songs with like buttons
 */
const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  return <ListSongs songs={songs} message="No songs found" onPlay={onPlay} />;
};

export default SearchContent;
