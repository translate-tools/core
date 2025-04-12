import { GeminiLLMFetcher, GeminiLLMFetcherOptions } from './GeminiFetcher';
import { LLMTranslator } from '../LLMTranslator';
import { LLMTranslatorConfig } from '../LLMTranslator';

type GeminiLLMTranslatorConfig = {
	apiKey: string;
	llmOptions?: GeminiLLMFetcherOptions;
	translatorOptions?: Partial<LLMTranslatorConfig>;
};

export class GeminiLLMTranslator extends LLMTranslator {
	public static readonly translatorName: string = 'GeminiLLMTranslator';

	constructor({ apiKey, llmOptions, translatorOptions }: GeminiLLMTranslatorConfig) {
		super(new GeminiLLMFetcher(apiKey, llmOptions), translatorOptions);
	}

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
