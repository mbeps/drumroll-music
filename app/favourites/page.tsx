import getFavouriteSongs from "@/actions/getFavouriteSongs";
import Header from "@/components/Header";
import FavouritesContent from "./components/FavouritesContent";

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
