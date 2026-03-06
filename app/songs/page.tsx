import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SongsContent from "./components/SongsContent";

export const revalidate = 0;

interface SongsProps {
  searchParams: Promise<{ title?: string }>;
}

/**
 * Songs page component.
 * Fetches and displays a list of songs, optionally filtered by title.
 * 
 * @param props - Component properties.
 * @param props.searchParams - Promise containing search parameters like the song title.
 */
const Songs = async ({ searchParams }: SongsProps) => {
  const { title = "" } = await searchParams;
  const songs = await getSongsByTitle(title);

  return (
    <div className="bg-background rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header heading="Songs">
        <div className="mb-2 flex flex-col gap-y-6">
          <SearchInput />
        </div>
      </Header>
      <SongsContent songs={songs} />
    </div>
  );
};

export default Songs;
