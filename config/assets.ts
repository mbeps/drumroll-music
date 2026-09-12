const IMAGES_BASE = "/images";

/**
 * Structured static asset registry.
 * Centralizes static asset paths across the application to ensure maintainability
 * and prevent scattering raw path strings.
 */
export const ASSETS = {
  LIKED: {
    path: `${IMAGES_BASE}/liked.png`,
    alt: "Liked Songs",
  },
} as const;

export type Assets = typeof ASSETS;
