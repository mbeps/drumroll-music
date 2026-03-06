import { notFound } from "next/navigation";
import getArtistById from "@/actions/getArtistById";
import Header from "@/components/Header";
import ArtistDetailContent from "./components/ArtistDetailContent";

export const revalidate = 0;

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Server Component for an individual artist's detail page.
 * Fetches artist details by ID and renders the detail content.
 * Redirects to 404 if the artist is not found.
 * 
 * @param props.params Promise containing the artist's unique identifier.
 */
const ArtistPage = async ({ params }: ArtistPageProps) => {
  const { id } = await params;
  const artist = await getArtistById(id);

  if (!artist) notFound();

  return (
    <>
      <Header />
      <ArtistDetailContent artist={artist} />
    </>
  );
};

export default ArtistPage;
