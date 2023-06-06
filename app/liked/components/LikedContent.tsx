"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Song } from "@/types/types";
import { useUser } from "@/hooks/useUser";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import ListSongs from "@/components/LikedSongs";

interface LikedContentProps {
  songs: Song[];
}

/**
 * Renders the user's liked songs.
 *
 * @param songs (Song[]): list of songs
 * @returns (React.FC): list of songs with like buttons
 */
const LikedContent: React.FC<LikedContentProps> = ({ songs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const onPlay = useOnPlay(songs); // plays the song when clicked

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  return <ListSongs songs={songs} message="No liked songs" onPlay={onPlay} />;
};

export default LikedContent;
