import { DuckDuckGoFetcher } from './DuckDuckGoFetcher';
import { LLMTranslator } from '../LLMTranslator';
import { LLMTranslatorConfig } from '../LLMTranslator';

type DuckDuckGoLLMTranslatorType = {
	model: string;
	userAgent: string;
	translatorOptions: Partial<LLMTranslatorConfig>;
};

export class DuckDuckGoLLMTranslator extends LLMTranslator {
	constructor({ model, userAgent, translatorOptions }: DuckDuckGoLLMTranslatorType) {
		super(new DuckDuckGoFetcher(model, userAgent), translatorOptions);
	}

	public static readonly translatorName: string = 'DuckDuckGoTranslator';
	public static isRequiredKey = () => false;
	public static isSupportedAutoFrom = () => true;

	public static getSupportedLanguages = (): string[] => [];
}
