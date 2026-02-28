import getArtistsByName from "@/actions/getArtistsByName";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import ArtistsContent from "./components/ArtistsContent";

export const revalidate = 0;

interface ArtistsPageProps {
  searchParams: Promise<{ title?: string }>;
}

const ArtistsPage = async ({ searchParams }: ArtistsPageProps) => {
  const { title = "" } = await searchParams;
  const artists = await getArtistsByName(title);

  return (
    <div className="bg-background rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header heading="Artists">
        <div className="mb-2 flex flex-col gap-y-6">
          <SearchInput />
        </div>
      </Header>
      <ArtistsContent artists={artists} />
    </div>
  );
};

export default ArtistsPage;
