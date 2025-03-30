import { LLMTranslator } from './LLMTranslator';
import { ChatGptFetcher } from './Fetchers/ChatGptFetcher';
import { TranslatorConfig } from './LLMFetcher';

export class ChatGPTTransalator extends LLMTranslator {
	constructor({ apiKey, model, apiHost, translatorOptions }: TranslatorConfig) {
		super(new ChatGptFetcher(apiKey, model, apiHost), translatorOptions);
	}

	public static readonly translatorName: string = 'ChatGPTTranslator';
	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;

	public getLengthLimit = () => super.getLengthLimit();

	public getRequestsTimeout = () => super.getRequestsTimeout();

	public translate = (text: string, from: string, to: string) =>
		super.translate(text, from, to);

	public translateBatch = (text: string[], from: string, to: string) =>
		super.translateBatch(text, from, to);
}
