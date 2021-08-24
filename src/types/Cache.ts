/**
 * Interface of cache
 */
export interface ICache {
	/**
	 * Get translation
	 */
	get: (text: string, from: string, to: string) => Promise<string | null>;

	/**
	 * Set translation
	 */
	set: (text: string, translate: string, from: string, to: string) => Promise<void>;

	/**
	 * Clear cache
	 */
	clear: () => Promise<void>;
}
