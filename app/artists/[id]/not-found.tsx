import PageMessage from "@/components/ui/page-message";

export const revalidate = 0;

/**
 * Route-level 404 page component for an individual artist.
 * Rendered when an artist ID does not exist or is not found.
 *
 * @author Maruf Bepary
 */
export default function ArtistNotFound() {
  return (
    <PageMessage
      title="404: Artist Not Found"
      description="The requested artist could not be found. Try searching for another artist."
    />
  );
}
