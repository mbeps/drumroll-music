import { redirect } from "next/navigation";

/**
 * Legacy /liked route — redirects to /favourites.
 */
const LikedPage = () => {
  redirect("/favourites");
};

export default LikedPage;
