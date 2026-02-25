"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { useSessionContext } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import type { TablesInsert } from "@/types/types_db";

interface LikeButtonProps {
  songId: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    /**
     * Checks whether the song is liked by the user.
     */
    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart; // change icon depending on whether the song is liked or not

  /**
   * Allows the user to like or unlike a song.
   *
   * @returns (() => void): open the authentication modal if the user is not logged in
   */
  const handleLike = async () => {
    if (!user) {
      // open the authentication modal if the user is not logged in
      return authModal.onOpen();
    }

    if (isLiked) {
      // unlike the song if it is already liked
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      // like the song if it is not liked
      const payload: TablesInsert<"liked_songs"> = {
        song_id: songId,
        user_id: user.id,
      };

      const { error } = await supabaseClient
        .from("liked_songs")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(payload as any);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
      }
    }

    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:opacity-75 transition"
      onClick={handleLike}
    >
      <Icon color={isLiked ? "#22c55e" : undefined} size={25} />
    </Button>
  );
};

export default LikeButton;
