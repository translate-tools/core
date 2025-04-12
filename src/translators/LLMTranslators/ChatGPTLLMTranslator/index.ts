import { ChatGPTLLMFetcher, ChatGptLLMFetcherOptions } from './ChatGPTLLMFetcher';
import { LLMTranslator } from '../LLMTranslator';
import { LLMTranslatorConfig } from '../LLMTranslator';

type ChatGPTLLMTranslatorConfig = {
	apiKey: string;
	llmFetcherOptions?: ChatGptLLMFetcherOptions;
	translatorOptions?: Partial<LLMTranslatorConfig>;
};

export class ChatGPTLLMTranslator extends LLMTranslator {
	constructor({
		apiKey,
		llmFetcherOptions,
		translatorOptions,
	}: ChatGPTLLMTranslatorConfig) {
		super(new ChatGPTLLMFetcher(apiKey, llmFetcherOptions), translatorOptions);
	}

	public static readonly translatorName: string = 'ChatGPTLLMTranslator';
	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;
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
