import PageMessage from "@/components/ui/page-message";

export const revalidate = 0;

/**
 * Route-level 404 page component for an individual playlist.
 * Rendered when a playlist ID does not exist or is not found.
 *
 * @author Maruf Bepary
 */
export default function PlaylistNotFound() {
  return (
    <PageMessage
      title="404: Playlist Not Found"
      description="The requested playlist could not be found. Try searching for another playlist."
    />
  );
}
