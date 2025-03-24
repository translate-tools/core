import { BaseTranslator } from '../BaseTranslator';
import { LLMFetcher } from './Fetchers/GeminiFetcher';

type LLMTranslatorOptionals = {
	getPrompt: (texts: string[], from: string, to: string) => string;
	retries?: number;
};

export class LLMTranslator extends BaseTranslator {
	private readonly llm: LLMFetcher;

	private readonly optionals: LLMTranslatorOptionals;

	constructor(llm: LLMFetcher, optionals: LLMTranslatorOptionals) {
		super();
		this.llm = llm;
		this.optionals = { ...optionals, retries: optionals.retries ?? 3 };
	}

	//TODO: think about return the llmFetcher name

	public static readonly translatorName: string = 'LLMTranslator';

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
		// const startTime: number = performance.now();

		const sendRequest = async (count: number) => {
			try {
				const response = await this.llm.fetch(
					this.optionals.getPrompt(text, from, to),
				);

				//TODO: validate with zod
				if (!response || response.length !== text.length) {
					throw new Error('Unexpected response');
				}

				// const endTime = performance.now();
				// console.log(`Response time: ${(endTime - startTime).toFixed(2)} ms`);

				return response;
			} catch (error) {
				if (count < 3) {
					console.log(`The attempt number: ${count}`);
					sendRequest(count + 1);
				}

				throw new Error('Error in translation ');
			}
		};
		return sendRequest(0);
	}
}

// const getPrompt = (text: string[], from: string, to: string) => {
// 	const prompt = `You are a text translation service. I will provide an array of texts, and your task is to translate them from language ${from} to language ${to}.
// If I specify the source language as 'auto', you should automatically detect it and translate it into the target language I set.
// Do not add any explanations—translate strictly according to the content. Return an array of translated texts while preserving their order.
// Here is the array of texts: ${JSON.stringify(text)}`;
// 	return prompt;
// };

// const geminiFetcher = new GeminiIATranslator('AIzaSyChAsqxOkms7dREYpnjjSvNDLI7RaJ6fIU');
// const foo = new LLMTranslator(geminiFetcher, { getPrompt });
// foo.translateBatch(['Hello', 'How a u'], 'auto', 'ru');
