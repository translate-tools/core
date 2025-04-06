import { z } from 'zod';
import { LLMFetcher } from '..';

export class GeminiFetcher implements LLMFetcher {
	private readonly url;
	constructor(
		private readonly apiKey: string,
		private readonly model = 'gemini-2.0-flash',
		private readonly apiHost = `generativelanguage.googleapis.com`,
	) {
		this.url = new URL(
			`/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
			`https://${this.apiHost}`,
		).toString();
	}

	public getLengthLimit() {
		return 5000;
	}

	public getRequestsTimeout(rpmLimit?: number) {
		return rpmLimit ? (60 * 1000) / rpmLimit : 500;
	}

	public async fetch(prompt: string): Promise<string> {
		const response = await fetch(this.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [{ role: 'user', parts: [{ text: prompt }] }],
			}),
		});

		if (!response.ok) {
			throw new Error(
				`Request failed with status ${response.status}: ${response.statusText}`,
			);
		}

		const res = await response.json();

		// validate response structure
		const parseResult = z
			.object({
				candidates: z
					.array(
						z.object({
							content: z.object({
								parts: z.array(z.object({ text: z.string() })),
							}),
						}),
					)
					.min(1),
			})
			.parse(res);

		// content.parts contains ordered segments that together may form a complete response from the LLM
		// each segment may contain different types of data (e.g., text, functions, etc.), we join all text parts to get the complete response
		// documentation source: https://ai.google.dev/api/caching#Content

		// join all parts in one string
		const text = parseResult.candidates[0].content.parts
			.map((part) => part.text)
			.join('');

		// for large, poorly structured code, the gemini add extraneous characters
		return text.replace(/^```json\s*?|\s*?```$/g, '').trim();
	}
}
