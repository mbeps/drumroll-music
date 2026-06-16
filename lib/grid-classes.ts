/**
 * Responsive grid layout classes for entity cards.
 * Used in songs, albums, and artists grids.
 * Maintains consistent spacing and column layout across all grid views.
 *
 * Breakpoints:
 * - Mobile (sm): 1 column
 * - Tablet (sm): 3 columns
 * - Desktop (md): 3 columns
 * - Desktop (lg): 4 columns
 * - Large (xl): 5 columns
 * - XL+ (2xl): 8 columns
 *
 * @example
 * const gridClass = cn(GRID_CLASSES, "mt-4");
 */
export const GRID_CLASSES =
  "grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8";
