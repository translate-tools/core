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
	 */
	getRequestsTimeout(): number;
}

export type LLMTranslatorRetryOptions = {
	/**
	 * Maximum number of retry attempts after a failed request
	 */
	retryLimit?: number;

	/**
	 * Delay before first retry in ms; increases exponentially up to maxRetryTimeout
	 */
	retryTimeout?: number;

	/**
	 * Maximum delay before the next retry
	 */
	maxRetryTimeout?: number;

	/**
	 * An exponential multiplier used to increase the delay between retry attempts.
	 * With each subsequent attempt, the delay grows exponentially based on this factor.
	 */
	retryBackoffFactor?: number;
};
