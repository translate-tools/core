import { LLMTranslatorConfig, LLMTranslator } from '../../LLMTranslators/LLMTranslator';
import { DuckDuckGoFetcher } from './DuckDuckGoFetcher';

type DuckDuckGoLLMTranslatorType = {
	model?: string;
	userAgent?: string;
	translatorOptions?: Partial<LLMTranslatorConfig>;
};

export class DuckDuckGoLLMTranslator extends LLMTranslator {
	constructor({
		model,
		userAgent,
		translatorOptions,
	}: DuckDuckGoLLMTranslatorType = {}) {
		super(new DuckDuckGoFetcher(model, userAgent), translatorOptions);
	}

	public static readonly translatorName: string = 'DuckDuckGoTranslator';
	public static isRequiredKey = () => false;
	public static isSupportedAutoFrom = () => true;

	public static getSupportedLanguages = (): string[] => [];
}
