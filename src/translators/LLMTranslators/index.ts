import { LLMTranslatorConfig } from './LLMTranslator';

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

export type BaseLLMTranslatorConfig<F> = {
	llmFetcherOptions?: Partial<F>;
	translatorOptions?: Partial<LLMTranslatorConfig>;
};

export type CommonLLMFetcherOptions = {
	model: string;
	apiOrigin: string;
	rpmLimit?: number;
};
