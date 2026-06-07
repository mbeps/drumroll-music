/**
 * Metadata for a registered WebAuthn passkey factor.
 * Represents the information stored in the database for each passkey credential.
 *
 * @author Maruf Bepary
 */
export interface PasskeyFactor {
  /** Unique identifier for the passkey factor */
  id: string;
  /** Human-readable name for the passkey (e.g., "Main Phone", "Security Key") */
  friendly_name?: string;
  /** ISO 8601 timestamp of when the passkey was registered */
  created_at: string;
  /** ISO 8601 timestamp of when the passkey was last used for authentication, if any */
  last_used_at?: string;
}
