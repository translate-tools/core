import { z } from 'zod';
import { LLMFetcher } from '..';

export class ChatGPTLLMFetcher implements LLMFetcher {
	private readonly apiUrl: string;
	private readonly fetcherOptions;

	constructor(options?: { apiKey: string; model?: string; apiOrigin?: string }) {
		this.fetcherOptions = {
			apiKey: options?.apiKey,
			model: options?.model ?? 'gpt-4o-mini',
			apiOrigin: options?.apiOrigin ?? 'https://api.openai.com',
		};
		this.apiUrl = new URL(
			'/v1/chat/completions',
			this.fetcherOptions.apiOrigin,
		).toString();
	}

	public getLengthLimit() {
		return 5000;
	}

	public getRequestsTimeout() {
		return 500;
	}

	public async fetch(prompt: string): Promise<string> {
		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.fetcherOptions.apiKey}`,
			},
			body: JSON.stringify({
				model: this.fetcherOptions.model,
				messages: [{ role: 'user', content: prompt }],
			}),
		});

		if (!response.ok) {
			throw new Error(
				`Request failed with status ${response.status}: ${response.statusText}`,
			);
		}

		const data = await response.json();

		// validate response structure
		const parseResult = z
			.object({
				choices: z
					.object({ message: z.object({ content: z.string() }) })
					.array()
					.min(1),
			})
			.parse(data);

		// a list of chat completion choices, there can be more than one only if specified directly.
		// source: https://platform.openai.com/docs/api-reference/chat/object#chat/object-choices
		return parseResult.choices[0].message.content;
	}
}
