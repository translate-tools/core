import { z } from 'zod';

import { LLMFetcher } from '../../LLMTranslators';

function processRawText(rawText: string) {
	const texts: {
		message: string;
		created: number;
	}[] = [];

	for (const line of rawText.split('\n\n')) {
		const prefix = 'data: ';
		if (!line.startsWith(prefix)) continue;

		const text = line.slice(prefix.length);
		if (text === '[DONE]') break;

		const json = z
			.object({
				action: z.string().optional(),
				type: z.string().optional(),
				status: z.string().optional(),
				message: z.string().optional(),
			})
			.parse(JSON.parse(text), { error: () => 'Unexpected data' });

		// In case of an error, DuckDuckGo may return a response containing an error object
		if (json.action === 'error') {
			const error = `The received text contains error object; action: ${json.action}: status: ${json.status}, type: ${json.type}`;
			console.warn(error);
			throw new Error(error);
		}

		if (json.message === undefined) continue;

		const validText = z
			.object({ message: z.string(), created: z.number() })
			.parse(json);

		texts.push(validText);
	}

	return texts
		.sort((a, b) => a.created - b.created)
		.map((i) => i.message)
		.join('');
}

export class DuckDuckGoLLMFetcher implements LLMFetcher {
	private readonly options;

	constructor(options?: { model?: string; headers?: Record<string, string> }) {
		this.options = {
			model: options?.model ?? 'o3-mini',
			headers: {
				...options?.headers,
				'User-Agent':
					options?.headers?.['User-Agent'] ||
					'Mozilla/5.0 (X11; Linux i686; rv:124.0) Gecko/20100101 Firefox/124.0',
			},
		};
	}

	public getLengthLimit = () => 2300;
	public getRequestsTimeout = () => 2000;

	private key: string | null = null;
	public async getKey() {
		if (!this.key) {
			const response = await fetch('https://duckduckgo.com/duckchat/v1/status', {
				headers: {
					...this.options.headers,
					Accept: '*/*',
					'x-vqd-accept': '1',
					Priority: 'u=4',
					Pragma: 'no-cache',
				},
			});
			if (!response.ok) {
				throw new Error(
					`Request failed with status ${response.status}: ${response.statusText}`,
				);
			}

			// extract key
			const key = response.headers.get('x-vqd-4');
			const validKey = z
				.string()
				.min(1, { message: "Header 'x-vqd-4' is missing or empty" })
				.parse(key);

			this.key = validKey;
		}
		return this.key;
	}

	public async fetch(prompt: string): Promise<string> {
		const key = await this.getKey();
		const response = await fetch('https://duckduckgo.com/duckchat/v1/chat', {
			method: 'POST',
			headers: {
				...this.options.headers,
				Accept: 'text/event-stream',
				'Content-Type': 'application/json',
				'X-Vqd-4': key,
				Priority: 'u=4',
			},
			body: JSON.stringify({
				model: this.options.model,
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
			}),
		});

		if (!response.ok) {
			// when the key is not valid or deprecated server send 400 status
			// This is not a specific status, but we can try reloading the key
			// In the next method call, a new key is will be required
			if (response.status === 400) {
				this.key = null;
			}
			throw new Error(
				`Request failed with status ${response.status}: ${response.statusText}`,
			);
		}

		const responseText = await response.text();
		return processRawText(responseText);
	}
}
