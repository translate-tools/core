import { GeminiFetcher } from '../Fetchers/GeminiFetcher';
import { TranslatorConfig } from '../LLMFetcher';
import { LLMTranslator } from '../LLMTranslator';

export class GeminiTransaltor extends LLMTranslator {
	constructor({ apiKey, model, apiHost, translatorOptions }: TranslatorConfig) {
		super(new GeminiFetcher(apiKey, apiHost, model), translatorOptions);
	}

	public static readonly translatorName: string = 'GeminiTransalator';
	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;

	public getLengthLimit = () => super.getLengthLimit();

	public getRequestsTimeout = () => super.getRequestsTimeout();

	public translate = (text: string, from: string, to: string) =>
		super.translate(text, from, to);

	public translateBatch = (text: string[], from: string, to: string) =>
		super.translateBatch(text, from, to);
}
