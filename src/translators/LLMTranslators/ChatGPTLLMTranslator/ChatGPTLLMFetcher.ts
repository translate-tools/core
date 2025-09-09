import { z } from 'zod';

import { buildUrl } from '../../../utils';

import { LLMFetcher } from '..';

export const ChatGPTLLMResponseSchema = z.object({
	choices: z
		.object({ message: z.object({ content: z.string() }) })
		.array()
		.min(1),
});

export type LLMOptions = {
	apiKey: string;
	model?: string;
	baseUrl?: string;
};

export class ChatGPTLLMFetcher implements LLMFetcher {
	private readonly config;

	constructor({ apiKey, model, baseUrl }: LLMOptions) {
		this.config = {
			apiKey: apiKey,
			model: model ?? 'gpt-4o-mini',
			baseUrl: baseUrl ?? 'https://api.openai.com/v1',
		};
	}

	public getLengthLimit() {
		return 5000;
	}

	public getRequestsTimeout() {
		return 500;
	}

	public async fetch(prompt: string): Promise<string> {
		const response = await fetch(buildUrl(this.config.baseUrl, '/chat/completions'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.config.apiKey}`,
			},
			body: JSON.stringify({
				model: this.config.model,
				messages: [{ role: 'user', content: prompt }],
			}),
		});

		if (!response.ok) {
			throw new Error(
				`Request failed with status ${response.status}: ${response.statusText}`,
			);
		}

		// validate response structure
		const parseResult = ChatGPTLLMResponseSchema.parse(await response.json());

		// a list of chat completion choices, there can be more than one only if specified directly.
		// source: https://platform.openai.com/docs/api-reference/chat/object#chat/object-choices
		return parseResult.choices[0].message.content;
	}
}
