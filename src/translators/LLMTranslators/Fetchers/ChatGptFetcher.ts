import { z } from 'zod';
import { LLMFetcher } from '..';

export class ChatGptFetcher implements LLMFetcher {
	private readonly apiUrl: string;
	constructor(
		private readonly apiKey: string,
		private readonly model = 'gpt-4o-mini',
		private readonly apiHost = 'api.openai.com',
	) {
		this.apiUrl = new URL(
			'v1/chat/completions',
			`https://${this.apiHost}`,
		).toString();
	}

	public getLengthLimit() {
		return 5000;
	}

	/**
	 * The getRequestsTimeout - receive number of request per minute,
	 * return value in millisecond
	 */
	public getRequestsTimeout(rpmLimit?: number) {
		return rpmLimit ? (60 * 1000) / rpmLimit : 500;
	}

	public async fetch(prompt: string): Promise<string> {
		const response = await fetch(this.apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				model: this.model,
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
					.array(z.object({ message: z.object({ content: z.string() }) }))
					.min(1),
			})
			.parse(data);

		// a list of chat completion choices, there can be more than one only if specified directly.
		// source: https://platform.openai.com/docs/api-reference/chat/object#chat/object-choices

		return parseResult.choices[0].message.content;
	}
}
