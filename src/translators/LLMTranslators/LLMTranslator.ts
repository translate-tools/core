import { z } from 'zod';
import { BaseTranslator } from '../BaseTranslator';
import { LLMFetcher } from './LLMTranslatorTypes';

export type LLMTranslatorOptions = {
	getPrompt?: (texts: string[], from: string, to: string) => string;
	retries?: number;
};

type LLMTranslatorConfig = {
	getPrompt: (texts: string[], from: string, to: string) => string;
	retries: number;
};

export class LLMTranslator extends BaseTranslator {
	private readonly config: LLMTranslatorConfig;

	constructor(private readonly llm: LLMFetcher, options?: LLMTranslatorOptions) {
		super();

		this.config = {
			...options,
			retries: options?.retries ?? 3,
			getPrompt:
				options?.getPrompt ??
				((text: string[], from: string, to: string) => {
					return `You are a text translation service. I will provide an array of texts, and your task is to translate them from language ${from} to language ${to}.
If I specify the source language as 'auto', you should automatically detect it and translate it into the target language I set.
Do not add any explanations—translate strictly according to the content. Be careful when creating an array, it must be syntactically correct and do not change quotation marks. Return an array of translated texts while preserving their order.
Here is the array of texts: ${JSON.stringify(text)}`;
				}),
		};
	}

	public getLengthLimit() {
		return this.llm.getLengthLimit();
	}

	public getRequestsTimeout() {
		return this.llm.getRequestsTimeout();
	}

	public async translate(text: string, from: string, to: string): Promise<string> {
		return this.translateBatch([text], from, to).then((resp) => resp[0]);
	}

	public async translateBatch(text: string[], from: string, to: string) {
		for (let count = 0; count < this.config.retries; count++) {
			try {
				const response = await this.llm.fetch(
					this.config.getPrompt(text, from, to),
				);

				// validate response
				const validateResult = z.array(z.string()).parse(JSON.parse(response));

				if (validateResult.length !== text.length) {
					throw new Error(
						`Unexpected response: expected an array of length ${text.length}, but received an array of length ${validateResult.length}.`,
					);
				}

				return validateResult;
			} catch (error) {
				if (count === this.config.retries - 1) {
					throw error;
				}
			}
		}
		throw new Error('Failed to translate');
	}
}
