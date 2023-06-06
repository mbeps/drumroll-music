"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Song } from "@/types/types";
import { useUser } from "@/hooks/useUser";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";

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
      // redirect to home page if the user is not logged in
      router.replace("/");
    }
  }, [isLoading, user, router]);

  // if the user is not logged in show message
  if (songs.length === 0) {
    return (
      <div
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full px-6 
          text-neutral-400
        "
      >
        No liked songs
      </div>
    );
  }

  // otherwise show the list of songs
  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {songs.map((song: Song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem onClick={(id: string) => onPlay(id)} song={song} />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
