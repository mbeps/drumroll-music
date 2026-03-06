import getPlaylists from "@/actions/getPlaylists";
import getFavouritesPlaylist from "@/actions/getFavouritesPlaylist";
import Header from "@/components/Header";
import PlaylistsContent from "./components/PlaylistsContent";

export const revalidate = 0;

/**
 * Playlists page component.
 * Fetches and displays a list of the user's playlists and the special favourites playlist.
 */
const PlaylistsPage = async () => {
  const [playlists, favouritesPlaylist] = await Promise.all([
    getPlaylists(),
    getFavouritesPlaylist(),
  ]);

  return (
    <>
      <Header heading="Playlists" />
      <PlaylistsContent playlists={playlists} favouritesPlaylist={favouritesPlaylist} />
    </>
  );
};

export default PlaylistsPage;
