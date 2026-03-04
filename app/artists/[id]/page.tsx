import { notFound } from "next/navigation";
import getArtistById from "@/actions/getArtistById";
import Header from "@/components/Header";
import ArtistDetailContent from "./components/ArtistDetailContent";

export const revalidate = 0;

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

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
