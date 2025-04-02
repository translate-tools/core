import { DuckDuckGoFetcher } from '../Fetchers/DuckDuckGoFetcher';
import { TranslatorConfig } from '../LLMTranslatorTypes';
import { LLMTranslator } from '../LLMTranslator';

export class DuckDuckGoTranslator extends LLMTranslator {
	constructor({ model, userAgent, translatorOptions }: TranslatorConfig) {
		super(new DuckDuckGoFetcher(model, userAgent), translatorOptions);
	}

	public static readonly translatorName: string = 'DuckDuckGoTranslator';
	public static isRequiredKey = () => false;
	public static isSupportedAutoFrom = () => true;

	public getLengthLimit = () => super.getLengthLimit();

	public getRequestsTimeout = () => super.getRequestsTimeout();

	public translate = (text: string, from: string, to: string) =>
		super.translate(text, from, to);

	public translateBatch = (text: string[], from: string, to: string) =>
		super.translateBatch(text, from, to);
}
