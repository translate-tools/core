import {
	LLMTranslator,
	LLMTranslatorRetryOptions,
	PromptGenerator,
} from '../LLMTranslator';
import { ChatGPTLLMFetcher } from './ChatGPTLLMFetcher';

export class ChatGPTLLMTranslator extends LLMTranslator {
	constructor(config: {
		apiKey: string;
		model?: string;
		getPrompt?: PromptGenerator;
		apiOrigin?: string;
		retryOptions?: LLMTranslatorRetryOptions;
	}) {
		const llm = new ChatGPTLLMFetcher({
			apiKey: config.apiKey,
			model: config.model,
			apiOrigin: config.apiOrigin,
		});
		super(llm, {
			getPrompt: config.getPrompt,
			retryOptions: {
				retryLimit: config.retryOptions?.retryLimit,
				retryTimeout: config.retryOptions?.retryTimeout,
				maxRetryTimeout: config.retryOptions?.maxRetryTimeout,
				retryBackoffFactor: config.retryOptions?.retryBackoffFactor,
			},
		});
	}

	public static readonly translatorName: string = 'ChatGPTLLMTranslator';
	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;

	// ChatGPT docs don’t list supported languages for text models, we can use the list for text-to-speech instead
	// source: https://platform.openai.com/docs/guides/text-to-speech#supported-languages
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
