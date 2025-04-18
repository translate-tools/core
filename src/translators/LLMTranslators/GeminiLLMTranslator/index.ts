import { GeminiLLMFetcher } from './GeminiLLMFetcher';
import { LLMTranslator } from '../LLMTranslator';

export class GeminiLLMTranslator extends LLMTranslator {
	public static readonly translatorName: string = 'GeminiLLMTranslator';

	constructor(config: {
		apiKey: string;
		model?: string;
		getPrompt?: (texts: string[], from: string, to: string) => string;

		apiOrigin?: string;
		retryOptions?: {
			retryLimit?: number;
			retryTimeout?: number;
			maxRetryTimeout?: number;
			retryBackoffFactor?: number;
		};
	}) {
		super(
			new GeminiLLMFetcher({
				apiKey: config.apiKey,
				model: config.model,
				apiOrigin: config.apiOrigin,
			}),
			{
				getPrompt: config.getPrompt,
				retryLimit: config.retryOptions?.retryLimit,
				retryTimeout: config.retryOptions?.retryTimeout,
				maxRetryTimeout: config.retryOptions?.maxRetryTimeout,
				retryBackoffFactor: config.retryOptions?.retryBackoffFactor,
			},
		);
	}

	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;

	// source: https://ai.google.dev/gemini-api/docs/models#supported-languages
	public static getSupportedLanguages = (): string[] => {
		// eslint-disable
		// prettier-ignore
		return [
			"ar", "bn", "bg", "zh", "hr", "cs", "da", "nl", "en",
			"et", "fa", "fi", "fr", "de", "el", "gu", "he", "hi", "hu",
			"id", "it", "ja", "kn", "ko", "lv", "lt", "ml", "mr", "no",
			"pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sw", "sv",
			"ta", "te", "th", "tr", "uk", "ur", "vi"
		];
		// eslint-enable
	};
}
