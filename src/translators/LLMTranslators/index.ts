export interface LLMFetcher {
	/**
	 * Method for request to AI model
	 */
	fetch(prompt: string): Promise<string>;

	/**
	 * Max length of string for prompt
	 */
	getLengthLimit(): number;

	/**
	 * Delay between requests to comply with the requests-per-minute limit.
	 * Takes requests per minute and returns delay in milliseconds.
	 */
	getRequestsTimeout(rpmLimit?: number): number;
}
