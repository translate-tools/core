import { z } from 'zod';
import { LLMFetcher } from '.';
import { TranslatorInstanceMembers } from '../Translator';

export type PromptGenerator = (texts: string[], from: string, to: string) => string;

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
	 * With each attempt, the delay grows based on this factor.
	 */
	retryBackoffFactor?: number;
};

export const getPrompt = (text: string[], from: string, to: string) => {
	// use full language name
	const langFormatter = new Intl.DisplayNames(['en'], { type: 'language' });
	const originLang = from == 'auto' ? 'auto' : langFormatter.of(from);
	const targetLang = langFormatter.of(to);

	return `You are a text translation service. I will provide an array of texts, and your task is to translate them from language ${originLang} to language ${targetLang}.
If I specify the source language as 'auto', you should automatically detect it and translate it into the target language I set.
The array in your response must be the same length as the one in the request. Do not add any explanations — translate strictly according to the content. 
Be careful when creating an array; it must be syntactically correct and do not change quotation marks. Return an array of translated texts while preserving their order.
Here is the JSON array of texts: ${JSON.stringify(text)}`;
};

export class LLMTranslator implements TranslatorInstanceMembers {
	private readonly config;

	constructor(
		private readonly llm: LLMFetcher,
		options?: {
			getPrompt?: PromptGenerator;
			retryOptions?: LLMTranslatorRetryOptions;
		},
	) {
		this.config = {
			retryLimit: options?.retryOptions?.retryLimit ?? 3,
			retryTimeout:
				options?.retryOptions?.retryTimeout ?? this.llm.getRequestsTimeout(),
			maxRetryTimeout: options?.retryOptions?.maxRetryTimeout,
			retryBackoffFactor: options?.retryOptions?.retryBackoffFactor,
			getPrompt: options?.getPrompt ?? getPrompt,
		};
	}

	public async translate(text: string, from: string, to: string) {
		const translated = await this.translateBatch([text], from, to);
		const validatedTranslation = z
			.array(z.string())
			.min(1, { message: 'Expected array with translated string' })
			.parse(translated);

		return validatedTranslation[0];
	}

	public async translateBatch(text: string[], from: string, to: string) {
		let attempt = 0;

		while (true) {
			try {
				// first request without delay
				if (attempt > 0) {
					await this.waitRetryDelay(attempt);
				}

				const response = await this.llm.fetch(
					this.config.getPrompt(text, from, to),
				);

				const textResponse: string[] = JSON.parse(response);
				const validateResult = z
					.string()
					.array()
					.min(text.length, {
						message:
							'The response must be the same length as the requested array',
					})
					.parse(textResponse);

				return validateResult;
			} catch (error) {
				attempt++;
				if (attempt >= this.config.retryLimit) throw error;
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

	/**
	 * Calculates retry delays: starts with retryTimeout,
	 * then increases exponentially (retryTimeout * factor^n) up to maxRetryTimeout (default: 4000).
	 * Default retryBackoffFactor: 1.5
	 */
	private waitRetryDelay(attempt: number) {
		const maxTimeout = this.config.maxRetryTimeout ?? 4000;
		const factor = this.config.retryBackoffFactor ?? 1.5;
		const delay = Math.min(
			maxTimeout,
			this.config.retryTimeout * factor ** (attempt - 1),
		);

		return new Promise((r) => setTimeout(r, delay));
	}
}
