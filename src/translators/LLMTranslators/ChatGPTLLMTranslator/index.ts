import { ChatGptFetcher } from './ChatGptFetcher';
import { LLMTranslator } from '../LLMTranslator';
import { LLMTranslatorConfig } from '../LLMTranslator';

type ChatGPTLLMTranslatorConfig = {
	apiKey: string;
	model: string;
	apiHost: string;
	translatorOptions: Partial<LLMTranslatorConfig>;
};

export class ChatGPTLLMTranslator extends LLMTranslator {
	constructor({
		apiKey,
		model,
		apiHost,
		translatorOptions,
	}: ChatGPTLLMTranslatorConfig) {
		super(new ChatGptFetcher(apiKey, model, apiHost), translatorOptions);
	}

	public static readonly translatorName: string = 'ChatGPTLLMTranslator';
	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;
	public static getSupportedLanguages = (): string[] => [];
}
