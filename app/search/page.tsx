import getSongsByTitle from "@/actions/getSongsByTitle";
import SearchInput from "@/components/SearchInput";
import Header from "@/components/Header";
import SearchContent from "./components/SearchContent";

export const revalidate = 0;

interface SearchProps {
  searchParams: { title: string };
}

/**
 * Takes the search parameters and renders the search page.
 * As the search page is not cached, it will always be rendered on the server.
 * The page will be revalidated every 0 seconds.
 * Once the user searches for a song, the search results will be displayed.
 *
 * @param searchParams (SearchProps): search parameters
 * @returns (React.FC): search page with search input and search results
 */
const Search = async ({ searchParams }: SearchProps) => {
  const songs = await getSongsByTitle(searchParams.title);

  return (
    <>
      {/* <Header className="from-bg-neutral-900"> */}
      <Header>
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </>
  );
};

export default Search;
