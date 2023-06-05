import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { Song } from "@/types/types";

/**
 * Fetches song by id
 * @param id (string): id of song to be fetched
 * @returns (object): song and whether or not it is loading
 */
const useSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false); // whether or not song is loading
  const [song, setSong] = useState<Song | undefined>(undefined); // song to be fetched initially undefined
  const { supabaseClient } = useSessionContext(); // supabase client

  useEffect(() => {
    if (!id) {
      return; // if no id exit
    }

    setIsLoading(true); // set loading to true

    /**
     * Fetches song by ID.
     *
     * @returns (Song | undefined): song fetched by id (or undefined if error)
     */
    const fetchSong = async () => {
      // fetch song by id
      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setIsLoading(false);
        console.log("ERROR: ", error.message);
        return toast.error("Could not play/fetch song(s)");
      }

      setSong(data as Song); // set song
      setIsLoading(false); // set loading to false
    };

    fetchSong(); // fetch song
  }, [id, supabaseClient]);

  // only runs once and when loading or song changes
  return useMemo(
    () => ({
      isLoading, // whether or not song is loading
      song, // song fetched by id
    }),
    [isLoading, song]
  );
};

export default useSongById;
