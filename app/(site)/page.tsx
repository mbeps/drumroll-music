import getSongs from "@/actions/getSongs";
import getAlbums from "@/actions/getAlbums";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import SongsGrid from "@/components/Song/SongsGrid";
import AlbumsGrid from "@/components/Album/AlbumsGrid";

export const revalidate = 0;

/**
 * The main landing page of the application.
 * Fetches and displays the newest songs and latest albums.
 */
const HomePage = async () => {
  const [songs, albums] = await Promise.all([getSongs(), getAlbums()]);

  return (
    <>
      <Header heading="Welcome back" />
      <div className="mb-7 px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <ListItem
            image="/images/liked.png"
            name="Favourites"
            href="/favourites"
          />
        </div>
      </div>
      <div className="mb-7 flex flex-col gap-y-2 px-6">
        <h2 className="text-2xl font-semibold">Newest songs</h2>
        <SongsGrid songs={songs} />
      </div>
      <div className="mb-7 flex flex-col gap-y-2 px-6">
        <h2 className="text-2xl font-semibold">Latest albums</h2>
        <AlbumsGrid albums={albums} />
      </div>
    </>
  );
};

export default HomePage;
