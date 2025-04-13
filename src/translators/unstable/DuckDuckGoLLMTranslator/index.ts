import { LLMTranslatorConfig, LLMTranslator } from '../../LLMTranslators/LLMTranslator';
import {
	DuckDuckGoLLMFetcher,
	DuckDuckGoLLMFetcherOptions,
} from './DuckDuckGoLLMFetcher';

type DuckDuckGoLLMTranslatorType = {
	llmFetcherOptions?: DuckDuckGoLLMFetcherOptions;
	translatorOptions?: Partial<LLMTranslatorConfig>;
};

export class DuckDuckGoLLMTranslator extends LLMTranslator {
	constructor({
		llmFetcherOptions,
		translatorOptions,
	}: DuckDuckGoLLMTranslatorType = {}) {
		super(new DuckDuckGoLLMFetcher(llmFetcherOptions), translatorOptions);
	}

	public static readonly translatorName: string = 'DuckDuckGoTranslator';
	public static isRequiredKey = () => false;
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
