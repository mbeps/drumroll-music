import getFavouriteSongs from "@/actions/playlist/get-favourite-songs";
import Header from "@/components/header";
import FavouritesContent from "./components/favourites-content";

export const revalidate = 0;

/**
 * Server Component representing the Favourites page.
 * Fetches and displays the current user's liked songs.
 */
const FavouritesPage = async () => {
  const songs = await getFavouriteSongs();

  return (
    <>
      <Header heading="Favourites" />
      <FavouritesContent songs={songs} />
    </>
  );
};

export default FavouritesPage;
