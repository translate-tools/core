import { getLanguageCodesISO639 } from '../../../languages';

import {
	LLMTranslator,
	LLMTranslatorRetryOptions,
	PromptGenerator,
} from '../LLMTranslator';
import { ChatGPTLLMFetcher, LLMOptions } from './ChatGPTLLMFetcher';

export class ChatGPTLLMTranslator extends LLMTranslator {
	constructor(
		config: LLMOptions & {
			getPrompt?: PromptGenerator;
			retryOptions?: LLMTranslatorRetryOptions;
		},
	) {
		const llm = new ChatGPTLLMFetcher({
			apiKey: config.apiKey,
			model: config.model,
			baseUrl: config.baseUrl,
		});
		super(llm, {
			getPrompt: config.getPrompt,
			retryOptions: {
				retryLimit: config.retryOptions?.retryLimit,
				retryTimeout: config.retryOptions?.retryTimeout,
				maxRetryTimeout: config.retryOptions?.maxRetryTimeout,
				retryBackoffFactor: config.retryOptions?.retryBackoffFactor,
			},
		});
	}

	public static readonly translatorName: string = 'ChatGPTLLMTranslator';
	public static isRequiredKey = () => true;
	public static isSupportedAutoFrom = () => true;

	// ChatGPT docs don’t list supported languages for text models, we can use the list for text-to-speech instead
	// source: https://platform.openai.com/docs/guides/text-to-speech#supported-languages
	public static getSupportedLanguages = (): string[] => {
		// eslint-disable
		// prettier-ignore
		return getLanguageCodesISO639('v1');
		// eslint-enable
	};
}
