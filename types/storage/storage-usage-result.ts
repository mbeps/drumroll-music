/**
 * Storage usage metrics for both per-user and global application capacity.
 * Used by account/dashboard to display storage utilization and remaining capacity.
 *
 * @author Maruf Bepary
 */
export interface StorageUsageResult {
  /** User storage usage in bytes. */
  userUsage: number;
  /** User storage limit in bytes (1GB default). */
  userLimit: number;
  /** Global application storage usage in bytes across all users. */
  globalUsage: number;
  /** Global application storage capacity in bytes (50GB default). */
  globalLimit: number;
}
