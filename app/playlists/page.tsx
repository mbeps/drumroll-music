import getPlaylists from "@/actions/getPlaylists";
import Header from "@/components/Header";
import PlaylistsContent from "./components/PlaylistsContent";

export const revalidate = 0;

const PlaylistsPage = async () => {
  const playlists = await getPlaylists();

  return (
    <>
      <Header heading="Playlists" />
      <PlaylistsContent playlists={playlists} />
    </>
  );
};

export default PlaylistsPage;
