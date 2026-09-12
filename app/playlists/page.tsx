import getFavouritesPlaylist from "@/actions/playlist/get-favourites-playlist";
import getPlaylists from "@/actions/playlist/get-playlists";
import PlaylistsContent from "@/app/playlists/_components/playlists-content";
import Header from "@/components/header";

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
