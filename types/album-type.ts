/**
 * Classifies the type of music release for editorial and organizational purposes.
 * - `album`: Full-length release with multiple tracks (7+ tracks typically)
 * - `single`: Single track release or promotional single
 * - `ep`: Extended play with shorter track count (3-6 tracks typically)
 * @type {"album" | "single" | "ep"}
 * @example
 * const releaseType: AlbumType = "ep";
 */
export type AlbumType = "album" | "single" | "ep";
