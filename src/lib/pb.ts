/**
 * PocketBase Client Configuration
 * 
 * Base URL is read from environment variable VITE_PB_URL.
 * If not set, defaults to: http://gmo021.cansportsvg.com:8090
 * 
 * Usage:
 *   Set VITE_PB_URL=http://gmo021.cansportsvg.com:8090 in .env file
 *   Default: http://gmo021.cansportsvg.com:8090
 */

const DEFAULT_PB_URL = "http://gmo021.cansportsvg.com:8090";

export const PB_BASE_URL = import.meta.env.VITE_PB_URL || DEFAULT_PB_URL;

/**
 * Get full API URL for a collection
 * @param collection - Collection name (e.g., "ma_server")
 * @returns Full API URL
 */
export function getCollectionUrl(collection: string): string {
  return `${PB_BASE_URL}/api/collections/${collection}/records`;
}

/**
 * Get full API URL for a specific record
 * @param collection - Collection name
 * @param id - Record ID
 * @returns Full API URL
 */
export function getRecordUrl(collection: string, id: string): string {
  return `${PB_BASE_URL}/api/collections/${collection}/records/${id}`;
}
