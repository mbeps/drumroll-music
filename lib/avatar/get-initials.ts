/**
 * Avatar fallback initial generation utilities.
 *
 * Provides utilities for generating display initials from user names
 * when profile images are unavailable. Used in avatar components
 * throughout the application.
 *
 * @author Maruf Bepary
 */

/**
 * Extracts up to two uppercase initials from a name string.
 * Used for avatar fallback generation when profile images are unavailable.
 *
 * @param name - Full name or display name
 * @returns Up to 2 uppercase initials
 *
 * @example
 * getInitials("John Doe")
 * // Output: "JD"
 *
 * getInitials("Jane")
 * // Output: "J"
 *
 * getInitials("")
 * // Output: ""
 *
 * @author Maruf Bepary
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
