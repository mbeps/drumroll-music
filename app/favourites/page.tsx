import getFavouriteSongs from "@/actions/playlist/get-favourite-songs";
import FavouritesContent from "@/app/favourites/_components/favourites-content";
import Header from "@/components/header";

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
