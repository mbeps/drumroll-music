import getSongsByTitle from "@/actions/getSongsByTitle";
import getAlbumsByTitle from "@/actions/getAlbumsByTitle";
import getArtistsByName from "@/actions/getArtistsByName";
import SearchInput from "@/components/SearchInput";
import Header from "@/components/Header";
import SearchContent from "./components/SearchContent";

export const revalidate = 0;

interface SearchProps {
  searchParams: Promise<{ title?: string }>;
}

/**
 * Search page component.
 * Fetches and displays filtered results for songs, albums, and artists based on the title query.
 * 
 * @param props - Component properties.
 * @param props.searchParams - Promise containing search parameters like the title.
 */
const Search = async ({ searchParams }: SearchProps) => {
  const { title = "" } = await searchParams;

  const [songs, albums, artists] = await Promise.all([
    getSongsByTitle(title),
    getAlbumsByTitle(title),
    getArtistsByName(title),
  ]);

  return (
    <>
      <Header heading="Search">
        <SearchInput />
      </Header>
      <SearchContent songs={songs} albums={albums} artists={artists} />
    </>
  );
};

export default Search;
