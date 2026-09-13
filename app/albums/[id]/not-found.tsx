import PageMessage from "@/components/ui/page-message";

export const revalidate = 0;

/**
 * Route-level 404 page component for an individual album.
 * Rendered when an album ID does not exist or is not found.
 *
 * @author Maruf Bepary
 */
export default function AlbumNotFound() {
  return (
    <PageMessage
      title="404: Album Not Found"
      description="The requested album could not be found. Try searching for another album."
    />
  );
}
