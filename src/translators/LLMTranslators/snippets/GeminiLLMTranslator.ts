import { GeminiFetcher } from '../Fetchers/GeminiFetcher';
import { LLMTranslator, LLMTranslatorConfig } from '..';

type GeminiLLMTranslatorConfig = {
	apiKey: string;
	model: string;
	apiHost: string;
	translatorOptions: Partial<LLMTranslatorConfig>;
};

export class GeminiLLMTranslator extends LLMTranslator {
	public static readonly translatorName: string = 'GeminiLLMTranslator';

	constructor({
		apiKey,
		model,
		apiHost,
		translatorOptions,
	}: GeminiLLMTranslatorConfig) {
		super(new GeminiFetcher(apiKey, apiHost, model), translatorOptions);
	}

	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;
	public static getSupportedLanguages = (): string[] => [];
}
