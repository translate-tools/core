import { z } from 'zod';
import { TranslatorInstanceMembers } from '../Translator';

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
	 * Delay between requests to comply with the requests per minute limit
	 */
	getRequestsTimeout(): number;
}

export type LLMTranslatorConfig = {
	getPrompt: (texts: string[], from: string, to: string) => string;
	/**
	 * The retryLimit - number of retries on error, must be a natural number
	 */
	retryLimit: number;
};

const getPrompt = (text: string[], from: string, to: string) => {
	return `You are a text translation service. I will provide an array of texts, and your task is to translate them from language ${from} to language ${to}.
If I specify the source language as 'auto', you should automatically detect it and translate it into the target language I set.
If the array contains exactly one text, return a array with one element containing the complete, unified translation (do not split it into multiple strings).
Do not add any explanations — translate strictly according to the content. Be careful when creating an array; it must be syntactically correct and do not change quotation marks. Return an array of translated texts while preserving their order.
Here is the JSON array of texts: ${JSON.stringify(text)}`;
};

export class LLMTranslator implements TranslatorInstanceMembers {
	private readonly config: LLMTranslatorConfig;

	constructor(
		private readonly llm: LLMFetcher,
		options?: Partial<LLMTranslatorConfig>,
	) {
		this.config = {
			...options,
			retryLimit: options?.retryLimit ?? 3,
			getPrompt: options?.getPrompt ?? getPrompt,
		};
	}

	public async translate(text: string, from: string, to: string): Promise<string> {
		return this.translateBatch([text], from, to).then((resp) => resp[0]);
	}

	public async translateBatch(text: string[], from: string, to: string) {
		let attempt = 0;

		while (true) {
			try {
				console.log('request', text.length, text);

				const response = await this.llm.fetch(
					this.config.getPrompt(text, from, to),
				);

				console.log('response', response.length, response);

				// response length should be equal to request length
				const validateResult = z
					.string()
					.array()
					.min(text.length)
					.parse(JSON.parse(response));

				console.log('validate response', validateResult.length, validateResult);

				return validateResult;
			} catch (error) {
				if (attempt + 1 === this.config.retryLimit) {
					throw error;
				}
				attempt++;
			}
		}
	}

	public getLengthLimit() {
		return this.llm.getLengthLimit();
	}

	public getRequestsTimeout() {
		return this.llm.getRequestsTimeout();
	}

	public checkLimitExceeding(text: string | string[]) {
		const plainText = Array.isArray(text) ? text.join('') : text;
		const extra = plainText.length - this.getLengthLimit();
		return extra > 0 ? extra : 0;
	}
}
