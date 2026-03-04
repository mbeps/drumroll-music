import getPlaylists from "@/actions/getPlaylists";
import getFavouritesPlaylist from "@/actions/getFavouritesPlaylist";
import Header from "@/components/Header";
import PlaylistsContent from "./components/PlaylistsContent";

export const revalidate = 0;

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
