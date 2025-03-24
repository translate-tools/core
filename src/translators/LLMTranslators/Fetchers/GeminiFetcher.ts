export interface LLMFetcher {
	/**
	 * Method for request to AI model
	 */
	fetch(prompt: string): Promise<string[] | null>;

	/**
	 * Array of supported languages as ISO 639-1 codes
	 */
	getSupportedLanguages(): string[];

	/**
	 * Max length of string for `translate` or total length of strings from array for `translateBatch`
	 */
	getLengthLimit(): number;

	/**
	 * Delay between requests that required by translator to a correct work
	 */
	getRequestsTimeout(): number;
}

export class GeminiIATranslator implements LLMFetcher {
	private readonly apiKey: string;
	private model: string;
	private url: string;

	constructor(apiKey: string, model = 'gemini-2.0-flash') {
		this.apiKey = apiKey;
		this.model = model;
		this.url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
	}

	public getSupportedLanguages() {
		//TODO: check supported lang

		return ['en', 'et', 'de', 'lt', 'lv', 'fi', 'ru', 'no', 'hu', 'se'];
	}

	public readonly translatorName = `GeminiIATranslator`;

	public getLengthLimit() {
		// an increase of 1,000 characters in a request adds one second to the response time
		// response time for 2,000 characters is approximately 2 seconds
		return 2000;
	}

	public getRequestsTimeout() {
		// free access has a limit of 15 requests per minute, requiring a delay of 4 seconds between requests (60/15 = 4s).
		return 400;
	}

	public async fetch(prompt: string): Promise<string[]> {
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
			throw new Error('Response errors');
		}

		const res = await response.json();

		// TODO: validate response
		return JSON.parse(res?.candidates?.[0]?.content?.parts?.[0]?.text);
	}
}
