import {
	GeneratePrompt,
	LLMTranslator,
	LLMTranslatorRetryOptions,
} from '../../LLMTranslators/LLMTranslator';
import { DuckDuckGoLLMFetcher } from './DuckDuckGoLLMFetcher';

export class DuckDuckGoLLMTranslator extends LLMTranslator {
	constructor(config?: {
		model?: string;
		headers?: Record<string, string>;
		getPrompt?: GeneratePrompt;
		retryOptions?: LLMTranslatorRetryOptions;
	}) {
		super(
			new DuckDuckGoLLMFetcher({ model: config?.model, headers: config?.headers }),
			{
				getPrompt: config?.getPrompt,
				retryOptions: {
					retryLimit: config?.retryOptions?.retryLimit,
					retryTimeout: config?.retryOptions?.retryTimeout,
					maxRetryTimeout: config?.retryOptions?.maxRetryTimeout,
					retryBackoffFactor: config?.retryOptions?.retryBackoffFactor,
				},
			},
		);
	}

	public static readonly translatorName: string = 'DuckDuckGoLLMTranslator';
	public static isRequiredKey = () => false;
	public static isSupportedAutoFrom = () => true;

	// Use list form chatgpt docs: https://platform.openai.com/docs/guides/text-to-speech#supported-languages
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
