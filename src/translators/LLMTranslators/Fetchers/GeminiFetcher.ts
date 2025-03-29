import { z } from 'zod';
import { LLMFetcher } from '../LLMFetcher';

export class GeminiFetcher implements LLMFetcher {
	private url: string;

	constructor(
		private readonly apiKey: string,
		private readonly model = 'gemini-2.0-flash',
	) {
		this.url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
	}

	public getLengthLimit() {
		// an increase of 1,000 characters in a request adds one second to the response time
		// response time for 2,000 characters is approximately 2 seconds
		return 2000;
	}

	public getRequestsTimeout() {
		// free access has a limit of 15 requests per minute, requiring a delay of 4 seconds between requests (60/15 = 4s).
		return 400;
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

		const parts = parseResult.candidates[0].content.parts;

		// join all parts in one string
		return parts.map((part) => part.text).join('');
	}
}
